# InvenCare AWS EC2 Deployment Guide

This guide covers deploying the InvenCare inventory management application to AWS EC2 using Amazon Linux 2023.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [AWS Infrastructure Setup](#aws-infrastructure-setup)
3. [EC2 Instance Setup](#ec2-instance-setup)
4. [Application Deployment](#application-deployment)
5. [Database Setup](#database-setup)
6. [Production Configuration](#production-configuration)
7. [SSL/HTTPS Setup](#sslhttps-setup)
8. [Monitoring & Maintenance](#monitoring--maintenance)
9. [Troubleshooting](#troubleshooting)

## Prerequisites

- AWS Account with appropriate permissions
- Domain name (optional, for SSL)
- Local development environment with AWS CLI

## AWS Infrastructure Setup

### 1. Create VPC and Security Groups

```bash
# Create VPC
aws ec2 create-vpc --cidr-block 10.0.0.0/16 --tag-specifications 'ResourceType=vpc,Tags=[{Key=Name,Value=invencare-vpc}]'

# Create Internet Gateway
aws ec2 create-internet-gateway --tag-specifications 'ResourceType=internet-gateway,Tags=[{Key=Name,Value=invencare-igw}]'

# Create Subnets
aws ec2 create-subnet --vpc-id vpc-xxxxxxxxx --cidr-block 10.0.1.0/24 --availability-zone us-east-1a --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=invencare-public-subnet}]'

# Create Security Group for Web Server
aws ec2 create-security-group \
  --group-name invencare-web-sg \
  --description "Security group for InvenCare web server" \
  --vpc-id vpc-xxxxxxxxx

# Add rules to security group
aws ec2 authorize-security-group-ingress \
  --group-id sg-xxxxxxxxx \
  --protocol tcp \
  --port 22 \
  --cidr 0.0.0.0/0

aws ec2 authorize-security-group-ingress \
  --group-id sg-xxxxxxxxx \
  --protocol tcp \
  --port 80 \
  --cidr 0.0.0.0/0

aws ec2 authorize-security-group-ingress \
  --group-id sg-xxxxxxxxx \
  --protocol tcp \
  --port 443 \
  --cidr 0.0.0.0/0

aws ec2 authorize-security-group-ingress \
  --group-id sg-xxxxxxxxx \
  --protocol tcp \
  --port 3000 \
  --cidr 0.0.0.0/0
```

### 2. Launch EC2 Instance

```bash
# Launch EC2 instance
aws ec2 run-instances \
  --image-id ami-0c02fb55956c7d316 \
  --count 1 \
  --instance-type t3.medium \
  --key-name your-key-pair \
  --security-group-ids sg-xxxxxxxxx \
  --subnet-id subnet-xxxxxxxxx \
  --associate-public-ip-address \
  --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=invencare-server}]' \
  --user-data file://user-data.sh
```

### 3. Create RDS MySQL Instance

```bash
# Create DB Subnet Group
aws rds create-db-subnet-group \
  --db-subnet-group-name invencare-db-subnet-group \
  --db-subnet-group-description "Subnet group for InvenCare database" \
  --subnet-ids subnet-xxxxxxxxx subnet-xxxxxxxxy

# Create RDS Security Group
aws ec2 create-security-group \
  --group-name invencare-db-sg \
  --description "Security group for InvenCare RDS database" \
  --vpc-id vpc-xxxxxxxxx

# Allow MySQL access from web server security group
aws ec2 authorize-security-group-ingress \
  --group-id sg-db-xxxxxxxxx \
  --protocol tcp \
  --port 3306 \
  --source-group sg-xxxxxxxxx

# Create RDS instance
aws rds create-db-instance \
  --db-instance-identifier invencare-database \
  --db-instance-class db.t3.micro \
  --engine mysql \
  --engine-version 8.0.35 \
  --master-username admin \
  --master-user-password 'YourSecurePassword123!' \
  --allocated-storage 20 \
  --storage-type gp2 \
  --vpc-security-group-ids sg-db-xxxxxxxxx \
  --db-subnet-group-name invencare-db-subnet-group \
  --backup-retention-period 7 \
  --multi-az \
  --storage-encrypted \
  --db-name invencare
```

## EC2 Instance Setup

### 1. Connect to Instance

```bash
ssh -i your-key-pair.pem ec2-user@your-instance-public-ip
```

### 2. Update System and Install Dependencies

```bash
# Update system
sudo dnf update -y

# Install Node.js 18.x
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo dnf install -y nodejs

# Install additional dependencies
sudo dnf install -y git nginx mysql

# Install PM2 globally
sudo npm install -g pm2

# Install build tools
sudo dnf groupinstall -y "Development Tools"
```

### 3. Create Application User

```bash
# Create application user
sudo useradd -m -s /bin/bash invencare
sudo usermod -aG wheel invencare

# Create application directory
sudo mkdir -p /opt/invencare
sudo chown invencare:invencare /opt/invencare
```

## Application Deployment

### 1. Clone and Setup Application

```bash
# Switch to application user
sudo su - invencare

# Clone repository (or upload files)
cd /opt/invencare
git clone https://your-repo/invencare.git .

# Or if uploading manually:
# scp -i your-key-pair.pem -r ./invencare-app/ ec2-user@your-instance-ip:/tmp/
# sudo mv /tmp/invencare-app/* /opt/invencare/
# sudo chown -R invencare:invencare /opt/invencare

# Install dependencies
npm install --production
```

### 2. Create Environment Configuration

```bash
# Create production environment file
cat > /opt/invencare/.env << EOF
NODE_ENV=production
PORT=3000

# Database Configuration
RDS_HOSTNAME=your-rds-endpoint.region.rds.amazonaws.com
RDS_USERNAME=admin
RDS_PASSWORD=YourSecurePassword123!
RDS_DB_NAME=invencare
RDS_PORT=3306

# AWS Configuration
AWS_REGION=us-east-1

# Cognito Configuration
COGNITO_USER_POOL_ID=us-east-1_xxxxxxxxx
COGNITO_USER_POOL_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx

# Lambda Functions
LAMBDA_ANALYTICS_FUNCTION=invencare-analytics-processor
LAMBDA_TRANSACTION_ANALYTICS_FUNCTION=invencare-transaction-analytics
LAMBDA_TRANSACTION_PROCESSOR_FUNCTION=invencare-transaction-processor

# Application Settings
JWT_SECRET=your-jwt-secret-key-here
SESSION_SECRET=your-session-secret-here
EOF

# Secure environment file
chmod 600 /opt/invencare/.env
```

### 3. Build Application

```bash
# Build the application
npm run build

# If you have separate build commands:
# npm run build:client
# npm run build:server
```

### 4. Setup PM2 Process Manager

```bash
# Create PM2 ecosystem file
cat > /opt/invencare/ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'invencare',
    script: './server/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/var/log/invencare/error.log',
    out_file: '/var/log/invencare/out.log',
    log_file: '/var/log/invencare/combined.log',
    time: true,
    max_memory_restart: '1G',
    node_args: '--max-old-space-size=1024'
  }]
};
EOF

# Create log directory
sudo mkdir -p /var/log/invencare
sudo chown invencare:invencare /var/log/invencare

# Start application with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## Database Setup

### 1. Connect to RDS and Create Schema

```bash
# Connect to RDS instance
mysql -h your-rds-endpoint.region.rds.amazonaws.com -u admin -p invencare

# Run the SQL schema and sample data from server/index.js comments
# Copy the SQL from the comments and execute:
```

```sql
-- Create all tables
CREATE TABLE stores (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  zip_code VARCHAR(20),
  phone VARCHAR(20),
  manager_id VARCHAR(255),
  status ENUM('active', 'inactive', 'maintenance') DEFAULT 'active',
  timezone VARCHAR(50) DEFAULT 'UTC',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status (status),
  INDEX idx_manager (manager_id)
);

-- [Continue with all other CREATE TABLE statements from server/index.js comments]

-- Insert sample data
INSERT INTO stores (id, name, address, city, state, zip_code, phone, manager_id, status, timezone) VALUES
('store_001', 'Downtown Store', '123 Main Street', 'New York', 'NY', '10001', '+1-555-0101', 'mgr_001', 'active', 'America/New_York'),
('store_002', 'Mall Location', '456 Shopping Center Blvd', 'New York', 'NY', '10002', '+1-555-0102', 'mgr_002', 'active', 'America/New_York'),
('store_003', 'Uptown Branch', '789 North Avenue', 'New York', 'NY', '10003', '+1-555-0103', 'mgr_003', 'active', 'America/New_York'),
('store_004', 'Westside Market', '321 West Boulevard', 'New York', 'NY', '10004', '+1-555-0104', 'mgr_004', 'active', 'America/New_York');

-- [Continue with all other INSERT statements from server/index.js comments]
```

### 2. Verify Database Connection

```bash
# Test database connection from application
cd /opt/invencare
node -e "
const mysql = require('mysql2/promise');
const config = {
  host: process.env.RDS_HOSTNAME,
  user: process.env.RDS_USERNAME,
  password: process.env.RDS_PASSWORD,
  database: process.env.RDS_DB_NAME
};
mysql.createConnection(config).then(conn => {
  console.log('Database connection successful');
  conn.end();
}).catch(err => console.error('Database connection failed:', err));
"
```

## Production Configuration

### 1. Configure Nginx Reverse Proxy

```bash
# Exit from invencare user back to ec2-user
exit

# Configure Nginx
sudo tee /etc/nginx/conf.d/invencare.conf << EOF
upstream invencare_app {
    server 127.0.0.1:3000;
}

server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript application/json;

    # Static files
    location /assets/ {
        alias /opt/invencare/dist/assets/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # API routes
    location /api/ {
        proxy_pass http://invencare_app;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 86400;
    }

    # Main application
    location / {
        proxy_pass http://invencare_app;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    # Health check
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
EOF

# Test Nginx configuration
sudo nginx -t

# Start and enable Nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

### 2. Configure Firewall

```bash
# Configure firewall
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --permanent --add-service=ssh
sudo firewall-cmd --reload
```

## SSL/HTTPS Setup

### 1. Install Certbot

```bash
# Install Certbot
sudo dnf install -y python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Test auto-renewal
sudo certbot renew --dry-run
```

### 2. Update Nginx for HTTPS

Certbot automatically updates Nginx configuration, but verify the configuration:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

## Monitoring & Maintenance

### 1. Setup Log Rotation

```bash
# Create logrotate configuration
sudo tee /etc/logrotate.d/invencare << EOF
/var/log/invencare/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 invencare invencare
    postrotate
        sudo -u invencare pm2 reloadLogs
    endscript
}
EOF
```

### 2. Setup Monitoring with CloudWatch

```bash
# Install CloudWatch agent
wget https://s3.amazonaws.com/amazoncloudwatch-agent/amazon_linux/amd64/latest/amazon-cloudwatch-agent.rpm
sudo rpm -U ./amazon-cloudwatch-agent.rpm

# Configure CloudWatch agent
sudo tee /opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json << EOF
{
    "metrics": {
        "namespace": "InvenCare/Application",
        "metrics_collected": {
            "cpu": {
                "measurement": [
                    "cpu_usage_idle",
                    "cpu_usage_iowait",
                    "cpu_usage_user",
                    "cpu_usage_system"
                ],
                "metrics_collection_interval": 60
            },
            "disk": {
                "measurement": [
                    "used_percent"
                ],
                "metrics_collection_interval": 60,
                "resources": [
                    "*"
                ]
            },
            "diskio": {
                "measurement": [
                    "io_time"
                ],
                "metrics_collection_interval": 60,
                "resources": [
                    "*"
                ]
            },
            "mem": {
                "measurement": [
                    "mem_used_percent"
                ],
                "metrics_collection_interval": 60
            }
        }
    },
    "logs": {
        "logs_collected": {
            "files": {
                "collect_list": [
                    {
                        "file_path": "/var/log/invencare/error.log",
                        "log_group_name": "invencare-application",
                        "log_stream_name": "{instance_id}/error.log"
                    },
                    {
                        "file_path": "/var/log/nginx/access.log",
                        "log_group_name": "invencare-nginx",
                        "log_stream_name": "{instance_id}/access.log"
                    }
                ]
            }
        }
    }
}
EOF

# Start CloudWatch agent
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl \
  -a fetch-config \
  -m ec2 \
  -c file:/opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json \
  -s
```

### 3. Create Backup Scripts

```bash
# Create backup script
sudo tee /opt/invencare/scripts/backup.sh << EOF
#!/bin/bash

# Configuration
BACKUP_DIR="/opt/invencare/backups"
DATE=\$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=30

# Create backup directory
mkdir -p \$BACKUP_DIR

# Database backup
mysqldump -h \$RDS_HOSTNAME -u \$RDS_USERNAME -p\$RDS_PASSWORD \$RDS_DB_NAME > \$BACKUP_DIR/invencare_db_\$DATE.sql

# Application backup
tar -czf \$BACKUP_DIR/invencare_app_\$DATE.tar.gz /opt/invencare --exclude=/opt/invencare/backups --exclude=/opt/invencare/node_modules

# Upload to S3 (optional)
# aws s3 cp \$BACKUP_DIR/invencare_db_\$DATE.sql s3://your-backup-bucket/database/
# aws s3 cp \$BACKUP_DIR/invencare_app_\$DATE.tar.gz s3://your-backup-bucket/application/

# Cleanup old backups
find \$BACKUP_DIR -name "invencare_*" -mtime +\$RETENTION_DAYS -delete

echo "Backup completed: \$DATE"
EOF

chmod +x /opt/invencare/scripts/backup.sh

# Add to crontab
echo "0 2 * * * /opt/invencare/scripts/backup.sh >> /var/log/invencare/backup.log 2>&1" | sudo crontab -u invencare -
```

### 4. Setup Process Monitoring

```bash
# Create PM2 startup script
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u invencare --hp /home/invencare

# Create monitoring script
sudo tee /opt/invencare/scripts/monitor.sh << EOF
#!/bin/bash

# Check if PM2 processes are running
if ! sudo -u invencare pm2 list | grep -q "online"; then
    echo "PM2 processes not running, attempting restart..."
    sudo -u invencare pm2 resurrect
    sudo -u invencare pm2 restart all
fi

# Check Nginx status
if ! systemctl is-active --quiet nginx; then
    echo "Nginx not running, attempting restart..."
    systemctl start nginx
fi

# Check disk space
DISK_USAGE=\$(df / | awk 'NR==2 {print \$5}' | sed 's/%//')
if [ \$DISK_USAGE -gt 80 ]; then
    echo "Disk usage is \$DISK_USAGE%, cleaning up..."
    # Add cleanup commands here
fi
EOF

chmod +x /opt/invencare/scripts/monitor.sh

# Add monitoring to crontab
echo "*/5 * * * * /opt/invencare/scripts/monitor.sh >> /var/log/invencare/monitor.log 2>&1" | sudo crontab -
```

## Deployment Script

### 1. Create Automated Deployment Script

```bash
# Create deployment script
sudo tee /opt/invencare/scripts/deploy.sh << EOF
#!/bin/bash

set -e

echo "Starting deployment..."

# Configuration
APP_DIR="/opt/invencare"
BACKUP_DIR="/opt/invencare/backups"
DATE=\$(date +%Y%m%d_%H%M%S)

# Create backup before deployment
echo "Creating backup..."
mkdir -p \$BACKUP_DIR
tar -czf \$BACKUP_DIR/pre_deploy_\$DATE.tar.gz \$APP_DIR --exclude=\$BACKUP_DIR --exclude=node_modules

# Pull latest code (if using git)
cd \$APP_DIR
git fetch origin
git checkout main
git pull origin main

# Install/update dependencies
echo "Installing dependencies..."
npm ci --production

# Build application
echo "Building application..."
npm run build

# Restart services
echo "Restarting services..."
pm2 restart all
systemctl reload nginx

# Verify deployment
sleep 10
if curl -f http://localhost:3000/api/ping > /dev/null 2>&1; then
    echo "Deployment successful!"
else
    echo "Deployment failed! Rolling back..."
    # Rollback commands here
    tar -xzf \$BACKUP_DIR/pre_deploy_\$DATE.tar.gz -C /
    pm2 restart all
    exit 1
fi

echo "Deployment completed successfully!"
EOF

chmod +x /opt/invencare/scripts/deploy.sh
```

## Troubleshooting

### Common Issues and Solutions

1. **Application won't start**

   ```bash
   # Check PM2 logs
   sudo -u invencare pm2 logs

   # Check environment variables
   sudo -u invencare printenv
   ```

2. **Database connection issues**

   ```bash
   # Test database connectivity
   mysql -h your-rds-endpoint -u admin -p

   # Check security groups and VPC configuration
   ```

3. **Nginx issues**

   ```bash
   # Check Nginx logs
   sudo tail -f /var/log/nginx/error.log

   # Test configuration
   sudo nginx -t
   ```

4. **SSL certificate issues**

   ```bash
   # Check certificate status
   sudo certbot certificates

   # Renew certificates
   sudo certbot renew
   ```

### Health Checks

```bash
# Create health check script
sudo tee /opt/invencare/scripts/health_check.sh << EOF
#!/bin/bash

echo "=== InvenCare Health Check ==="

# Check application
echo "Application Status:"
if curl -f http://localhost:3000/api/ping > /dev/null 2>&1; then
    echo "✓ Application is responding"
else
    echo "✗ Application is not responding"
fi

# Check database
echo "Database Status:"
if mysql -h \$RDS_HOSTNAME -u \$RDS_USERNAME -p\$RDS_PASSWORD -e "SELECT 1" > /dev/null 2>&1; then
    echo "✓ Database is accessible"
else
    echo "✗ Database is not accessible"
fi

# Check Nginx
echo "Nginx Status:"
if systemctl is-active --quiet nginx; then
    echo "✓ Nginx is running"
else
    echo "✗ Nginx is not running"
fi

# Check disk space
echo "Disk Usage:"
df -h /

# Check memory usage
echo "Memory Usage:"
free -h

# Check PM2 processes
echo "PM2 Processes:"
sudo -u invencare pm2 list
EOF

chmod +x /opt/invencare/scripts/health_check.sh
```

## Security Recommendations

1. **Keep system updated**

   ```bash
   sudo dnf update -y
   ```

2. **Configure fail2ban**

   ```bash
   sudo dnf install -y fail2ban
   sudo systemctl enable fail2ban
   sudo systemctl start fail2ban
   ```

3. **Setup automated security updates**

   ```bash
   sudo dnf install -y dnf-automatic
   sudo systemctl enable dnf-automatic.timer
   sudo systemctl start dnf-automatic.timer
   ```

4. **Configure AWS Systems Manager for patching**
   - Enable Systems Manager on your EC2 instance
   - Create a maintenance window for automated patching

This deployment guide provides a comprehensive setup for running InvenCare in production on AWS EC2 with proper monitoring, security, and maintenance procedures.

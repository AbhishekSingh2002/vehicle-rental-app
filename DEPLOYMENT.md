# Deployment Guide - Vehicle Rental Booking System

## 🐳 Docker Deployment (Recommended)

### Prerequisites
- Docker 20.10+
- Docker Compose 2.0+
- 2GB free RAM
- 5GB free disk space

### Quick Start with Docker

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd vehicle-rental-app
   ```

2. **Start all services**
   ```bash
   docker-compose up -d
   ```

3. **Check service status**
   ```bash
   docker-compose ps
   ```

4. **View logs**
   ```bash
   docker-compose logs -f backend
   ```

5. **Access the application**
   - Backend API: `http://localhost:3001`
   - Frontend: `http://localhost:3000`
   - Database: `localhost:5432`

### Docker Commands

```bash
# Stop all services
docker-compose down

# Stop and remove volumes (WARNING: deletes database)
docker-compose down -v

# Rebuild containers after code changes
docker-compose up -d --build

# Execute commands in backend container
docker-compose exec backend npm run seed
docker-compose exec backend npx prisma studio

# View database logs
docker-compose logs db

# Restart a specific service
docker-compose restart backend
```

---

## 🖥️ Local Development Setup

### Backend

1. **Install dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env`:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/vehicle_rental"
   PORT=3001
   NODE_ENV=development
   ```

3. **Start PostgreSQL**
   ```bash
   # Using Docker
   docker run --name vehicle-rental-db \
     -e POSTGRES_USER=vehicleuser \
     -e POSTGRES_PASSWORD=vehiclepass \
     -e POSTGRES_DB=vehicle_rental \
     -p 5432:5432 \
     -d postgres:15-alpine

   # Or using local PostgreSQL
   sudo systemctl start postgresql
   createdb vehicle_rental
   ```

4. **Run migrations and seed**
   ```bash
   npx prisma migrate dev --name init
   npm run seed
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

### Frontend

1. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Configure API URL** (if needed)
   Create `.env.local`:
   ```env
   REACT_APP_API_URL=http://localhost:3001/api
   ```

3. **Start development server**
   ```bash
   npm start
   ```

---

## ☁️ Production Deployment

### Option 1: Heroku Deployment

#### Backend Deployment

1. **Install Heroku CLI**
   ```bash
   curl https://cli-assets.heroku.com/install.sh | sh
   heroku login
   ```

2. **Create Heroku app**
   ```bash
   cd backend
   heroku create vehicle-rental-api
   ```

3. **Add PostgreSQL addon**
   ```bash
   heroku addons:create heroku-postgresql:mini
   ```

4. **Set environment variables**
   ```bash
   heroku config:set NODE_ENV=production
   ```

5. **Create Procfile**
   ```
   web: npm start
   release: npx prisma migrate deploy && npx prisma db seed
   ```

6. **Deploy**
   ```bash
   git push heroku main
   ```

7. **Verify deployment**
   ```bash
   heroku logs --tail
   heroku open
   ```

#### Frontend Deployment

1. **Build production bundle**
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy to Vercel**
   ```bash
   npm install -g vercel
   vercel --prod
   ```

   Or deploy to Netlify:
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod --dir=build
   ```

3. **Set environment variables**
   ```bash
   # On Vercel/Netlify dashboard
   REACT_APP_API_URL=https://your-api.herokuapp.com/api
   ```

---

### Option 2: AWS Deployment

#### Using AWS Elastic Beanstalk

1. **Install EB CLI**
   ```bash
   pip install awsebcli
   ```

2. **Initialize EB application**
   ```bash
   cd backend
   eb init -p node.js vehicle-rental-api
   ```

3. **Create environment**
   ```bash
   eb create production
   ```

4. **Set up RDS PostgreSQL**
   - Go to AWS RDS Console
   - Create PostgreSQL 15 instance
   - Note connection details

5. **Set environment variables**
   ```bash
   eb setenv DATABASE_URL="postgresql://user:pass@host:5432/db"
   eb setenv NODE_ENV=production
   ```

6. **Deploy**
   ```bash
   eb deploy
   ```

#### Frontend on S3 + CloudFront

1. **Build production**
   ```bash
   cd frontend
   npm run build
   ```

2. **Create S3 bucket**
   ```bash
   aws s3 mb s3://vehicle-rental-frontend
   aws s3 website s3://vehicle-rental-frontend \
     --index-document index.html
   ```

3. **Upload build files**
   ```bash
   aws s3 sync build/ s3://vehicle-rental-frontend
   ```

4. **Set up CloudFront** (via AWS Console)

---

### Option 3: DigitalOcean Deployment

#### Using DigitalOcean App Platform

1. **Create new app**
   - Go to DigitalOcean App Platform
   - Connect GitHub repository
   - Select `backend` folder

2. **Configure build settings**
   ```yaml
   name: vehicle-rental-backend
   services:
   - name: api
     github:
       repo: your-repo
       branch: main
       deploy_on_push: true
     build_command: npm install && npx prisma generate
     run_command: npx prisma migrate deploy && npm start
     envs:
     - key: DATABASE_URL
       scope: RUN_TIME
       type: SECRET
     - key: NODE_ENV
       value: production
   databases:
   - name: vehicle-rental-db
     engine: PG
     version: "15"
   ```

3. **Deploy frontend**
   - Create another app for frontend
   - Set build command: `npm install && npm run build`
   - Set environment variable: `REACT_APP_API_URL`

---

### Option 4: VPS Deployment (Ubuntu 22.04)

#### Setup Server

1. **Connect to server**
   ```bash
   ssh root@your-server-ip
   ```

2. **Update system**
   ```bash
   apt update && apt upgrade -y
   ```

3. **Install Node.js**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
   apt install -y nodejs
   ```

4. **Install PostgreSQL**
   ```bash
   apt install -y postgresql postgresql-contrib
   ```

5. **Install Nginx**
   ```bash
   apt install -y nginx
   ```

6. **Install PM2**
   ```bash
   npm install -g pm2
   ```

#### Deploy Backend

1. **Clone repository**
   ```bash
   cd /var/www
   git clone <repo-url> vehicle-rental
   cd vehicle-rental/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   npx prisma generate
   ```

3. **Set up PostgreSQL**
   ```bash
   sudo -u postgres psql
   CREATE DATABASE vehicle_rental;
   CREATE USER vehicleuser WITH PASSWORD 'secure_password';
   GRANT ALL PRIVILEGES ON DATABASE vehicle_rental TO vehicleuser;
   \q
   ```

4. **Configure environment**
   ```bash
   nano .env
   ```
   ```env
   DATABASE_URL="postgresql://vehicleuser:secure_password@localhost:5432/vehicle_rental"
   PORT=3001
   NODE_ENV=production
   ```

5. **Run migrations**
   ```bash
   npx prisma migrate deploy
   npm run seed
   ```

6. **Start with PM2**
   ```bash
   pm2 start src/index.js --name vehicle-rental-api
   pm2 save
   pm2 startup
   ```

#### Deploy Frontend

1. **Build locally**
   ```bash
   cd frontend
   npm install
   npm run build
   ```

2. **Upload to server**
   ```bash
   scp -r build/* root@your-server-ip:/var/www/vehicle-rental-frontend
   ```

#### Configure Nginx

1. **Create Nginx config**
   ```bash
   nano /etc/nginx/sites-available/vehicle-rental
   ```

   ```nginx
   # Backend proxy
   server {
       listen 80;
       server_name api.yourdomain.com;

       location / {
           proxy_pass http://localhost:3001;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }

   # Frontend
   server {
       listen 80;
       server_name yourdomain.com www.yourdomain.com;
       root /var/www/vehicle-rental-frontend;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }
   }
   ```

2. **Enable site**
   ```bash
   ln -s /etc/nginx/sites-available/vehicle-rental /etc/nginx/sites-enabled/
   nginx -t
   systemctl reload nginx
   ```

3. **Set up SSL with Let's Encrypt**
   ```bash
   apt install -y certbot python3-certbot-nginx
   certbot --nginx -d yourdomain.com -d www.yourdomain.com
   certbot --nginx -d api.yourdomain.com
   ```

---

## 🔒 Security Checklist

### Backend Security

- [ ] Use environment variables for secrets
- [ ] Enable CORS only for trusted domains
- [ ] Implement rate limiting
- [ ] Use HTTPS in production
- [ ] Validate all user inputs
- [ ] Use parameterized queries (Prisma handles this)
- [ ] Keep dependencies updated
- [ ] Enable PostgreSQL SSL connections
- [ ] Set up database backups
- [ ] Implement request logging

### Frontend Security

- [ ] Use HTTPS
- [ ] Implement Content Security Policy
- [ ] Sanitize user inputs
- [ ] Don't expose API keys in client code
- [ ] Use environment variables for API URLs
- [ ] Enable security headers

---

## 📊 Monitoring & Logging

### Backend Monitoring

1. **PM2 Monitoring**
   ```bash
   pm2 monit
   pm2 logs vehicle-rental-api
   ```

2. **Log to file**
   ```javascript
   // Add to src/app.js
   const winston = require('winston');
   
   const logger = winston.createLogger({
     level: 'info',
     format: winston.format.json(),
     transports: [
       new winston.transports.File({ filename: 'error.log', level: 'error' }),
       new winston.transports.File({ filename: 'combined.log' })
     ]
   });
   ```

3. **Database monitoring**
   ```bash
   # Install pg_stat_statements extension
   sudo -u postgres psql vehicle_rental
   CREATE EXTENSION pg_stat_statements;
   
   # View slow queries
   SELECT * FROM pg_stat_statements ORDER BY total_exec_time DESC LIMIT 10;
   ```

---

## 🔄 Continuous Deployment

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Heroku
        uses: akhileshns/heroku-deploy@v3.12.12
        with:
          heroku_api_key: ${{secrets.HEROKU_API_KEY}}
          heroku_app_name: "vehicle-rental-api"
          heroku_email: "your-email@example.com"
          appdir: "backend"

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Build
        run: |
          cd frontend
          npm install
          npm run build
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID}}
          vercel-project-id: ${{ secrets.PROJECT_ID}}
          vercel-args: '--prod'
          working-directory: ./frontend
```

---

## 🗄️ Database Backup & Recovery

### Automated Backups

```bash
# Create backup script
nano /opt/backup-db.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/var/backups/vehicle-rental"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR

pg_dump -U vehicleuser vehicle_rental | gzip > $BACKUP_DIR/backup_$DATE.sql.gz

# Keep only last 7 days of backups
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +7 -delete
```

```bash
chmod +x /opt/backup-db.sh

# Add to crontab (daily at 2 AM)
crontab -e
0 2 * * * /opt/backup-db.sh
```

### Restore from Backup

```bash
gunzip < /var/backups/vehicle-rental/backup_20251024_020000.sql.gz | \
  psql -U vehicleuser vehicle_rental
```

---

## 📈 Performance Optimization

### Backend Optimization

1. **Enable compression**
   ```javascript
   const compression = require('compression');
   app.use(compression());
   ```

2. **Add caching**
   ```javascript
   const redis = require('redis');
   const client = redis.createClient();
   
   // Cache vehicle types
   app.get('/api/types', async (req, res) => {
     const cached = await client.get('types');
     if (cached) return res.json(JSON.parse(cached));
     
     const types = await prisma.vehicleType.findMany();
     await client.set('types', JSON.stringify(types), { EX: 3600 });
     res.json(types);
   });
   ```

3. **Database connection pooling**
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
     relationMode = "prisma"
   }
   
   generator client {
     provider = "prisma-client-js"
     previewFeatures = ["fullTextSearch"]
   }
   ```

### Frontend Optimization

1. **Code splitting**
2. **Lazy loading**
3. **Image optimization**
4. **CDN for static assets**

---

This deployment guide covers all major platforms and scenarios. Choose the option that best fits your requirements! 🚀
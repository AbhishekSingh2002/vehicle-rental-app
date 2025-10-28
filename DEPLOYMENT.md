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
   git clone https://github.com/your-username/vehicle-rental-app.git
   cd vehicle-rental-app
   ```

2. **Set up environment variables**
   ```bash
   # Backend
   cp backend/.env.example backend/.env
   # Frontend
   cp frontend/.env.example frontend/.env.local
   ```

3. **Update environment variables** (edit the .env files as needed)
   - Set `NODE_ENV=production` for production
   - Configure database connection
   - Set up JWT secrets
   - Configure SMTP for emails

4. **Start all services**
   ```bash
   docker-compose up -d --build
   ```

5. **Run database migrations**
   ```bash
   docker-compose exec backend npx prisma migrate deploy
   ```

6. **Check service status**
   ```bash
   docker-compose ps
   ```

7. **View logs**
   ```bash
   # All services
   docker-compose logs -f
   
   # Specific service
   docker-compose logs -f backend
   docker-compose logs -f frontend
   docker-compose logs -f db
   ```

8. **Access the application**
   - Frontend: `http://your-domain.com` or `http://localhost:3000`
   - Backend API: `http://your-domain.com/api` or `http://localhost:3001/api`
   - Database: `localhost:5432` (internal to Docker network)
   - Prisma Studio (development only): `http://localhost:5555`

### Docker Commands Cheat Sheet

```bash
# Start services in detached mode
docker-compose up -d

# Stop all services
docker-compose down

# Stop and remove volumes (WARNING: deletes database)
docker-compose down -v

# Rebuild containers after code changes
docker-compose up -d --build

# View running containers
docker ps
docker-compose ps

# Execute commands in containers
docker-compose exec backend npm run seed
docker-compose exec backend npx prisma studio
docker-compose exec db psql -U postgres

# View logs
docker-compose logs -f
docker-compose logs -f backend
docker-compose logs -f frontend

# Restart services
docker-compose restart

# Check resource usage
docker stats

# Remove all unused containers, networks, and images
docker system prune -a

# Update containers
docker-compose pull
docker-compose up -d
```

### Production Environment Variables

#### Backend (`.env`)
```env
NODE_ENV=production
PORT=3001
DATABASE_URL="postgresql://user:password@db:5432/vehicle_rental?schema=public"
JWT_SECRET=your-secure-jwt-secret
JWT_EXPIRES_IN=7d
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-email@example.com
SMTP_PASS=your-email-password
FRONTEND_URL=https://your-domain.com
```

#### Frontend (`.env.production`)
```env
REACT_APP_API_URL=https://your-domain.com/api
REACT_APP_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
NODE_ENV=production
```

## 🖥️ Local Development Setup

### Prerequisites
- Node.js 18+
- npm 9+
- PostgreSQL 14+
- Git

### Backend Setup

1. **Clone and install dependencies**
   ```bash
   git clone https://github.com/your-username/vehicle-rental-app.git
   cd vehicle-rental-app/backend
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env`:
   ```env
   # Server
   NODE_ENV=development
   PORT=3001
   
   # Database
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/vehicle_rental_dev?schema=public"
   
   # Authentication
   JWT_SECRET=dev-secret-key-change-in-production
   JWT_EXPIRES_IN=7d
   
   # Email (optional for development)
   SMTP_HOST=smtp.ethereal.email
   SMTP_PORT=587
   SMTP_USER=your-email@ethereal.email
   SMTP_PASS=your-ethereal-password
   
   # Frontend URL for CORS
   FRONTEND_URL=http://localhost:3000
   ```

3. **Set up PostgreSQL**
   ```bash
   # Using Docker (recommended)
   docker run --name vehicle-rental-db \
     -e POSTGRES_USER=postgres \
     -e POSTGRES_PASSWORD=postgres \
     -e POSTGRES_DB=vehicle_rental_dev \
     -p 5432:5432 \
     -d postgres:15-alpine
   
   # Or using local PostgreSQL
   createdb vehicle_rental_dev
   ```

4. **Run migrations and seed data**
   ```bash
   npx prisma migrate dev --name init
   npm run seed
   ```

5. **Start development server**
   ```bash
   # Development mode with hot-reload
   npm run dev
   
   # Or production build
   npm run build
   npm start
   ```

### Frontend Setup

1. **Install dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

2. **Configure environment variables**
   Create `.env.local`:
   ```env
   # API Configuration
   REACT_APP_API_URL=http://localhost:3001/api
   
   # Google Maps (optional)
   REACT_APP_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
   
   # Environment
   NODE_ENV=development
   ```

3. **Start development server**
   ```bash
   # Development mode with hot-reload
   npm start
   
   # Or production build
   npm run build
   serve -s build
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - API Documentation: http://localhost:3001/api-docs

## ☁️ Production Deployment

### Option 1: VPS Deployment (Recommended)

#### Prerequisites
- Ubuntu 22.04 LTS server
- Domain name (optional but recommended)
- SSH access to server
- Basic Linux command line knowledge

#### Server Setup

1. **Connect to your server**
   ```bash
   ssh user@your-server-ip
   ```

2. **Update system packages**
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

3. **Install required packages**
   ```bash
   # Install Node.js and npm
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt install -y nodejs
   
   # Install PM2 process manager
   sudo npm install -g pm2
   
   # Install PostgreSQL
   sudo apt install -y postgresql postgresql-contrib
   
   # Install Nginx
   sudo apt install -y nginx
   
   # Install Certbot for SSL
   sudo apt install -y certbot python3-certbot-nginx
   ```

4. **Set up PostgreSQL**
   ```bash
   # Create database and user
   sudo -u postgres psql -c "CREATE DATABASE vehicle_rental_prod;"
   sudo -u postgres psql -c "CREATE USER vehicleuser WITH PASSWORD 'securepassword';"
   sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE vehicle_rental_prod TO vehicleuser;"
   ```

#### Backend Deployment

1. **Clone repository**
   ```bash
   cd /var/www
   sudo git clone https://github.com/your-username/vehicle-rental-app.git
   sudo chown -R $USER:$USER /var/www/vehicle-rental-app
   cd vehicle-rental-app/backend
   ```

2. **Install dependencies**
   ```bash
   npm install --production
   ```

3. **Set up environment**
   ```bash
   cp .env.example .env
   nano .env  # Edit with production values
   ```

4. **Run migrations**
   ```bash
   npx prisma migrate deploy
   ```

5. **Build and start with PM2**
   ```bash
   npm run build
   pm2 start dist/index.js --name "vehicle-rental-api"
   pm2 save
   pm2 startup  # Follow instructions to enable auto-start on boot
   ```

#### Frontend Deployment

1. **Build the frontend**
   ```bash
   cd ../frontend
   npm install
   npm run build
   ```

2. **Install serve**
   ```bash
   sudo npm install -g serve
   ```

3. **Start frontend with PM2**
   ```bash
   pm2 serve build 3000 --spa --name "vehicle-rental-frontend"
   pm2 save
   ```

#### Nginx Configuration

1. **Create Nginx config**
   ```bash
   sudo nano /etc/nginx/sites-available/vehicle-rental
   ```

   ```nginx
   server {
       listen 80;
       server_name your-domain.com www.your-domain.com;
    
       # Frontend
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
    
       # Backend API
       location /api {
           proxy_pass http://localhost:3001;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```

2. **Enable the site**
   ```bash
   sudo ln -s /etc/nginx/sites-available/vehicle-rental /etc/nginx/sites-enabled/
   sudo nginx -t  # Test config
   sudo systemctl restart nginx
   ```

3. **Set up SSL with Let's Encrypt**
   ```bash
   sudo certbot --nginx -d your-domain.com -d www.your-domain.com
   ```

### Option 2: Heroku Deployment

#### Backend Deployment

1. **Install Heroku CLI**
   ```bash
   curl https://cli-assets.heroku.com/install.sh | sh
   heroku login
   ```

2. **Create Heroku app**
   ```bash
   cd backend
   heroku create your-app-name
   heroku addons:create heroku-postgresql:hobby-dev
   heroku config:set NODE_ENV=production
   ```

3. **Deploy to Heroku**
   ```bash
   git push heroku main
   heroku run npx prisma migrate deploy
   ```

#### Frontend Deployment

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy to Vercel**
   ```bash
   cd frontend
   vercel
   ```

### Option 3: Docker Swarm (Advanced)
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
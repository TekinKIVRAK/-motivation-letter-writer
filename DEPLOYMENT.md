# Deployment Guide - Motivation Letter Writer AI

Complete guide for deploying the Motivation Letter Writer application to production environments.

## Table of Contents
- [Pre-Deployment Checklist](#pre-deployment-checklist)
- [Deployment Options](#deployment-options)
- [Option 1: Vercel (Frontend) + Railway (Backend)](#option-1-vercel-frontend--railway-backend)
- [Option 2: Netlify (Frontend) + Heroku (Backend)](#option-2-netlify-frontend--heroku-backend)
- [Option 3: DigitalOcean (Full Stack)](#option-3-digitalocean-full-stack)
- [Option 4: AWS (Full Stack)](#option-4-aws-full-stack)
- [Environment Variables](#environment-variables)
- [Post-Deployment](#post-deployment)
- [Monitoring & Maintenance](#monitoring--maintenance)

## Pre-Deployment Checklist

### Code Preparation

- [ ] All code is committed to Git repository
- [ ] `.env` files are in `.gitignore`
- [ ] Production environment variables are prepared
- [ ] Dependencies are up to date (`npm update`)
- [ ] Security vulnerabilities checked (`npm audit`)
- [ ] Code is tested locally
- [ ] Error handling is implemented
- [ ] API rate limiting is considered

### Build Verification

```bash
# Test frontend production build
cd frontend
npm run build
npm run preview

# Test backend
cd backend
npm start
```

### Security Checklist

- [ ] API keys are stored securely
- [ ] CORS is properly configured
- [ ] File upload limits are set
- [ ] Input validation is implemented
- [ ] Error messages don't expose sensitive info
- [ ] HTTPS is enabled (in production)

## Deployment Options

### Recommended Stack
- **Frontend**: Vercel or Netlify (Free tier available)
- **Backend**: Railway, Render, or Heroku
- **Database**: Not required (stateless application)

### Cost Comparison

| Service | Frontend | Backend | Estimated Cost |
|---------|----------|---------|----------------|
| Vercel + Railway | Free | $5-20/mo | $5-20/mo |
| Netlify + Render | Free | $7-25/mo | $7-25/mo |
| DigitalOcean | $4/mo | $4/mo | $8/mo |
| AWS | $3-10/mo | $10-30/mo | $13-40/mo |

## Option 1: Vercel (Frontend) + Railway (Backend)

### Step 1: Deploy Backend to Railway

1. **Create Railway Account**
   - Visit https://railway.app/
   - Sign up with GitHub

2. **Create New Project**
   ```
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Select backend directory
   ```

3. **Configure Environment Variables**
   ```
   ANTHROPIC_API_KEY=sk-ant-your-key
   PORT=3001
   MAX_FILE_SIZE=10485760
   CORS_ORIGIN=https://your-frontend-domain.vercel.app
   NODE_ENV=production
   ```

4. **Configure Build Settings**
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

5. **Deploy**
   - Click "Deploy"
   - Note your Railway URL (e.g., `https://your-app.up.railway.app`)

### Step 2: Deploy Frontend to Vercel

1. **Create Vercel Account**
   - Visit https://vercel.com/
   - Sign up with GitHub

2. **Import Project**
   ```
   - Click "Add New Project"
   - Import your GitHub repository
   - Select frontend directory
   ```

3. **Configure Build Settings**
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

4. **Add Environment Variables**
   ```
   VITE_API_URL=https://your-backend.up.railway.app
   ```

5. **Update Frontend API URL**

   Create `frontend/.env.production`:
   ```env
   VITE_API_URL=https://your-backend.up.railway.app
   ```

   Update `frontend/vite.config.js`:
   ```javascript
   export default defineConfig({
     server: {
       proxy: {
         '/api': {
           target: import.meta.env.VITE_API_URL || 'http://localhost:3001',
           changeOrigin: true
         }
       }
     }
   })
   ```

6. **Deploy**
   - Click "Deploy"
   - Your app will be live at `https://your-app.vercel.app`

### Step 3: Update CORS Settings

Update Railway backend CORS_ORIGIN:
```
CORS_ORIGIN=https://your-app.vercel.app
```

## Option 2: Netlify (Frontend) + Heroku (Backend)

### Step 1: Deploy Backend to Heroku

1. **Install Heroku CLI**
   ```bash
   # macOS
   brew tap heroku/brew && brew install heroku

   # Windows
   # Download from https://devcenter.heroku.com/articles/heroku-cli
   ```

2. **Login to Heroku**
   ```bash
   heroku login
   ```

3. **Create Heroku App**
   ```bash
   cd backend
   heroku create your-app-name
   ```

4. **Set Environment Variables**
   ```bash
   heroku config:set ANTHROPIC_API_KEY=sk-ant-your-key
   heroku config:set MAX_FILE_SIZE=10485760
   heroku config:set NODE_ENV=production
   ```

5. **Create Procfile**

   Create `backend/Procfile`:
   ```
   web: node src/server.js
   ```

6. **Deploy**
   ```bash
   git subtree push --prefix backend heroku main
   # Or
   git push heroku main
   ```

### Step 2: Deploy Frontend to Netlify

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**
   ```bash
   netlify login
   ```

3. **Build Frontend**
   ```bash
   cd frontend
   npm run build
   ```

4. **Deploy**
   ```bash
   netlify deploy --prod --dir=dist
   ```

   Or use Netlify web interface:
   - Drag and drop `dist` folder to https://app.netlify.com/drop

5. **Configure Environment**

   In Netlify dashboard:
   - Site Settings → Environment Variables
   - Add: `VITE_API_URL=https://your-app.herokuapp.com`

## Option 3: DigitalOcean (Full Stack)

### Step 1: Create Droplet

1. **Create Account** at https://digitalocean.com/
2. **Create Droplet**
   - Choose Ubuntu 22.04 LTS
   - Select plan ($4-6/month)
   - Choose datacenter region
   - Add SSH key

### Step 2: Server Setup

```bash
# SSH into droplet
ssh root@your-droplet-ip

# Update system
apt update && apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Install PM2
npm install -g pm2

# Install Nginx
apt install -y nginx

# Setup firewall
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw enable
```

### Step 3: Deploy Application

```bash
# Clone repository
git clone <your-repo-url>
cd motivation-letter-writer

# Setup backend
cd backend
npm install
cp .env.example .env
nano .env  # Add your environment variables

# Start backend with PM2
pm2 start src/server.js --name motivation-backend
pm2 save
pm2 startup

# Setup frontend
cd ../frontend
npm install
npm run build
```

### Step 4: Configure Nginx

```bash
# Create Nginx config
nano /etc/nginx/sites-available/motivation-letter
```

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        root /root/motivation-letter-writer/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
ln -s /etc/nginx/sites-available/motivation-letter /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

### Step 5: Setup SSL (Optional but Recommended)

```bash
# Install Certbot
apt install -y certbot python3-certbot-nginx

# Get SSL certificate
certbot --nginx -d your-domain.com

# Auto-renewal
certbot renew --dry-run
```

## Option 4: AWS (Full Stack)

### Frontend: AWS S3 + CloudFront

1. **Build Frontend**
   ```bash
   cd frontend
   npm run build
   ```

2. **Create S3 Bucket**
   - Name: `motivation-letter-frontend`
   - Enable static website hosting
   - Upload `dist` folder contents

3. **Setup CloudFront**
   - Create distribution
   - Point to S3 bucket
   - Configure custom domain (optional)

### Backend: AWS Elastic Beanstalk

1. **Install EB CLI**
   ```bash
   pip install awsebcli
   ```

2. **Initialize EB**
   ```bash
   cd backend
   eb init
   ```

3. **Create Environment**
   ```bash
   eb create production
   ```

4. **Set Environment Variables**
   ```bash
   eb setenv ANTHROPIC_API_KEY=sk-ant-your-key
   ```

5. **Deploy**
   ```bash
   eb deploy
   ```

## Environment Variables

### Production Backend Variables

```env
# Required
ANTHROPIC_API_KEY=sk-ant-your-production-key

# Server
PORT=3001
NODE_ENV=production

# File Upload
MAX_FILE_SIZE=10485760

# CORS - Add all frontend domains
CORS_ORIGIN=https://your-domain.com,https://www.your-domain.com

# Optional
LOG_LEVEL=info
```

### Production Frontend Variables

```env
# API Endpoint
VITE_API_URL=https://api.your-domain.com

# Or relative path if same domain
VITE_API_URL=/api
```

## Post-Deployment

### 1. Test the Deployment

```bash
# Test health endpoint
curl https://your-backend.com/api/health

# Test frontend
open https://your-frontend.com
```

### 2. Setup Monitoring

**Backend Monitoring:**
- Use Railway/Heroku dashboard
- Setup error tracking (Sentry)
- Monitor API usage

**Frontend Monitoring:**
- Use Vercel Analytics
- Setup Google Analytics (optional)
- Monitor Core Web Vitals

### 3. Setup Logging

**Backend:**
```javascript
// Add to server.js
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

### 4. Setup Backups

- Backup environment variables
- Backup deployment configurations
- Document any custom settings

## Monitoring & Maintenance

### Health Checks

```bash
# Setup automated health checks
curl https://your-backend.com/api/health
```

### Log Monitoring

**Railway/Heroku:**
- View logs in dashboard
- Setup log drains (optional)

**DigitalOcean:**
```bash
# View PM2 logs
pm2 logs motivation-backend

# View Nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

### Performance Monitoring

- Monitor API response times
- Track Anthropic API usage
- Monitor server resources (CPU, RAM)

### Security Updates

```bash
# Regular updates
npm audit
npm audit fix

# Update dependencies
npm update
```

### Scaling Considerations

**When to scale:**
- Response times > 2 seconds
- CPU usage consistently > 80%
- Memory usage > 80%
- High number of concurrent users

**How to scale:**
- **Vertical**: Upgrade server plan
- **Horizontal**: Add more instances
- **CDN**: Use CloudFront for static assets
- **Caching**: Implement Redis for responses

## Rollback Procedure

### Vercel/Netlify
```bash
# Rollback to previous deployment
vercel rollback
netlify rollback
```

### Railway
- Use dashboard to redeploy previous version

### Manual Deployment
```bash
# Git rollback
git revert HEAD
git push heroku main
```

## Troubleshooting

### Issue: 502 Bad Gateway
- Check backend is running
- Verify PORT configuration
- Check logs for errors

### Issue: CORS Errors
- Verify CORS_ORIGIN includes frontend URL
- Check protocol (http vs https)
- Restart backend after config changes

### Issue: File Upload Fails
- Check MAX_FILE_SIZE
- Verify server has write permissions
- Check disk space

### Issue: High Memory Usage
- Implement file cleanup
- Add memory limits
- Consider serverless functions

## Cost Optimization

1. **Use Free Tiers**
   - Vercel: Free for hobby projects
   - Netlify: 100GB/month free
   - Railway: $5 free credit

2. **Monitor API Usage**
   - Set Anthropic API budgets
   - Implement caching
   - Optimize prompts

3. **Optimize Assets**
   - Compress images
   - Minify code
   - Use CDN

## Support & Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app/)
- [Netlify Documentation](https://docs.netlify.com/)
- [DigitalOcean Tutorials](https://www.digitalocean.com/community/tutorials)

---

**Deployment complete!** 🚀 Your application is now live in production.

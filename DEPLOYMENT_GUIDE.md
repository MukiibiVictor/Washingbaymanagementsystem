# ZORI Auto Spa - Production Deployment Guide

## 🚀 Deployment Options

This guide covers multiple deployment platforms:
1. **Render** (Recommended - Free tier available)
2. **Railway** (Easy deployment)
3. **Vercel + Railway** (Frontend + Backend split)
4. **Heroku** (Classic option)
5. **VPS/DigitalOcean** (Full control)

---

## Option 1: Render (Recommended) ⭐

### Why Render?
- ✅ Free tier available
- ✅ Automatic deployments from GitHub
- ✅ Built-in SSL certificates
- ✅ Easy database management
- ✅ No credit card required for free tier

### Prerequisites
- GitHub account (already have)
- Render account (free): https://render.com

### Deployment Steps

#### A. Backend Deployment

1. **Go to Render Dashboard**
   - Visit https://render.com
   - Sign up/Login with GitHub
   - Click "New +" → "Web Service"

2. **Connect Repository**
   - Select your repository: `MukiibiVictor/Washingbaymanagementsystem`
   - Click "Connect"

3. **Configure Backend Service**
   ```
   Name: zori-autospa-backend
   Region: Choose closest to Uganda (e.g., Frankfurt)
   Branch: main
   Root Directory: server
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
   Instance Type: Free
   ```

4. **Environment Variables**
   Add these in Render dashboard:
   ```
   PORT=3001
   NODE_ENV=production
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment (5-10 minutes)
   - Note your backend URL: `https://zori-autospa-backend.onrender.com`

#### B. Frontend Deployment

1. **Create New Static Site**
   - Click "New +" → "Static Site"
   - Select same repository

2. **Configure Frontend**
   ```
   Name: zori-autospa
   Branch: main
   Build Command: npm run build
   Publish Directory: dist
   ```

3. **Environment Variables**
   ```
   VITE_API_URL=https://zori-autospa-backend.onrender.com
   ```

4. **Deploy**
   - Click "Create Static Site"
   - Your site will be live at: `https://zori-autospa.onrender.com`

---

## Option 2: Railway ⚡

### Why Railway?
- ✅ Very easy setup
- ✅ Automatic deployments
- ✅ Free $5 credit monthly
- ✅ Great for full-stack apps

### Deployment Steps

1. **Sign Up**
   - Visit https://railway.app
   - Sign up with GitHub

2. **Deploy from GitHub**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose `MukiibiVictor/Washingbaymanagementsystem`

3. **Configure Services**
   Railway will auto-detect both frontend and backend

4. **Set Environment Variables**
   - Backend: `PORT=3001`
   - Frontend: `VITE_API_URL=<your-backend-url>`

5. **Deploy**
   - Railway handles everything automatically
   - Get your URLs from the dashboard

---

## Option 3: Vercel (Frontend) + Railway (Backend)

### Frontend on Vercel

1. **Go to Vercel**
   - Visit https://vercel.com
   - Sign up with GitHub

2. **Import Project**
   - Click "Add New" → "Project"
   - Import `MukiibiVictor/Washingbaymanagementsystem`

3. **Configure**
   ```
   Framework Preset: Vite
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

4. **Environment Variables**
   ```
   VITE_API_URL=<your-railway-backend-url>
   ```

5. **Deploy**
   - Click "Deploy"
   - Your site: `https://zori-autospa.vercel.app`

### Backend on Railway
- Follow Railway steps above for backend only

---

## Option 4: DigitalOcean/VPS (Advanced)

### Prerequisites
- VPS with Ubuntu 20.04+
- Domain name (optional)
- SSH access

### Setup Steps

1. **Connect to VPS**
   ```bash
   ssh root@your-server-ip
   ```

2. **Install Node.js**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   sudo npm install -g pm2
   ```

3. **Clone Repository**
   ```bash
   cd /var/www
   git clone https://github.com/MukiibiVictor/Washingbaymanagementsystem.git
   cd Washingbaymanagementsystem
   ```

4. **Setup Backend**
   ```bash
   cd server
   npm install
   pm2 start server.js --name zori-backend
   pm2 save
   pm2 startup
   ```

5. **Setup Frontend**
   ```bash
   cd ..
   npm install
   npm run build
   ```

6. **Install Nginx**
   ```bash
   sudo apt install nginx
   ```

7. **Configure Nginx**
   Create `/etc/nginx/sites-available/zori-autospa`:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       # Frontend
       location / {
           root /var/www/Washingbaymanagementsystem/dist;
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

8. **Enable Site**
   ```bash
   sudo ln -s /etc/nginx/sites-available/zori-autospa /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

9. **Setup SSL (Optional but Recommended)**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

---

## 🔒 Pre-Deployment Security Checklist

### Critical Security Updates Needed

1. **Change Default Admin Password**
   - Current: admin123
   - Change to strong password immediately after deployment

2. **Add Password Hashing**
   - Install bcrypt: `npm install bcrypt`
   - Hash passwords before storing

3. **Add Environment Variables**
   - JWT secret key
   - Database encryption key
   - API keys

4. **Enable CORS Properly**
   - Restrict to your domain only
   - Remove wildcard CORS in production

5. **Add Rate Limiting**
   - Install: `npm install express-rate-limit`
   - Prevent brute force attacks

6. **Input Validation**
   - Install: `npm install express-validator`
   - Validate all user inputs

---

## 📝 Post-Deployment Checklist

After deployment, verify:

- [ ] Backend API is accessible
- [ ] Frontend loads correctly
- [ ] Login works
- [ ] User registration works
- [ ] Database persists data
- [ ] Services page loads
- [ ] Footer displays correctly
- [ ] All API endpoints respond
- [ ] SSL certificate is active (HTTPS)
- [ ] Change default admin password
- [ ] Test on mobile devices
- [ ] Check browser console for errors

---

## 🔧 Environment Variables Reference

### Backend (.env)
```env
PORT=3001
NODE_ENV=production
JWT_SECRET=your-super-secret-jwt-key-change-this
CORS_ORIGIN=https://your-frontend-domain.com
```

### Frontend (.env.production)
```env
VITE_API_URL=https://your-backend-domain.com
```

---

## 📊 Monitoring & Maintenance

### Recommended Tools
- **Uptime Monitoring**: UptimeRobot (free)
- **Error Tracking**: Sentry (free tier)
- **Analytics**: Google Analytics
- **Logs**: Check platform dashboards

### Regular Maintenance
- Backup database.json weekly
- Monitor disk space
- Check error logs
- Update dependencies monthly
- Review user feedback

---

## 🆘 Troubleshooting

### Common Issues

**1. Backend not connecting**
- Check CORS settings
- Verify API URL in frontend
- Check backend logs

**2. Database resets**
- Ensure database.json is persistent
- Check file permissions
- Verify volume mounts (Docker/Railway)

**3. Build fails**
- Check Node.js version (18+)
- Clear node_modules and reinstall
- Check build logs for errors

**4. 404 errors on refresh**
- Configure routing for SPA
- Add rewrite rules in hosting platform

---

## 💰 Cost Estimates

### Free Tier Options
- **Render**: Free (with limitations)
- **Railway**: $5/month credit (free)
- **Vercel**: Free for frontend
- **Netlify**: Free for frontend

### Paid Options
- **Render Pro**: $7/month per service
- **Railway**: Pay as you go after $5 credit
- **DigitalOcean**: $6/month (basic droplet)
- **Heroku**: $7/month per dyno

---

## 🎯 Recommended Deployment Path

For your project, I recommend:

**Best for Quick Start**: Render (Free)
- Deploy both frontend and backend
- Free SSL
- Automatic deployments
- No credit card needed

**Best for Production**: Railway or DigitalOcean
- Better performance
- More control
- Scalable
- Professional setup

---

## 📞 Support

If you encounter issues:
1. Check platform documentation
2. Review error logs
3. Test locally first
4. Check GitHub issues
5. Contact platform support

---

**Ready to deploy? Choose your platform and follow the steps above!** 🚀

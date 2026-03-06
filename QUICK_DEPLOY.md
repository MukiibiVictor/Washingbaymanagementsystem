# 🚀 Quick Deployment Guide - ZORI Auto Spa

## Fastest Way to Deploy (5 Minutes)

### Option 1: Render (Recommended - Completely Free)

#### Step 1: Sign Up
1. Go to https://render.com
2. Click "Get Started for Free"
3. Sign up with your GitHub account

#### Step 2: Deploy Backend
1. Click "New +" → "Web Service"
2. Click "Connect GitHub" → Select your repository
3. Fill in:
   - **Name**: `zori-autospa-backend`
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free
4. Click "Create Web Service"
5. **IMPORTANT**: Copy your backend URL (e.g., `https://zori-autospa-backend.onrender.com`)

#### Step 3: Deploy Frontend
1. Click "New +" → "Static Site"
2. Select same repository
3. Fill in:
   - **Name**: `zori-autospa`
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
4. Add Environment Variable:
   - **Key**: `VITE_API_URL`
   - **Value**: Your backend URL from Step 2
5. Click "Create Static Site"

#### Step 4: Done! 🎉
- Your app is live!
- Frontend: `https://zori-autospa.onrender.com`
- Backend: `https://zori-autospa-backend.onrender.com`

---

### Option 2: Railway (Also Free)

#### Step 1: Sign Up
1. Go to https://railway.app
2. Sign up with GitHub

#### Step 2: Deploy
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your repository
4. Railway auto-detects everything!

#### Step 3: Configure
1. Click on backend service
2. Add variable: `PORT=3001`
3. Click on frontend service
4. Add variable: `VITE_API_URL=<your-backend-url>`

#### Step 4: Done! 🎉
- Railway gives you URLs automatically

---

### Option 3: Vercel (Frontend Only - Fastest)

#### For Frontend:
1. Go to https://vercel.com
2. Click "Add New" → "Project"
3. Import your GitHub repo
4. Click "Deploy"
5. Done in 2 minutes!

#### For Backend:
- Use Render or Railway (follow steps above)
- Update Vercel environment variable with backend URL

---

## ⚠️ Important: After Deployment

### 1. Change Admin Password
```
Login: admin@zoriautospa.com
Password: admin123  ← CHANGE THIS IMMEDIATELY!
```

### 2. Test Everything
- [ ] Can you login?
- [ ] Can users register?
- [ ] Can you create check-ins?
- [ ] Can you add expenses?
- [ ] Does the footer show your contact info?

### 3. Update Footer
- Login as superadmin
- Scroll to footer
- Click "Edit Footer"
- Verify contact information

---

## 🔗 Your URLs

After deployment, you'll have:

**Frontend**: `https://your-app-name.platform.com`
- This is what users visit
- Share this URL with your team

**Backend**: `https://your-backend-name.platform.com`
- This is your API
- Don't share this publicly

---

## 📱 Share Your App

Once deployed, share with:
- Your team
- Your customers
- On social media

Example:
```
Check out our new auto spa management system!
🚗 https://zori-autospa.onrender.com

Features:
✅ Online booking
✅ Service catalog
✅ Real-time updates
✅ Mobile friendly
```

---

## 🆘 Need Help?

**Deployment Issues?**
1. Check build logs in platform dashboard
2. Verify environment variables
3. Test locally first: `npm run dev`

**App Not Working?**
1. Open browser console (F12)
2. Check for errors
3. Verify backend URL is correct

**Contact:**
- Email: mukiibijohnvictor@gmail.com
- Phone: +256751768901

---

## 💡 Pro Tips

1. **Free Tier Limitations**
   - Render: Apps sleep after 15 min of inactivity
   - First request after sleep takes ~30 seconds
   - Upgrade to paid plan for 24/7 uptime

2. **Custom Domain**
   - Buy domain from Namecheap/GoDaddy
   - Add to platform settings
   - Point DNS to platform

3. **Monitoring**
   - Set up UptimeRobot (free)
   - Get alerts if site goes down
   - Monitor response times

---

**Ready? Pick a platform and deploy now!** 🚀

Estimated time: 5-10 minutes

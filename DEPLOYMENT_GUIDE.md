# 🚀 KTM Workshop Management - Deployment Guide

## ✅ Database Configuration Status

Your `db.js` is **already configured** to work with both environments:

```javascript
ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
```

- **Local (pgAdmin)**: SSL = `false` - works with local PostgreSQL
- **Production (Render)**: SSL = `{ rejectUnauthorized: false }` - works with Render PostgreSQL

---

## 📋 Pre-Deployment Checklist

### 1. Local Testing (Verify Everything Works)

**Start both servers:**
```bash
# Terminal 1 - Backend
npm run dev

# Terminal 2 - Frontend
npm run react
```

**Test locally at:**
- Frontend: http://localhost:3001
- Backend: http://localhost:3000

**Verify:**
- ✅ All CRUD operations work
- ✅ Search functionality works
- ✅ Animations display correctly
- ✅ Data tables load properly
- ✅ Forms submit successfully

---

## 🗄️ Step 1: Set Up Render PostgreSQL Database

### If you already have a Render PostgreSQL database:
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Navigate to your existing PostgreSQL database
3. Click on **"Connect"** tab
4. Copy the **"External Database URL"**

### If you need a new database:
1. Go to Render Dashboard
2. Click **"New +"** → **"PostgreSQL"**
3. Name: `ktm-workshop-db`
4. Region: Choose closest to you
5. Plan: **Free** (or paid if needed)
6. Click **"Create Database"**
7. Wait 1-2 minutes for provisioning
8. Copy the **"External Database URL"**

Example URL format:
```
postgres://ktm_user:password123@dpg-xxxxx.oregon-postgres.render.com/ktm_db_xxxx
```

---

## 🏗️ Step 2: Initialize Database Schema on Render

### Method 1: Using psql (Recommended)

**Connect to Render database:**
```bash
# Replace with your actual connection URL
psql "postgres://ktm_user:password@dpg-xxxxx.oregon-postgres.render.com/ktm_db"
```

**Run the schema:**
```bash
# In psql terminal
\i c:\Users\aryan\OneDrive\Desktop\KTM\pgadmin.sql
```

### Method 2: Using Render Dashboard

1. In Render Dashboard, go to your PostgreSQL database
2. Click **"Explore"** tab
3. Open SQL editor
4. Copy entire contents of `pgadmin.sql`
5. Paste and execute

### Method 3: Using pgAdmin (GUI)

1. Open pgAdmin
2. Right-click **"Servers"** → **"Register"** → **"Server"**
3. **General Tab:**
   - Name: `Render KTM Database`
4. **Connection Tab:**
   - Host: `dpg-xxxxx.oregon-postgres.render.com` (from URL)
   - Port: `5432`
   - Database: `ktm_db_xxxx` (from URL)
   - Username: `ktm_user` (from URL)
   - Password: `password123` (from URL)
   - Save password: ✅
5. **SSL Tab:**
   - SSL mode: `Require`
6. Click **"Save"**
7. Right-click database → **"Query Tool"**
8. Open and execute `pgadmin.sql`

---

## 🌐 Step 3: Deploy Backend to Render

### A. Prepare Repository (if not already on GitHub)

```bash
cd c:\Users\aryan\OneDrive\Desktop\KTM

# Initialize git if needed
git init

# Add all files
git add .

# Commit
git commit -m "Updated KTM Workshop Management System with black theme"

# Push to GitHub (replace with your repo URL)
git remote add origin https://github.com/YOUR_USERNAME/ktm-workshop.git
git branch -M main
git push -u origin main
```

### B. Create Web Service on Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. **Connect Repository:**
   - Click **"Connect GitHub"** (if not connected)
   - Select your `ktm-workshop` repository

4. **Configure Service:**
   - **Name**: `ktm-workshop-backend`
   - **Region**: Same as database
   - **Branch**: `main`
   - **Root Directory**: Leave blank
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Plan**: Free (or paid)

5. **Environment Variables** (Click "Advanced"):
   ```
   NODE_ENV=production
   PG_USER=ktm_user
   PG_HOST=dpg-xxxxx.oregon-postgres.render.com
   PG_DATABASE=ktm_db_xxxx
   PG_PASSWORD=password123
   PG_PORT=5432
   PORT=3000
   FRONTEND_URL=https://your-frontend-url.netlify.app
   ```
   
   **Important:** Get database credentials from your Render PostgreSQL connection URL:
   ```
   postgres://USER:PASSWORD@HOST/DATABASE
   ```

6. Click **"Create Web Service"**

7. Wait 5-10 minutes for deployment

8. **Copy your backend URL**: `https://ktm-workshop-backend.onrender.com`

---

## 🎨 Step 4: Deploy Frontend to Netlify

### A. Update API URL in Code

Create a config file for environment-based API URLs:

**Create `src/config.js`:**
```javascript
const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://ktm-workshop-backend.onrender.com/api'
  : 'http://localhost:3000/api';

export default API_BASE_URL;
```

**Update `src/App.jsx`** (find all `http://localhost:3000/api` and replace):
```javascript
// Add at top of App.jsx
import API_BASE_URL from './config';

// Replace all API calls like this:
fetch(`http://localhost:3000/api/workshops`)
// With:
fetch(`${API_BASE_URL}/workshops`)
```

### B. Build and Deploy

**Option 1: Netlify CLI (Quick)**

```bash
# Install Netlify CLI globally
npm install -g netlify-cli

# Login
netlify login

# Build
npm run build

# Deploy to existing site
netlify deploy --prod --dir=build --site=YOUR_OLD_SITE_ID
```

**Option 2: Netlify Dashboard (Recommended)**

1. Go to [Netlify Dashboard](https://app.netlify.com)
2. Find your **existing KTM Workshop site**
3. Go to **"Site Settings"** → **"Build & Deploy"**
4. Click **"Trigger Deploy"** → **"Clear cache and deploy site"**

OR to replace completely:

1. Go to **"Deploys"** tab
2. Drag and drop your `build` folder directly

### C. Configure Environment Variables on Netlify

1. Go to **"Site Settings"** → **"Environment Variables"**
2. Add:
   ```
   NODE_ENV=production
   REACT_APP_API_URL=https://ktm-workshop-backend.onrender.com/api
   ```
3. Click **"Save"**
4. Redeploy site

---

## 🔄 Step 5: Update CORS on Backend

Make sure your backend allows requests from your Netlify frontend:

**Update `server.js` CORS configuration:**
```javascript
const cors = require('cors');

const allowedOrigins = [
  'http://localhost:3001',
  'https://your-ktm-app.netlify.app' // Add your actual Netlify URL
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
```

**Push changes and redeploy:**
```bash
git add .
git commit -m "Update CORS for production"
git push origin main
```

Render will auto-deploy the update.

---

## ✅ Step 6: Verify Deployment

### Test Production Backend
```bash
# Test API endpoint
curl https://ktm-workshop-backend.onrender.com/api/workshops
```

### Test Production Frontend
1. Visit your Netlify URL: `https://your-ktm-app.netlify.app`
2. Check browser console (F12) for errors
3. Test all features:
   - ✅ Load data from tabs
   - ✅ Search functionality
   - ✅ Add/Edit/Delete operations
   - ✅ Animations working
   - ✅ Hover effects

---

## 🛠️ Troubleshooting

### Database Connection Issues

**Error: "SSL connection required"**
```javascript
// db.js already handles this with:
ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
```

**Error: "password authentication failed"**
- Verify environment variables in Render dashboard
- Check Render PostgreSQL credentials
- Test connection using psql command

### CORS Issues

**Error: "blocked by CORS policy"**
1. Check `allowedOrigins` in `server.js` includes your Netlify URL
2. Verify environment variable `FRONTEND_URL` is set correctly
3. Check browser network tab for actual origin being sent

### Render Free Tier Issues

**Backend sleeps after 15 minutes of inactivity**
- First request after sleep takes 30-60 seconds
- Consider upgrading to paid plan for 24/7 uptime
- Or use a service like UptimeRobot to ping every 14 minutes

### Frontend Build Issues

**Error: Module not found**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

## 📊 Testing Data Migration

If you have data in your old deployment:

### Export from Old Database
```bash
# Connect to old Render database
pg_dump -h OLD_HOST -U OLD_USER -d OLD_DB > old_data.sql
```

### Import to New Database
```bash
# Connect to new Render database
psql "postgres://new_connection_url" < old_data.sql
```

---

## 🔐 Environment Variables Summary

### Local (.env file)
```env
NODE_ENV=development
PG_USER=postgres
PG_HOST=localhost
PG_DATABASE=ktmdb_pg
PG_PASSWORD=your_local_password
PG_PORT=5432
PORT=3000
FRONTEND_URL=http://localhost:3001
```

### Render Backend (Environment Variables)
```env
NODE_ENV=production
PG_USER=your_render_db_user
PG_HOST=dpg-xxxxx.oregon-postgres.render.com
PG_DATABASE=your_render_db_name
PG_PASSWORD=your_render_db_password
PG_PORT=5432
PORT=3000
FRONTEND_URL=https://your-ktm-app.netlify.app
```

### Netlify Frontend (Environment Variables)
```env
NODE_ENV=production
REACT_APP_API_URL=https://ktm-workshop-backend.onrender.com/api
```

---

## 🎯 Quick Deployment Commands

```bash
# 1. Commit and push changes
git add .
git commit -m "Deploy updated KTM Workshop Management"
git push origin main

# 2. Build frontend
npm run build

# 3. Deploy to Netlify (if using CLI)
netlify deploy --prod --dir=build
```

---

## 📝 Post-Deployment Checklist

- ✅ Backend API responding at Render URL
- ✅ Frontend loading at Netlify URL
- ✅ Database connected (check Render logs)
- ✅ CORS configured correctly
- ✅ All CRUD operations working
- ✅ Search functionality operational
- ✅ Animations displaying correctly
- ✅ Orange hover effects working
- ✅ Dark scrollbar visible
- ✅ No console errors in browser

---

## 🆘 Support Resources

- **Render Docs**: https://render.com/docs
- **Netlify Docs**: https://docs.netlify.com
- **PostgreSQL Docs**: https://www.postgresql.org/docs

---

## 🎉 Success!

Your updated KTM Workshop Management System is now live with:
- 🖤 Complete black and orange theme
- ✨ Smooth animations
- 🎨 Custom orange hover effects
- 📊 Dark themed scrollbars
- ⚡ Modern racing aesthetics

**Deployed URLs:**
- **Backend**: https://ktm-workshop-backend.onrender.com
- **Frontend**: https://your-ktm-app.netlify.app

**Ready to manage workshops with KTM style! 🏍️⚡**

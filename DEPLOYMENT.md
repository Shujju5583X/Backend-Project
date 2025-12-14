# 🚀 Deployment Guide

This guide walks you through deploying the Task Management API to **Render** (backend) and **Netlify** (frontend).

---

## 📋 Prerequisites

Before deploying, ensure you have:
- A [GitHub](https://github.com) account with this repository pushed
- A [Render](https://render.com) account (free tier available)
- A [Netlify](https://netlify.com) account (free tier available)

---

## 🔧 Part 1: Deploy Backend to Render

### Option A: One-Click Deploy with Blueprint (Recommended)

1. **Push your code to GitHub** (if not already done)

2. **Create a new Blueprint on Render**
   - Go to [render.com/dashboard](https://dashboard.render.com)
   - Click **"New"** → **"Blueprint"**
   - Connect your GitHub repository
   - Render will detect `backend/render.yaml` and create:
     - A Web Service for the API
     - A PostgreSQL database

3. **Configure Environment Variables**
   - After deployment, go to your web service settings
   - Add `FRONTEND_URL` = your Netlify URL (e.g., `https://your-app.netlify.app`)

### Option B: Manual Deployment

1. **Create a PostgreSQL Database**
   - Go to Render Dashboard → **"New"** → **"PostgreSQL"**
   - Name: `task-api-db`
   - Plan: Free
   - Click **"Create Database"**
   - Copy the **Internal Database URL** for the next step

2. **Create a Web Service**
   - Go to Render Dashboard → **"New"** → **"Web Service"**
   - Connect your GitHub repository
   - Configure:

   | Setting | Value |
   |---------|-------|
   | **Name** | `task-api-backend` |
   | **Region** | Oregon (US West) |
   | **Branch** | `main` |
   | **Root Directory** | `backend` |
   | **Runtime** | Node |
   | **Build Command** | `npm install && npx prisma generate && npx prisma db push && npm run build` |
   | **Start Command** | `npm start` |
   | **Plan** | Free |

   > **Note**: We moved devDependencies to dependencies to ensure Render installs TypeScript types. If you revert this, use `npm install --include=dev`.

3. **Add Environment Variables**
   
   In the web service settings, add these environment variables:

   | Key | Value |
   |-----|-------|
   | `NODE_ENV` | `production` |
   | `DATABASE_URL` | (paste PostgreSQL connection string) |
   | `JWT_SECRET` | (generate a strong random string) |
   | `JWT_EXPIRES_IN` | `7d` |
   | `FRONTEND_URL` | `https://your-app.netlify.app` (update after Netlify deploy) |

   > 💡 **Tip**: Generate a secure JWT_SECRET using:
   > ```bash
   > node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   > ```

4. **Deploy**
   - Click **"Create Web Service"**
   - Wait for the build to complete (first build may take 5-10 minutes)
   - Your API will be live at `https://your-app.onrender.com`

5. **Verify Deployment**
   - Test the health endpoint: `https://your-app.onrender.com/api/v1/health`
   - Test Swagger docs: `https://your-app.onrender.com/api/docs`

---

## 🌐 Part 2: Deploy Frontend to Netlify

### Option A: Deploy via Netlify UI (Recommended)

1. **Update the API URL**
   - Open `frontend/.env.production`
   - Replace `YOUR_RENDER_APP_NAME` with your actual Render URL:
     ```
     VITE_API_URL=https://task-api-backend.onrender.com/api/v1
     ```
   - Commit and push this change

2. **Create a New Site on Netlify**
   - Go to [app.netlify.com](https://app.netlify.com)
   - Click **"Add new site"** → **"Import an existing project"**
   - Connect your GitHub repository

3. **Configure Build Settings**

   | Setting | Value |
   |---------|-------|
   | **Base directory** | `frontend` |
   | **Build command** | `npm install && npm run build` |
   | **Publish directory** | `frontend/dist` |

4. **Add Environment Variable**
   - Go to **Site settings** → **Environment variables**
   - Add:
     - Key: `VITE_API_URL`
     - Value: `https://your-render-app.onrender.com/api/v1`

5. **Deploy**
   - Click **"Deploy site"**
   - Wait for the build to complete
   - Your frontend will be live at a Netlify URL like `https://random-name.netlify.app`

6. **Change Site Name (Optional)**
   - Go to **Site settings** → **Domain management**
   - Click **"Options"** → **"Edit site name"**
   - Choose a memorable name like `task-api-frontend`

### Option B: Deploy via Netlify CLI

```bash
# Install Netlify CLI globally
npm install -g netlify-cli

# Login to Netlify
netlify login

# Navigate to frontend directory
cd frontend

# Build the project
npm run build

# Deploy to Netlify
netlify deploy --prod

# Follow the prompts to create a new site or link to existing
```

---

## 🔗 Part 3: Connect Frontend and Backend

After both deployments are complete:

1. **Update Render's FRONTEND_URL**
   - Go to your Render web service → **Environment**
   - Set `FRONTEND_URL` to your Netlify URL (e.g., `https://task-api-frontend.netlify.app`)
   - This enables CORS for your frontend

2. **Verify the Connection**
   - Open your Netlify frontend URL
   - Try registering a new user
   - Login and create a task

---

## 🔒 Security Checklist

- [ ] **JWT_SECRET**: Use a strong, randomly generated secret (64+ characters)
- [ ] **DATABASE_URL**: Never commit to version control
- [ ] **CORS**: Only allow your Netlify domain in FRONTEND_URL
- [ ] **HTTPS**: Both Render and Netlify provide free SSL certificates

---

## 🐛 Troubleshooting

### Backend Issues

**Build fails with Prisma error**
```bash
# Ensure prisma generate is in build command
# Ensure TypeScript types are available
npm install --include=dev && npx prisma generate && npx prisma db push && npm run build

# OR ensuring packages are in 'dependencies' not 'devDependencies'
```

**Database connection fails**
- Verify `DATABASE_URL` uses the full connection string from Render
- Ensure the PostgreSQL database is running

**API returns 500 errors**
- Check Render logs for detailed error messages
- Verify all environment variables are set correctly

### Frontend Issues

**API requests fail with CORS error**
- Ensure `FRONTEND_URL` on Render matches your Netlify URL exactly
- Check that the URL includes `https://` prefix

**Blank page after deployment**
- Check the browser console for errors
- Verify `VITE_API_URL` is set correctly in Netlify environment variables

**Routes return 404**
- Ensure `netlify.toml` is in the **root** directory (moved from frontend)
- The `[[redirects]]` rule handles SPA routing

### Cookie Issues (Authentication not persisting)

If users can login but get logged out immediately:

1. The backend is configured to use `SameSite=None; Secure` for cookies in production. Ensure your `FRONTEND_URL` variable is set correctly.
2. Ensure your frontend uses `withCredentials: true` in axios (already configured)

---

## 📊 Monitoring

### Render
- View logs: Dashboard → Your Service → **Logs**
- View metrics: Dashboard → Your Service → **Metrics**

### Netlify  
- View build logs: Dashboard → Your Site → **Deploys**
- View analytics: Dashboard → Your Site → **Analytics** (paid feature)

---

## 🔄 Continuous Deployment

Both Render and Netlify support automatic deployments:

- **Render**: Automatically redeploys when you push to the connected branch
- **Netlify**: Automatically rebuilds and deploys on each push

To disable auto-deploy, configure in each platform's settings.

---

## 💰 Free Tier Limitations

### Render Free Tier
- Web services spin down after 15 minutes of inactivity
- First request after spin-down takes ~30 seconds (cold start)
- 750 hours/month of running time

### Netlify Free Tier
- 300 build minutes/month
- 100GB bandwidth/month
- Perfect for static sites and SPAs

---

## 🎉 You're Done!

Your Task Management API is now live! Share these URLs:

- **Frontend**: `https://your-app.netlify.app`
- **Backend API**: `https://your-app.onrender.com/api/v1`
- **API Docs**: `https://your-app.onrender.com/api/docs`

# VendorVigil Deployment Guide

Complete guide to deploying VendorVigil with 24/7 uptime using free hosting services.

---

## 📋 Prerequisites

Before starting deployment:

1. ✅ **GitHub Account** - [Sign up here](https://github.com/join)
2. ✅ **Render Account** - [Sign up here](https://render.com)
3. ✅ **Vercel Account** - [Sign up here](https://vercel.com)
4. ✅ **Code on GitHub** - Push your VendorVigil project to a GitHub repository

---

## 🎯 Deployment Architecture

```mermaid
graph LR
    A[User Browser] -->|HTTPS| B[Vercel - Frontend]
    B -->|API Requests| C[Render - Backend]
    C -->|Read/Write| D[MongoDB Atlas]
    C -->|Alerts| E[Slack/Email]
    F[UptimeRobot] -.->|Keep Alive Ping| C
```

- **Frontend (React)**: Deployed on Vercel
- **Backend (Node.js)**: Deployed on Render
- **Database (MongoDB)**: MongoDB Atlas (already configured)
- **Monitoring**: UptimeRobot (keeps backend awake 24/7)

---

## 🚀 Part 1: Push Code to GitHub

### Step 1: Create GitHub Repository

1. Go to [GitHub](https://github.com/new)
2. Create a new repository named `Third-Party-API-Service-Monitor`
3. Choose **Public** or **Private**
4. Do NOT initialize with README (your project already has one)

### Step 2: Push Your Code

Open terminal in your project root directory:

```bash
cd C:\Users\91999\OneDrive\Desktop\Third-Party-API-Service-Monitor

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - VendorVigil deployment ready"

# Add remote (replace with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/Third-Party-API-Service-Monitor.git

# Push to GitHub
git branch -M main
git push -u origin main
```

> **Note**: `.env` files will NOT be pushed (they're in `.gitignore`). This is correct and secure!

---

## 🖥️ Part 2: Deploy Backend to Render

### Step 1: Create Web Service

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Select `Third-Party-API-Service-Monitor` repository

### Step 2: Configure Service

Fill in these settings:

| Setting            | Value                                           |
| ------------------ | ----------------------------------------------- |
| **Name**           | `vendorvigil-backend` (or any name you prefer)  |
| **Region**         | Choose closest to you (e.g., Singapore, Oregon) |
| **Branch**         | `main`                                          |
| **Root Directory** | `vendorvigil/backend`                           |
| **Runtime**        | `Node`                                          |
| **Build Command**  | `npm install`                                   |
| **Start Command**  | `npm start`                                     |
| **Instance Type**  | **Free**                                        |

### Step 3: Add Environment Variables

Click **"Advanced"** → **"Add Environment Variable"** and add these:

| Key                 | Value                                                                                         | Notes                                    |
| ------------------- | --------------------------------------------------------------------------------------------- | ---------------------------------------- |
| `NODE_ENV`          | `production`                                                                                  | Required                                 |
| `PORT`              | `5000`                                                                                        | Render auto-assigns, but good to specify |
| `MONGODB_URI`       | `mongodb+srv://username:password@cluster.mongodb.net/vendorvigil?retryWrites=true&w=majority` | Copy from your `.env`                    |
| `JWT_SECRET`        | `your-super-secret-jwt-key-change-in-production`                                              | Copy from your `.env`                    |
| `SMTP_HOST`         | `smtp.gmail.com`                                                                              | Copy from your `.env`                    |
| `SMTP_PORT`         | `587`                                                                                         | Copy from your `.env`                    |
| `SMTP_USER`         | `your-email@gmail.com`                                                                        | Copy from your `.env`                    |
| `SMTP_PASS`         | `your-gmail-app-password`                                                                     | Copy from your `.env`                    |
| `SLACK_WEBHOOK_URL` | `https://hooks.slack.com/services/YOUR/WEBHOOK/URL`                                           | Copy from your `.env`                    |
| `FRONTEND_URL`      | _(skip for now, add after frontend is deployed)_                                              | You'll get this from Vercel              |

> **Security Note**: Consider changing `JWT_SECRET` to a stronger value for production.

### Step 4: Deploy

1. Click **"Create Web Service"**
2. Render will start building and deploying (takes 2-5 minutes)
3. Wait for **"Live"** status
4. Copy your backend URL (e.g., `https://vendorvigil-backend.onrender.com`)

### Step 5: Test Backend

Visit: `https://your-app-name.onrender.com/api/health`

You should see:

```json
{
  "status": "OK",
  "uptime": 123.456,
  "timestamp": "2026-01-28T08:16:56.000Z"
}
```

✅ **Backend is live!**

---

## 🌐 Part 3: Deploy Frontend to Vercel

### Step 1: Create New Project

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository `Third-Party-API-Service-Monitor`

### Step 2: Configure Project

| Setting              | Value                  |
| -------------------- | ---------------------- |
| **Framework Preset** | Vite                   |
| **Root Directory**   | `vendorvigil/frontend` |
| **Build Command**    | `npm run build`        |
| **Output Directory** | `dist`                 |
| **Install Command**  | `npm install`          |

### Step 3: Add Environment Variable

Click **"Environment Variables"** → Add:

| Name           | Value                                          |
| -------------- | ---------------------------------------------- |
| `VITE_API_URL` | `https://your-render-backend-url.onrender.com` |

> Replace with your actual Render backend URL (without `/api` at the end)

**Example**: `https://vendorvigil-backend.onrender.com`

### Step 4: Deploy

1. Click **"Deploy"**
2. Vercel will build and deploy (takes 1-2 minutes)
3. Wait for **"Ready"** status
4. Copy your frontend URL (e.g., `https://vendorvigil.vercel.app`)

### Step 5: Update Backend CORS

Go back to **Render Dashboard**:

1. Select your backend service
2. Go to **"Environment"** tab
3. Add new environment variable:
   - **Key**: `FRONTEND_URL`
   - **Value**: `https://your-vercel-url.vercel.app` (your actual Vercel URL)
4. Click **"Save Changes"**
5. Render will automatically redeploy (takes 1-2 minutes)

### Step 6: Test Frontend

1. Visit your Vercel URL
2. Try signing up / logging in
3. Add a vendor
4. Check if monitoring works

✅ **Frontend is live!**

---

## 🔄 Part 4: Enable 24/7 Uptime (Keep Backend Awake)

### The Problem

Render's free tier "sleeps" after 15 minutes of inactivity. Your cron jobs won't run when asleep.

### The Solution

Use **UptimeRobot** to ping your backend every 5 minutes, keeping it awake.

### Setup UptimeRobot

1. Go to [UptimeRobot](https://uptimerobot.com/) and sign up
2. Click **"Add New Monitor"**
3. Fill in:
   - **Monitor Type**: HTTP(s)
   - **Friendly Name**: VendorVigil Backend
   - **URL**: `https://your-render-backend.onrender.com/api/health`
   - **Monitoring Interval**: 5 minutes
4. Click **"Create Monitor"**

✅ **Your backend will now stay awake 24/7!**

> **Note**: UptimeRobot free tier allows 50 monitors with 5-minute intervals.

---

## 🔐 Security Best Practices

### 1. Change JWT Secret

In Render, update `JWT_SECRET` to a strong random value:

```bash
# Generate a strong secret (run locally)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and update `JWT_SECRET` in Render.

### 2. Enable SMTP App Password

If using Gmail, ensure you're using an **App Password**, not your actual Gmail password.

### 3. Review MongoDB Atlas Security

1. Check IP Whitelist (add `0.0.0.0/0` for cloud services, or restrict to Render IPs)
2. Ensure strong database password

---

## 📝 Updating Your Application

### When You Make Code Changes

**For Backend:**

```bash
git add .
git commit -m "Update: description of changes"
git push origin main
```

Render will auto-deploy in ~2 minutes.

**For Frontend:**

```bash
git add .
git commit -m "Update: description of changes"
git push origin main
```

Vercel will auto-deploy in ~1 minute.

### Viewing Logs

- **Render**: Dashboard → Your Service → "Logs" tab
- **Vercel**: Dashboard → Your Project → "Deployments" → Click deployment → "Functions" tab

---

## 🐛 Troubleshooting

### Backend Won't Start

**Check Render logs for errors:**

1. Go to Render Dashboard → Your Service
2. Click "Logs" tab
3. Look for errors related to:
   - MongoDB connection
   - Missing environment variables
   - Port binding issues

**Common fixes:**

- Verify `MONGODB_URI` is correct
- Ensure all environment variables are set
- Check that `npm start` works locally

### Frontend Can't Connect to Backend

**Check browser console for CORS errors:**

1. Open DevTools (F12)
2. Look for red errors about CORS

**Common fixes:**

- Verify `VITE_API_URL` in Vercel environment variables
- Ensure `FRONTEND_URL` in Render matches your Vercel URL exactly
- Check backend logs for CORS middleware errors

### Cron Jobs Not Running

**Verify UptimeRobot is configured:**

1. Check UptimeRobot dashboard shows "Up" status
2. Ensure monitoring interval is 5 minutes
3. Check Render logs to see if cron jobs are executing

### Database Connection Issues

**MongoDB Atlas firewall:**

1. Go to MongoDB Atlas → Network Access
2. Add IP Address: `0.0.0.0/0` (allows all IPs - suitable for cloud deployments)
3. Confirm IP whitelist is not blocking Render

---

## ✅ Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Backend deployed on Render
- [ ] All backend environment variables configured
- [ ] Backend health check passes
- [ ] Frontend deployed on Vercel
- [ ] Frontend environment variable (`VITE_API_URL`) configured
- [ ] `FRONTEND_URL` added to backend
- [ ] UptimeRobot monitoring configured
- [ ] Tested: User signup/login
- [ ] Tested: Vendor creation
- [ ] Tested: API monitoring running
- [ ] Tested: Alerts (Slack/Email) working

---

## 🎉 You're Live!

Your VendorVigil application is now running 24/7 on the internet!

**Share your URLs:**

- 🌐 Frontend: `https://your-app.vercel.app`
- 🖥️ Backend API: `https://your-app.onrender.com`

**What happens automatically:**

- ✅ Code changes auto-deploy via GitHub
- ✅ HTTPS/SSL certificates managed automatically
- ✅ Cron jobs run 24/7 monitoring APIs
- ✅ Email and Slack alerts sent when vendors go down
- ✅ Backend stays awake with UptimeRobot pings

---

## 📞 Need Help?

- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **MongoDB Atlas**: https://www.mongodb.com/docs/atlas/

---

**Created**: 2026-01-28  
**Last Updated**: 2026-01-28

# 🚜 Bulldozer Brain - Railway Deployment Guide

## 🎯 Quick Start

Your Bulldozer Brain app is now ready for deployment on Railway! Here's how to get it running:

## 📋 Prerequisites

- ✅ GitHub repository: [stuffyoushouldautomate/bulldozer-ai](https://github.com/stuffyoushouldautomate/bulldozer-ai)
- ✅ Railway account (free tier available)
- ✅ All environment variables configured

## 🚀 Railway Deployment Steps

### 1. Connect to Railway

1. Go to [railway.app](https://railway.app)
2. Sign in with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose `stuffyoushouldautomate/bulldozer-ai`

### 2. Configure Environment Variables

Railway will automatically detect your `.env` file, but you should set these in Railway's dashboard for security.

### 3. Deploy

1. Railway will automatically build and deploy your app
2. The build process uses your `Dockerfile` for optimal performance
3. Health checks will run against `/api/health`
4. Your app will be available at the provided Railway URL

## 🔧 Configuration Files

- **`railway.toml`** - Railway deployment configuration
- **`Dockerfile`** - Multi-stage Docker build for production
- **`docker-compose.yml`** - Local development setup

## 📊 Monitoring & Health Checks

- **Health Check**: `/api/health` endpoint
- **Auto-restart**: On failure with max 3 retries
- **Build Logs**: Available in Railway dashboard

---

**Your Bulldozer Brain app is now ready to deploy! 🚜💪**

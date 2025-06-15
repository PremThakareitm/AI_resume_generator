# Comprehensive Deployment Guide for AI Resume Generator

This guide explains how to deploy both the frontend and backend of your AI Resume Generator application to Vercel and Railway.

## Prerequisites

- GitHub account with your project repository
- Vercel account (for frontend)
- Railway account (for backend)
- Your code already pushed to GitHub

## Frontend Deployment (Vercel)

### 1. Prepare Your Frontend Files

1. Ensure you have the proper environment configuration:

```bash
# .env.production
VITE_API_URL=${RAILWAY_BACKEND_URL}
```

2. Verify your vercel.json is properly configured:

```json
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

### 2. Deploy to Vercel

1. **Login to Vercel** (https://vercel.com)

   - Sign up/login with your GitHub account

2. **Create New Project**

   - Click "Add New" > "Project"
   - Select your GitHub repository
   - Vercel will automatically detect it's a Vite project

3. **Configure Project Settings**

   - **Root Directory**: `resume_frontend`
   - **Build Command**: `npm run build` (should be auto-detected)
   - **Output Directory**: `dist` (should be auto-detected)

4. **Environment Variables**

   - Add `VITE_API_URL` with your Railway backend URL (you'll add this after the backend is deployed)

5. **Deploy**
   - Click "Deploy"
   - Once deployed, Vercel will provide you a URL

## Backend Deployment (Railway)

### 1. Prepare Your Backend Files

1. Make sure your backend has the proper configuration for production:

```properties
# application-prod.properties
spring.application.name=resume-ai-backend
server.port=${PORT:8080}

# AI Model Configuration - Choose one
# For Ollama (self-hosted, remove if using OpenAI)
spring.ai.ollama.chat.model=${SPRING_AI_OLLAMA_CHAT_MODEL:mistral:latest}
spring.ai.ollama.base-url=${SPRING_AI_OLLAMA_BASE_URL:http://localhost:11434}

# For OpenAI (cloud-based, uncomment if using OpenAI)
#spring.ai.openai.api-key=${SPRING_AI_OPENAI_API_KEY}
#spring.ai.openai.chat.model=${SPRING_AI_OPENAI_CHAT_MODEL:gpt-3.5-turbo}

# CORS Configuration - Update with your frontend URL
spring.mvc.cors.allowed-origins=${ALLOWED_ORIGINS:*}
spring.mvc.cors.allowed-methods=GET,POST,PUT,DELETE,OPTIONS
spring.mvc.cors.allowed-headers=*
spring.mvc.cors.allow-credentials=false
spring.mvc.cors.max-age=3600
```

2. Create a railway.json file for configuration:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "./mvnw clean package -DskipTests"
  },
  "deploy": {
    "startCommand": "java -jar target/*.jar",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 3
  }
}
```

### 2. Deploy to Railway

1. **Login to Railway** (https://railway.app)

   - Sign up/login with your GitHub account

2. **Create New Project**

   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Connect to GitHub and select your repository

3. **Configure Project**

   - Select "Custom Service"
   - **Root Directory**: `resume-ai-backend`
   - **Build Command**: `./mvnw package -DskipTests`
   - **Start Command**: `java -jar target/*.jar`

4. **Environment Variables**

   - `SPRING_PROFILES_ACTIVE`: `prod`
   - `PORT`: `8080`
   - `ALLOWED_ORIGINS`: Your Vercel frontend URL (add this after frontend deployment)

   Choose one of these options:

   **For Ollama (self-hosted):**

   - `SPRING_AI_OLLAMA_CHAT_MODEL`: `mistral:latest` (or your preferred model)
   - `SPRING_AI_OLLAMA_BASE_URL`: If using external Ollama instance

   **For OpenAI (recommended for production):**

   - `SPRING_AI_OPENAI_API_KEY`: Your OpenAI API key
   - `SPRING_AI_OPENAI_CHAT_MODEL`: `gpt-3.5-turbo` (or preferred model)

5. **Deploy**
   - Click "Deploy"
   - Once deployed, Railway will provide you a URL

## Connecting Frontend to Backend

1. **Update Frontend Environment Variables on Vercel**:

   - Go to your Vercel project settings
   - Add `VITE_API_URL` with your Railway backend URL
   - Redeploy your frontend

2. **Update Backend CORS Settings on Railway**:
   - Go to your Railway project variables
   - Set `ALLOWED_ORIGINS` to your Vercel frontend URL
   - Your service will automatically restart with the new settings

## Using OpenAI Instead of Ollama for Production

For production deployment, it's recommended to use OpenAI instead of Ollama for better reliability:

1. Get an OpenAI API key from https://platform.openai.com
2. In Railway, add these environment variables:
   - `SPRING_AI_OPENAI_API_KEY`: Your OpenAI API key
   - `SPRING_AI_OPENAI_CHAT_MODEL`: `gpt-3.5-turbo` (or your preferred model)
3. Remove or comment out Ollama-specific environment variables

## Monitoring and Maintenance

### Vercel Monitoring

- Analytics: Monitor performance, usage, and errors
- Logs: Check deployment and runtime logs
- Automatic rebuilds: Vercel automatically rebuilds on GitHub commits

### Railway Monitoring

- Metrics: CPU, memory, and disk usage
- Logs: Application logs for debugging
- Usage: Track API calls and system resources

## Troubleshooting Common Issues

1. **CORS Errors**:

   - Ensure `ALLOWED_ORIGINS` on Railway includes your Vercel domain
   - Check that frontend makes requests to the correct backend URL

2. **Connection Errors**:

   - Verify Railway service is running
   - Check that `VITE_API_URL` on Vercel is correct

3. **Build Failures**:
   - Check build logs for errors
   - Ensure all dependencies are correctly specified in package.json
   - Verify Maven wrapper (.mvnw) has execute permissions

## Cost Management

- **Vercel**: The Hobby plan is free and suitable for personal projects
- **Railway**: Offers a free tier with usage limits; monitor usage to avoid unexpected charges
- **OpenAI**: Pay per API usage; set limits to control costs

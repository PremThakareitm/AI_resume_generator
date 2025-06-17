# Complete Vercel Deployment Guide for Resume Generator

This guide provides step-by-step instructions for deploying both the frontend and backend components of your AI Resume Generator application on Vercel.

## Prerequisites

1. [Vercel account](https://vercel.com/signup) - Sign up or log in
2. [Vercel CLI](https://vercel.com/docs/cli) - Install with `npm i -g vercel`
3. [GitHub account](https://github.com/) - For project repository

## Initial Setup

### 1. Fork or clone your project to GitHub

Ensure your project is in a GitHub repository, as Vercel deploys most easily from GitHub.

### 2. Configure environment variables

Create a `.env.example` file (without real values) in both frontend and backend directories with all necessary environment variables.

## Backend Deployment (Spring Boot on Vercel)

> **Note:** Although Spring Boot applications are not Vercel's primary use case, we can make it work with the right configuration.

### 1. Prepare your Spring Boot application

1. **Create a production profile:**

   Modify the `application.properties` file for production:

   ```properties
   # In application-production.properties
   spring.ai.ollama.chat.model=mistral:latest
   # Use environment variables for OpenAI if needed
   # spring.ai.openai.api-key=${OPENAI_API_KEY}

   # CORS Configuration for Vercel
   spring.mvc.cors.allowed-origins=https://yourfrontendapp.vercel.app
   spring.mvc.cors.allowed-methods=GET,POST,PUT,DELETE,OPTIONS
   spring.mvc.cors.allowed-headers=*
   spring.mvc.cors.allow-credentials=false
   spring.mvc.cors.max-age=3600

   # Twilio Configuration
   twilio.account.sid=${TWILIO_ACCOUNT_SID}
   twilio.auth.token=${TWILIO_AUTH_TOKEN}
   twilio.whatsapp.number=${TWILIO_WHATSAPP_NUMBER}
   ```

2. **Build your application:**

   ```bash
   cd resume-ai-backend
   ./mvnw clean package
   ```

3. **Verify your `vercel.json` configuration:**

   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "target/*.jar",
         "use": "@vercel/java"
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "target/resume-ai-backend-0.0.1-SNAPSHOT.jar"
       }
     ],
     "env": {
       "SPRING_PROFILES_ACTIVE": "production"
     },
     "regions": ["sfo1"]
   }
   ```

### 2. Deploy the backend to Vercel

1. **Login to Vercel CLI:**

   ```bash
   vercel login
   ```

2. **Deploy from the backend directory:**

   ```bash
   cd resume-ai-backend
   vercel
   ```

3. **Set environment variables in Vercel:**

   - Go to the Vercel dashboard → Your project → Settings → Environment Variables
   - Add all necessary environment variables (OPENAI_API_KEY, TWILIO credentials, etc.)

4. **Configure your deployment:**

   - Follow the prompts in the CLI
   - Link to your existing project when asked
   - Set the production branch to deploy (usually `main` or `master`)
   - Confirm deployment

5. **Note your API URL:**
   - Once deployed, Vercel will give you a URL (e.g., `https://resume-ai-backend.vercel.app`)
   - You'll need this URL for the frontend configuration

## Frontend Deployment

### 1. Update frontend API configuration

1. **Update `vercel.json` for API proxying:**

   ```json
   {
     "framework": "vite",
     "buildCommand": "npm run build",
     "outputDirectory": "dist",
     "rewrites": [
       {
         "source": "/api/:path*",
         "destination": "https://resume-ai-backend.vercel.app/api/:path*"
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "/index.html"
       }
     ]
   }
   ```

   Replace `https://resume-ai-backend.vercel.app` with your actual deployed backend URL.

2. **Update API configuration in `ResumeService.js`:**

   ```javascript
   import axios from "axios";

   // For Vercel deployment
   const isProduction = import.meta.env.PROD;
   export const baseURLL =
     import.meta.env.VITE_API_URL ||
     (isProduction ? "/api" : "http://localhost:8080");

   export const axiosInstance = axios.create({
     baseURL: baseURLL,
     headers: {
       "Content-Type": "application/json",
       Accept: "application/json",
     },
     withCredentials: false,
   });
   ```

3. **Create `.env` and `.env.production` files:**

   ```
   # .env.production
   VITE_API_URL="/api"
   ```

### 2. Deploy the frontend to Vercel

1. **Deploy from the frontend directory:**

   ```bash
   cd resume_frontend
   vercel
   ```

2. **Configure your deployment:**

   - Follow the prompts in the CLI
   - Link to your existing project when asked
   - Set the production branch to deploy

3. **Set environment variables in Vercel:**
   - Go to the Vercel dashboard → Your project → Settings → Environment Variables
   - Add your environment variables if needed

## Linking Frontend and Backend

### 1. Update CORS settings in backend

Ensure your backend's CORS settings allow requests from your frontend domain:

```properties
spring.mvc.cors.allowed-origins=https://your-frontend-app.vercel.app
```

### 2. Test the complete application

1. Navigate to your deployed frontend URL
2. Test resume generation functionality
3. Monitor network requests to ensure proper communication with the backend

## Troubleshooting

### Backend Issues

1. **Java Version Problems:**

   - Ensure your `system.properties` file specifies the Java version: `java.runtime.version=17`

2. **Build Failures:**

   - Check the Vercel build logs for specific errors
   - Verify your Maven wrapper is functional

3. **API Connection Issues:**
   - Verify CORS settings
   - Check the network tab in browser developer tools for specific errors

### Frontend Issues

1. **API Connection Problems:**

   - Ensure the rewrite rule in `vercel.json` points to the correct backend URL
   - Verify API base URL configuration in your frontend code

2. **Build Failures:**
   - Check package.json for proper build scripts
   - Look at Vercel build logs for specific errors

## Monitoring and Maintenance

1. **View logs in Vercel:**

   - Vercel Dashboard → Project → Deployments → Select a deployment → Logs

2. **Redeploy after changes:**
   - Push to your GitHub repository, and Vercel will automatically redeploy
   - Or use `vercel` from the CLI to deploy manually

## Alternative Backend Deployment Options

If you encounter limitations with Java on Vercel, consider these alternatives for the backend:

1. **Railway** - Excellent for Java applications with simple setup
2. **Render** - Good free tier with Java support
3. **Heroku** - Mature platform with good Java support (requires credit card for free tier)

With either option, simply update your frontend's API URL configuration to point to your backend service.

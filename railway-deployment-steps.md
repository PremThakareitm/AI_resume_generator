# Railway Deployment Steps for Resume AI Backend

This document provides a step-by-step guide to successfully deploy your Resume AI Backend on Railway.

## Preparation

1. Make sure your project is pushed to GitHub with all the following files:

   - `railway.json`
   - `nixpacks.toml`
   - `Procfile`
   - `resume-ai-backend/system.properties`

2. Ensure your Maven wrapper is executable:
   ```bash
   git update-index --chmod=+x resume-ai-backend/mvnw
   git commit -m "Make Maven wrapper executable"
   git push
   ```

## Deploy on Railway

1. Log in to [Railway](https://railway.app/)

2. Create a new project from your GitHub repo:

   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Find and select your repository
   - Choose the main branch

3. Configure the deployment:

   - Set the root directory to the root of your repository (not `resume-ai-backend`)
   - Railway should automatically detect your Java Spring Boot app using nixpacks

4. Set required environment variables:

   - Click on the "Variables" tab
   - Add the following variables from your `.env.example` file:
     ```
     PORT=8080
     SPRING_PROFILES_ACTIVE=prod
     SPRING_AI_OPENAI_API_KEY=your_openai_api_key_here
     SPRING_AI_OPENAI_CHAT_MODEL=gpt-3.5-turbo
     ALLOWED_ORIGINS=https://your-frontend-url.vercel.app
     ```
   - Replace placeholder values with your actual values

5. Deploy:

   - Go to the "Deployments" tab
   - Click "Deploy Now"

6. Monitor the build logs:

   - If you see any build errors, check the logs for specific issues
   - Common issues include Maven wrapper permissions and Java version compatibility

7. Get your deployment URL:
   - Once deployed, go to the "Settings" tab
   - Find the "Domains" section to get your application URL
   - This URL will be used as your backend API endpoint for your frontend

## Troubleshooting Common Issues

### Issue: Build fails with "Permission denied" for mvnw

Solution:

```bash
chmod +x resume-ai-backend/mvnw
git add resume-ai-backend/mvnw
git commit -m "Make Maven wrapper executable"
git push
```

### Issue: Java version compatibility problems

Solution: Make sure `system.properties` is in the correct location with:

```
java.runtime.version=17
```

### Issue: Application starts but health check fails

Solution: Check if your application is listening on the correct port (PORT environment variable) and the health check endpoint is working (/api/v1/resume/health).

### Issue: "Nixpacks was unable to generate a build plan for this app"

Solution: Make sure you have proper Railway configuration files (railway.json, nixpacks.toml, system.properties) at the correct locations.

## After Deployment

1. Test your API endpoint with:

   ```
   curl https://your-railway-url.railway.app/api/v1/resume/health
   ```

2. Update your frontend environment variables to point to this new backend URL.

3. Re-deploy your frontend if necessary.

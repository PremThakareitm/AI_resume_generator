# Deploying Both Frontend and Backend on Vercel

This guide provides the exact steps to deploy both your frontend React/Vite application and Spring Boot backend on Vercel.

## Step 1: Prepare for Deployment

First, ensure all files are committed to your GitHub repository, as Vercel works best with GitHub integration.

## Step 2: Deploy the Backend

1. **Go to the Vercel Dashboard**:

   - Visit [https://vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "Add New" → "Project"

2. **Import your repository**:

   - Select your GitHub repository containing the AI Resume Generator
   - Choose "resume-ai-backend" as the root directory for this deployment
   - Configure the following settings:
     - Framework Preset: Other
     - Build Command: `cd resume-ai-backend && ./mvnw clean package`
     - Output Directory: `resume-ai-backend/target`

3. **Add environment variables**:

   - SPRING_PROFILES_ACTIVE: production
   - OPENAI_API_KEY: (your API key if using OpenAI)
   - TWILIO_ACCOUNT_SID: (your Twilio SID)
   - TWILIO_AUTH_TOKEN: (your Twilio auth token)
   - TWILIO_WHATSAPP_NUMBER: (your Twilio WhatsApp number)

4. **Deploy**:

   - Click "Deploy"
   - Wait for the build and deployment process to complete

5. **Note your backend URL**:
   - Once deployed, note the URL provided by Vercel (e.g., `https://resume-ai-backend-yourname.vercel.app`)

## Step 3: Update Frontend Configuration

1. **Update the API URL in the frontend's vercel.json**:

   - Open `resume_frontend/vercel.json`
   - Update the destination in the rewrites section with your backend URL:

   ```json
   "rewrites": [
     {
       "source": "/api/:path*",
       "destination": "https://YOUR-BACKEND-URL.vercel.app/api/:path*"
     }
   ]
   ```

2. **Update environment variables**:
   - Open `resume_frontend/.env.production`
   - Ensure it contains: `VITE_API_URL="/api"`

## Step 4: Deploy the Frontend

1. **Go to the Vercel Dashboard**:

   - Visit [https://vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "Add New" → "Project"

2. **Import your repository again**:

   - Select the same GitHub repository
   - Choose "resume_frontend" as the root directory for this deployment
   - Configure the following settings:
     - Framework Preset: Vite
     - Build Command: `npm run build`
     - Output Directory: `dist`

3. **Add environment variables**:

   - VERCEL_BACKEND_URL: Your backend URL (e.g., `https://resume-ai-backend-yourname.vercel.app`)

4. **Deploy**:
   - Click "Deploy"
   - Wait for the build and deployment process to complete

## Step 5: Link Deployments

1. **Test the connection**:

   - Visit your deployed frontend URL
   - Try generating a resume
   - Check network requests to ensure they're hitting your backend API

2. **Troubleshooting CORS issues**:
   - If you experience CORS errors, go to your backend deployment
   - Add the frontend URL to allowed origins in the environment variables
   - Redeploy the backend

## Step 6: Set up Custom Domain (Optional)

1. **Add a custom domain in Vercel**:

   - Go to your frontend project in the Vercel dashboard
   - Click "Settings" → "Domains"
   - Add your custom domain
   - Follow DNS instructions to verify ownership

2. **Update backend CORS settings**:
   - Add your custom domain to the allowed origins list
   - Redeploy your backend

## Helpful Commands for Local Testing

Before deploying, test locally to ensure everything works:

```bash
# Build the backend
cd resume-ai-backend
./mvnw clean package

# Test backend locally
./mvnw spring-boot:run

# Build the frontend
cd resume_frontend
npm run build

# Test frontend locally
npm run dev
```

## Monitoring Your Deployment

- **Vercel Analytics**: Monitor traffic, errors, and performance
- **Logs**: Check for errors in the Vercel dashboard under "Deployments" → Select deployment → "Logs"
- **Status**: Monitor your project's status in the Vercel dashboard

## Additional Resources

- [Vercel CLI Documentation](https://vercel.com/docs/cli)
- [Spring Boot on Vercel](https://vercel.com/guides/using-java-spring-boot-with-vercel)
- [Environment Variables in Vercel](https://vercel.com/docs/concepts/projects/environment-variables)

# Vercel Deployment Guide for Resume Generator

This guide will help you deploy the frontend component of your resume generator application using Vercel and the backend component using a more suitable service like Railway, Render, or Heroku.

## Recommendation for Backend Deployment

Vercel is primarily designed for frontend applications and serverless functions. For Spring Boot applications like our backend, platforms like Railway, Render, or Heroku are better choices. Here's how to deploy each component:

1. **Build your Spring Boot application:**
   ```bash
   cd resume-ai-backend
   ./mvnw clean package
   ```

2. **Create a `vercel.json` file in your backend directory:**
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "api/**/*.js",
         "use": "@vercel/node"
       }
     ],
     "routes": [
       {
         "src": "/api/(.*)",
         "dest": "/api/$1"
       }
## Backend Deployment (Using Railway - Recommended)

1. **Sign up for Railway at https://railway.app/**

2. **Connect your GitHub repository**

3. **Create a new project from your GitHub repo**
   - Select your repository
   - Choose the `resume-ai-backend` directory

4. **Configure environment variables:**
   - `OPENAI_API_KEY` - Your OpenAI API key
   - `SPRING_PROFILES_ACTIVE` - Set to `production`
   - `TWILIO_ACCOUNT_SID` - Your Twilio account SID (if using WhatsApp feature)
   - `TWILIO_AUTH_TOKEN` - Your Twilio auth token (if using WhatsApp feature)
   - `TWILIO_PHONE_NUMBER` - Your Twilio phone number (if using WhatsApp feature)

5. **Deploy your application**
   - Railway will automatically detect the Spring Boot application

6. **Note the deployment URL** (e.g., `resume-ai-backend-production.up.railway.app`)
   - This URL will be needed for the frontend configuration

## Frontend Deployment (Vercel - Perfect Match)

1. **Prepare your environment variables:**
   - Create a `.env.production` file with:
   ```
   VITE_API_URL=https://your-backend-url
   ```
   (Replace `your-backend-url` with your actual backend URL from Railway)

2. **Update your frontend configuration:**
   - In `resume_frontend/vercel.json`, update the API destination:

   ```json
   {
     "framework": "vite",
     "buildCommand": "npm run build",
     "outputDirectory": "dist",
     "rewrites": [
       { 
         "source": "/api/:path*", 
         "destination": "https://your-backend-url/api/:path*" 
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

3. **Deploy your frontend to Vercel:**
   - Sign in to [Vercel](https://vercel.com)
   - Import your GitHub repository
   - Select the `resume_frontend` directory as the root
   - Configure the build settings:
     - Framework Preset: Vite
     - Build Command: `npm run build`
     - Output Directory: `dist`
   - Add environment variables if needed
   - Click "Deploy"

## Testing the Deployment

After both frontend and backend are deployed:

1. **Visit your frontend Vercel URL**
2. **Test generating a resume** to ensure the frontend can communicate with the backend
3. **Check the browser console** for any CORS or API connection issues

## Troubleshooting

### CORS Issues

If you encounter CORS issues, ensure the backend is properly configured to allow requests from your frontend domain:

```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("https://your-frontend-vercel-domain.vercel.app")
                .allowedMethods("GET", "POST", "PUT", "DELETE")
                .allowedHeaders("*");
    }
}
```

### API Connection Issues

If the frontend cannot connect to the backend API:
1. Check the rewrites in the frontend `vercel.json`
2. Verify environment variables are set correctly
3. Test the backend API directly using tools like Postman

## Alternative: Using Vercel CLI

If you prefer using the command line:

1. **Install Vercel CLI:** 
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy from the frontend directory:**
   ```bash
   cd resume_frontend
   vercel
   ```

4. **For production deployment:**
   ```bash
   vercel --prod
   ```

## Environment Variables on Vercel

When deploying, make sure to set these environment variables in your Vercel project settings:

1. Frontend: `VITE_API_URL` - Your backend URL

## Summary

This deployment strategy:
1. Hosts the Spring Boot backend on Railway (recommended) or another Java-friendly platform
2. Deploys the React frontend on Vercel
3. Configures the frontend to communicate with the backend via API rewrites

By following this approach, you'll have a robust, scalable deployment that leverages the strengths of each platform while ensuring your application functions correctly.

After deployment, test that:
1. The frontend loads correctly
2. API requests are properly forwarded to the backend
3. Resume generation works end-to-end

## Troubleshooting

1. **CORS issues:** Check that your backend allows requests from your Vercel domain
2. **API connectivity:** Verify that the API URL is correctly set in your frontend
3. **Environment variables:** Ensure they are properly set in Vercel's project settings
4. **Build errors:** Review build logs in the Vercel dashboard

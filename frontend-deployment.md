# Frontend Deployment with Vercel

## Prerequisites

1. GitHub repository with your project
2. Vercel account

## Steps for Deployment

1. **Push your code to GitHub**:
   Follow the git instructions to push your project to GitHub

2. **Sign up for Vercel**:
   Go to https://vercel.com and sign up with your GitHub account

3. **Import your Repository**:

   - Click "Add New" > "Project"
   - Select your GitHub repository
   - Vercel will automatically detect that it's a Vite project

4. **Configure your project**:

   - Framework preset: Vite
   - Root directory: `resume_frontend`
   - Build command: `npm run build`
   - Output directory: `dist`
   - Install command: `npm install`

5. **Set Environment Variables**:

   - Add the environment variable `VITE_API_URL` with the value of your deployed backend URL
   - For example: `https://your-backend-url.com`
   - Make sure to include the protocol (https://)

6. **Deploy**:

   - Click "Deploy"
   - Vercel will build and deploy your frontend

7. **Configure Custom Domain (Optional)**:
   - In the project settings, go to "Domains"
   - Add your custom domain
   - Follow the instructions to verify ownership

## Updating Your Deployment

Whenever you push changes to your GitHub repository, Vercel will automatically rebuild and redeploy your site.

## Testing Your Deployment

After deployment, test that:

1. The landing page loads correctly
2. The resume generator works
3. API calls to the backend work properly

If you encounter any CORS issues, ensure your backend is properly configured to accept requests from your Vercel domain.

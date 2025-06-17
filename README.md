# AI Resume Generator

An AI-powered resume generator that creates job-tailored resumes through a modern web interface.

## Project Overview

This project consists of two main parts:

1. **Frontend (React/Vite)**: A modern UI with a landing page and resume generation capabilities
2. **Backend (Java Spring Boot)**: AI-powered resume generation API using OpenAI

## Deployment

This project is set up for deployment with:

- **Frontend**: Deploy to Vercel
- **Backend**: Deploy to Railway, Render, or other Java-friendly platforms

See the [Vercel Deployment Guide](/vercel-deployment-guide.md) for complete instructions.

## Project Structure

```
resume_frontend/          # React/Vite frontend application
resume-ai-backend/        # Java Spring Boot backend application
```

## Local Development

### Prerequisites

- Node.js and npm
- Java 17+ and Maven
- Local LLM through Ollama (or configure Spring AI for other providers)

### Running the Frontend

```bash
cd resume_frontend
npm install
npm run dev
```

### Running the Backend

```bash
cd resume-ai-backend
./mvnw spring-boot:run
```

## Deployment Guide

### Deploying the Backend

For the backend, you need a server that can run Java applications. Options include:

1. **Railway.app**: Good for Spring Boot applications
2. **Heroku**: Traditional option for Java applications
3. **AWS Elastic Beanstalk**: More enterprise-focused option
4. **Digital Ocean**: Can deploy with App Platform

Important steps for backend deployment:

1. Configure the AI model to use (set in application.properties)
2. Ensure CORS is properly configured (already set up)
3. Set up proper environment variables for production

### Deploying the Frontend with Vercel

1. Push your code to GitHub
2. Sign up for Vercel (https://vercel.com)
3. Connect your GitHub repository
4. Configure the environment variables:

   - `VITE_API_URL`: URL of your deployed backend API

5. Deploy! Vercel will automatically build and deploy your frontend.

### Environment Variables

Frontend (.env.production):

- `VITE_API_URL`: Your deployed backend URL

Backend:

- Configure `spring.ai.ollama.chat.model` in your deployment platform

## Notes for Deployment

1. The backend requires access to an LLM model. In production, you may want to:

   - Host your own Ollama instance
   - Switch to a cloud AI provider like OpenAI
   - Use any other Spring AI supported provider

2. For best performance, consider:

   - Setting up proper caching
   - Using a CDN for the frontend
   - Optimizing API requests

3. When updating `VITE_API_URL`, make sure to include the protocol (https://)

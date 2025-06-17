#!/bin/bash

# Vercel Deployment Preparation Script
# This script helps prepare your project for Vercel deployment

echo "===== AI Resume Generator - Vercel Deployment Preparation ====="

# Make sure we're in the project root
if [ ! -d "resume-ai-backend" ] || [ ! -d "resume_frontend" ]; then
  echo "Error: Please run this script from the project root directory"
  exit 1
fi

# Step 1: Build backend
echo "📦 Building Spring Boot backend..."
cd resume-ai-backend
chmod +x mvnw
./mvnw clean package
if [ $? -ne 0 ]; then
  echo "❌ Backend build failed"
  exit 1
fi
echo "✅ Backend built successfully"

# Step 2: Build frontend
echo "📦 Building React frontend..."
cd ../resume_frontend
npm install
npm run build
if [ $? -ne 0 ]; then
  echo "❌ Frontend build failed"
  exit 1
fi
echo "✅ Frontend built successfully"

# Step 3: Check configuration
echo "🔍 Checking configuration files..."

# Check if vercel.json exists in both directories
if [ ! -f "../resume-ai-backend/vercel.json" ]; then
  echo "⚠️ Backend vercel.json not found"
fi

if [ ! -f "vercel.json" ]; then
  echo "⚠️ Frontend vercel.json not found"
fi

# Check environment files
if [ ! -f ".env.production" ]; then
  echo "⚠️ Frontend .env.production not found"
fi

# Step 4: Print next steps
echo ""
echo "===== Deployment Preparation Complete ====="
echo ""
echo "Next steps:"
echo "1. Install Vercel CLI: npm install -g vercel"
echo "2. Login to Vercel: vercel login"
echo "3. Deploy backend: cd ../resume-ai-backend && vercel"
echo "4. Deploy frontend: cd ../resume_frontend && vercel"
echo ""
echo "For detailed instructions, see vercel-deployment-steps.md"
echo ""

cd ..
echo "Done! Ready for deployment."

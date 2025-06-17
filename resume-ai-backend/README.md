# AI-Based Resume Generator - Backend

Java Spring Boot backend that powers the AI resume generation service.

## Features

- OpenAI API integration for resume generation
- Job-tailored resume creation
- WhatsApp resume delivery option
- RESTful API for frontend integration

## Technologies

- Java 17
- Spring Boot
- OpenAI API
- Twilio API for WhatsApp

## Deployment

This backend can be deployed to Railway, Render, or other Java-friendly platforms:

1. Set up environment variables (`OPENAI_API_KEY`, etc.)
2. Deploy the Spring Boot application
3. See the [Vercel Deployment Guide](/vercel-deployment-guide.md) for complete instructions

## Getting Started

### Prerequisites

- Java 17+
- Maven
- OpenAI API Key
- (Optional) Twilio Account for WhatsApp functionality

### Installation

1. Clone the repository
2. Configure environment variables:
   - Create a `.env` file with:
     ```
     OPENAI_API_KEY=your_openai_api_key
     ```
   - For WhatsApp functionality:
     ```
     TWILIO_ACCOUNT_SID=your_twilio_sid
     TWILIO_AUTH_TOKEN=your_twilio_auth_token
     TWILIO_PHONE_NUMBER=your_twilio_phone_number
     ```

3. Build and run the application:
   ```bash
   ./mvnw clean install
   ./mvnw spring-boot:run
   ```

4. The backend will be available at `http://localhost:8080`

## API Endpoints

- `POST /api/v1/resume/generate` - Generate a basic resume
- `POST /api/v1/resume/generate-tailored` - Generate a resume tailored to a job description
- `POST /api/v1/resume/send-to-whatsapp` - Send the resume to a WhatsApp number

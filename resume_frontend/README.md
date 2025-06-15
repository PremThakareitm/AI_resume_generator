# AI-Based Resume Generator

An AI-powered resume generator that creates job-tailored resumes through a modern web interface.

## Features

- Modern landing page with a bot-like widget interface
- AI-powered resume generation tailored to specific job descriptions
- Responsive design that works on all devices
- PDF download and print functionality
- Resume preview with professional formatting

## Project Structure

- **Frontend (React/Vite)**: Modern UI with landing page and resume generation
- **Backend (Java Spring Boot)**: AI-powered resume generation API

## Getting Started

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

## Usage

1. Visit the landing page
2. Click on "Build Resume" to open the resume builder widget
3. Input your profile information and the job description
4. Generate and download your tailored resume

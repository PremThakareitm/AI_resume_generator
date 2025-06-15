# Backend Deployment Options

## Option 1: Railway.app Deployment

1. Sign up for Railway.app
2. Connect your GitHub repository
3. Create a new project and select the resume-ai-backend folder
4. Set the following environment variables:
   - `SPRING_AI_OLLAMA_CHAT_MODEL=mistral:latest` (or your preferred model)
   - `SPRING_AI_OLLAMA_BASE_URL=https://your-ollama-instance-url` (if using external Ollama)
5. Deploy the project

## Option 2: Heroku Deployment

1. Install Heroku CLI
2. Login to Heroku: `heroku login`
3. Create a new app: `heroku create ai-resume-backend`
4. Add the Java buildpack: `heroku buildpacks:set heroku/java`
5. Configure environment variables:
   ```
   heroku config:set SPRING_AI_OLLAMA_CHAT_MODEL=mistral:latest
   heroku config:set SPRING_AI_OLLAMA_BASE_URL=https://your-ollama-instance-url
   ```
6. Deploy: `git subtree push --prefix resume-ai-backend heroku main`

## Option 3: AWS Elastic Beanstalk

1. Install AWS CLI and EB CLI
2. Initialize EB: `eb init`
3. Create environment: `eb create ai-resume-backend`
4. Configure environment variables in the AWS console
5. Deploy: `eb deploy`

## Option 4: Use OpenAI Instead of Ollama (Easier for Production)

To switch from Ollama to OpenAI, modify your `application.properties`:

```properties
# Comment out Ollama configuration
#spring.ai.ollama.chat.model=mistral:latest

# Use OpenAI instead
spring.ai.openai.api-key=your-api-key
spring.ai.openai.chat.options.model=gpt-3.5-turbo
```

Then deploy to any platform like normal.

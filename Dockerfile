FROM openjdk:17-slim

WORKDIR /app

# Copy the entire repository
COPY . .

# Set execute permissions on mvnw and build the application
RUN chmod +x ./resume-ai-backend/mvnw && \
    cd resume-ai-backend && \
    ./mvnw clean package -DskipTests

# Set the working directory to the backend folder
WORKDIR /app/resume-ai-backend

# Run the application
CMD ["java", "-jar", "target/*.jar"]

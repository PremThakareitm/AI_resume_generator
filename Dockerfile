FROM openjdk:17-jdk

# Set working directory
WORKDIR /app

# Copy the backend directory
COPY resume-ai-backend/ /app/

# Make mvnw executable
RUN chmod +x ./mvnw

# Build with maven using settings.xml
RUN ./mvnw -s settings.xml clean package -DskipTests

# Run the application
EXPOSE 8080
CMD find target -name "*.jar" -exec java -jar {} \;

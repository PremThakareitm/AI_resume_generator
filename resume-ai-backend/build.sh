#!/bin/bash
echo "Building Spring Boot application..."
chmod +x mvnw
./mvnw clean package -DskipTests

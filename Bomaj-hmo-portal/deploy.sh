#!/bin/bash

# Build and deploy script for Bomaj HMO Portal

echo "🚀 Starting deployment process..."

# 1. Run tests
echo "📋 Running tests..."
npm test
if [ $? -ne 0 ]; then
    echo "❌ Tests failed. Deployment aborted."
    exit 1
fi

# 2. Build application
echo "🔨 Building application..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Build failed. Deployment aborted."
    exit 1
fi

# 3. Build Docker image
echo "🐳 Building Docker image..."
docker build -t bomaj-hmo-portal:latest .

# 4. Deploy to production
echo "☁️ Deploying to production..."
# Add your deployment commands here
# Example for AWS ECS:
# aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 123456789.dkr.ecr.us-east-1.amazonaws.com
# docker tag bomaj-hmo-portal:latest 123456789.dkr.ecr.us-east-1.amazonaws.com/bomaj-hmo-portal:latest
# docker push 123456789.dkr.ecr.us-east-1.amazonaws.com/bomaj-hmo-portal:latest
# aws ecs update-service --cluster bomaj-cluster --service portal-service --force-new-deployment

echo "✅ Deployment completed successfully!"
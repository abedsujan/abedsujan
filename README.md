# AWS EC2 Deployment Guides for React Apps

This repository contains guides and scripts for deploying React applications to AWS EC2.

## 📚 Available Guides

### For Frontend Deployment:

🚀 **[Step-by-Step Guide](STEP_BY_STEP_GUIDE.md)** - Complete React/Next.js frontend deployment to EC2

⚡ **[Next.js Guide](NEXTJS_GUIDE.md)** - Specific guide for Next.js with static export

### For Backend Deployment:

🔥 **[Express Backend Guide](EXPRESS_BACKEND_GUIDE.md)** - **EC2 + MongoDB Atlas**  
Step-by-step guide for deploying Node.js Express backend with MongoDB Atlas, PM2, and optional Nginx/SSL. Perfect if you already have frontend deployed elsewhere.

🗄️ **[Backend + MongoDB Guide](BACKEND_DEPLOYMENT.md)** - Backend deployment with both local MongoDB and MongoDB Atlas options

⚡ **[Lambda + DynamoDB Guide (Console)](LAMBDA_DYNAMODB_CONSOLE_GUIDE.md)** - **SERVERLESS - RECOMMENDED**  
Deploy serverless backend using AWS Lambda and DynamoDB through AWS Console (no CLI needed!). Automatic scaling, pay-per-use pricing (~$0.50/month for 100k requests), zero server management.

📟 **[Lambda + DynamoDB Guide (CLI)](LAMBDA_DYNAMODB_GUIDE.md)** - **SERVERLESS - Advanced**  
Same serverless deployment using AWS CLI commands. For users comfortable with command-line tools.

### Complete Documentation:

📖 **[Complete Deployment Guide](DEPLOYMENT.md)
Comprehensive documentation covering:
- Static website deployment
- MongoDB integration
- REST API backend setup
- Security best practices
- Troubleshooting

## 🛠️ Automation Scripts

All scripts are in the `scripts/` folder:

### For Initial Setup:
- **`setup-server.sh`** - Installs Node.js, Nginx, Git, PM2 on your EC2 instance
- **`configure-nginx.sh`** - Configures Nginx to serve your React app

### For Updates:
- **`deploy.sh`** - Quick deploy script (pull, build, reload)

### For Future Backend:
- **`install-mongodb.sh`** - Installs and sets up MongoDB

## 📋 Quick Start

1. Read the [Step-by-Step Guide](STEP_BY_STEP_GUIDE.md)
2. Launch an EC2 instance on AWS
3. Connect via SSH
4. Run the setup script:
   ```bash
   curl -o setup-server.sh https://raw.githubusercontent.com/abedsujan/abedsujan/main/scripts/setup-server.sh
   chmod +x setup-server.sh
   ./setup-server.sh
   ```
5. Upload your React project
6. Build and deploy!

## 🎯 What You'll Learn

### Frontend Deployment:
- How to launch and configure AWS EC2
- How to deploy React/Next.js applications
- How to use Nginx as a web server
- Static site deployment best practices

### Backend Deployment:
- **EC2 Option**: Deploy Node.js Express backend to EC2
- **Serverless Option**: Deploy with AWS Lambda + DynamoDB (no servers!)
- Setup MongoDB Atlas cloud database
- Use PM2 for process management (EC2)
- Configure security groups and CORS
- Setup SSL with Let's Encrypt
- Auto-start backend on server reboot (EC2)
- Automatic scaling and pay-per-use pricing (Lambda)

### Full-Stack:
- Integrate MongoDB with REST API
- Configure Nginx as reverse proxy
- DevOps best practices

## 💡 Tips

- Start with the static deployment first
- Add backend/database later once comfortable
- Keep your EC2 key file safe!
- Use the automation scripts to save time

## 🤝 Contributing

Feel free to open issues or submit pull requests to improve these guides!

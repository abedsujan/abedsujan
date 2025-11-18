# AWS EC2 Deployment Guides for React Apps

This repository contains guides and scripts for deploying React applications to AWS EC2.

## 📚 Available Guides

### 🚀 [Step-by-Step Guide](STEP_BY_STEP_GUIDE.md) - **START HERE!**
A simple, beginner-friendly guide to deploy your React app to AWS EC2. Follow this if you want clear, numbered steps to do it yourself.

### 📖 [Complete Deployment Guide](DEPLOYMENT.md)
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

- How to launch and configure AWS EC2
- How to deploy React applications
- How to use Nginx as a web server
- How to add MongoDB and backend APIs
- DevOps best practices

## 💡 Tips

- Start with the static deployment first
- Add backend/database later once comfortable
- Keep your EC2 key file safe!
- Use the automation scripts to save time

## 🤝 Contributing

Feel free to open issues or submit pull requests to improve these guides!

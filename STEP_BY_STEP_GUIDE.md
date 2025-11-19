# Step-by-Step Guide: Deploy React/Next.js App to AWS EC2

Follow these steps in order. I've broken it down into simple, actionable tasks.

> **📝 Note**: If you have a **Next.js** project, see [NEXTJS_GUIDE.md](NEXTJS_GUIDE.md) for Next.js-specific instructions. This guide works for both React and Next.js, but Next.js has some additional configuration needed.

---

## PART 1: SETUP AWS EC2 INSTANCE

### Step 1: Create AWS Account
1. Go to https://aws.amazon.com/
2. Click "Create an AWS Account"
3. Follow the signup process (you'll need a credit card, but we'll use free tier)
4. Log in to AWS Console

### Step 2: Launch EC2 Instance
1. In AWS Console, search for "EC2" and click on it
2. Click the orange "Launch Instance" button
3. Fill in the following:
   - **Name**: `my-react-app` (or any name you like)
   - **Application and OS Images**: Select "Ubuntu Server 22.04 LTS"
   - **Instance type**: Select `t2.micro` (free tier)
   - **Key pair**: 
     - Click "Create new key pair"
     - Name it: `my-react-key`
     - Key pair type: RSA
     - File format: `.pem` if you're on Mac/Linux, `.ppk` if on Windows
     - Click "Create key pair" - it will download automatically
     - **IMPORTANT**: Save this file in a safe place, you can't download it again!

### Step 3: Configure Security Settings
Still on the Launch Instance page:

1. Under "Network settings", click "Edit"
2. Under "Firewall (security groups)", click "Create security group"
3. Check these boxes to add rules:
   - ✅ Allow SSH traffic from: Select "My IP"
   - ✅ Allow HTTP traffic from the internet
   - ✅ Allow HTTPS traffic from the internet
4. Click "Add security group rule" button
   - Type: Custom TCP
   - Port range: 3000
   - Source: Anywhere (0.0.0.0/0)

### Step 4: Launch Instance
1. On the right side, click "Launch instance"
2. Click "View all instances"
3. Wait until "Instance state" shows "Running" (takes 1-2 minutes)
4. Select your instance and note the "Public IPv4 address" - you'll need this!

---

## PART 2: CONNECT TO YOUR EC2 INSTANCE

### Step 5: Connect via SSH

**On Mac/Linux:**
1. Open Terminal
2. Navigate to where you saved your key file:
   ```bash
   cd ~/Downloads
   ```
3. Change permissions on the key file:
   ```bash
   chmod 400 my-react-key.pem
   ```
4. Connect to EC2 (replace `YOUR_IP` with your instance's public IP):
   ```bash
   ssh -i my-react-key.pem ubuntu@YOUR_IP
   ```
5. Type "yes" when asked about authenticity
6. You should now be connected! You'll see `ubuntu@ip-...`

**On Windows:**
1. Download and install [PuTTY](https://www.putty.org/) if you used `.ppk` format
2. Or use Windows PowerShell/Command Prompt if you used `.pem` format:
   ```bash
   ssh -i my-react-key.pem ubuntu@YOUR_IP
   ```

---

## PART 3: SETUP SERVER SOFTWARE

Now you're inside your EC2 instance. Run these commands one by one:

### Step 6: Update Ubuntu
```bash
sudo apt update
sudo apt upgrade -y
```
(This takes 2-3 minutes)

### Step 7: Install Node.js
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
```

Check it worked:
```bash
node --version
npm --version
```
You should see version numbers.

### Step 8: Install Nginx (Web Server)
```bash
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

### Step 9: Install Git
```bash
sudo apt install -y git
```

---

## PART 4: UPLOAD YOUR REACT PROJECT

Choose ONE of these methods:

### Step 10a: Option A - Using GitHub (Recommended)

**First, push your project to GitHub from your computer:**
1. Go to GitHub.com and create a new repository
2. On your local computer, in your React project folder:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

**Then, on your EC2 instance:**
```bash
cd /home/ubuntu
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO
```

### Step 10b: Option B - Using SCP (Upload from Computer)

**On your LOCAL computer** (not EC2), open a new terminal:
```bash
cd /path/to/your/react/project
scp -i ~/Downloads/my-react-key.pem -r . ubuntu@YOUR_IP:/home/ubuntu/my-app
```
(Replace `/path/to/your/react/project` with your actual project path)

**Then connect back to EC2:**
```bash
ssh -i ~/Downloads/my-react-key.pem ubuntu@YOUR_IP
cd /home/ubuntu/my-app
```

---

## PART 5: BUILD YOUR REACT APP

### Step 11: Install Dependencies and Build
```bash
npm install
```
(This takes 2-5 minutes)

```bash
npm run build
```

**For Create React App**: This creates a `build` folder with your static files

**For Next.js**: 
- First, make sure `next.config.js` has `output: 'export'` configured
- This creates an `out` folder with your static files
- See [NEXTJS_GUIDE.md](NEXTJS_GUIDE.md) for detailed Next.js setup

**Verify your build:**
```bash
# For React
ls -la build/

# For Next.js
ls -la out/
```

---

## PART 6: CONFIGURE NGINX

### Step 12: Create Nginx Configuration

**Option A: Use the automated script (Recommended)**

```bash
curl -o configure-nginx.sh https://raw.githubusercontent.com/abedsujan/abedsujan/main/scripts/configure-nginx.sh
chmod +x configure-nginx.sh
./configure-nginx.sh
```

This script will auto-detect whether you have a React (`build/`) or Next.js (`out/`) project and configure Nginx accordingly.

**Option B: Manual configuration**

```bash
sudo nano /etc/nginx/sites-available/react-app
```

**For React projects**, copy and paste this:
```nginx
server {
    listen 80;
    listen [::]:80;
    
    server_name _;
    
    root /home/ubuntu/YOUR_FOLDER_NAME/build;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

**For Next.js projects**, copy and paste this:
```nginx
server {
    listen 80;
    listen [::]:80;
    
    server_name _;
    
    root /home/ubuntu/YOUR_FOLDER_NAME/out;
    index index.html;
    
    location / {
        try_files $uri $uri.html $uri/ /index.html;
    }
    
    # Cache Next.js static assets
    location /_next/static/ {
        alias /home/ubuntu/YOUR_FOLDER_NAME/out/_next/static/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

**IMPORTANT**: Replace `YOUR_FOLDER_NAME` with your actual folder name!

If using manual configuration, save and exit:
- Press `Ctrl + X`
- Press `Y`
- Press `Enter`

### Step 13: Enable the Site
```bash
sudo ln -s /etc/nginx/sites-available/react-app /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
```

If you see "syntax is ok" and "test is successful":
```bash
sudo systemctl reload nginx
```

### Step 14: Fix Permissions
```bash
sudo chmod -R 755 /home/ubuntu
```

---

## PART 7: TEST YOUR WEBSITE

### Step 15: Access Your Website
1. Open a web browser
2. Go to: `http://YOUR_IP` (use your EC2 public IP)
3. **Your React/Next.js app should be live!** 🎉

---

## PART 8: TROUBLESHOOTING

If your site doesn't load, try these:

1. **No build/out folder?**
   - **React**: Run `npm run build` again
   - **Next.js**: Check `next.config.js` has `output: 'export'`, then run `npm run build`
   - See [NEXTJS_GUIDE.md](NEXTJS_GUIDE.md) for Next.js configuration
   ```bash
   sudo systemctl status nginx
   ```
   Should show "active (running)"

2. **Check Nginx error logs:**
   ```bash
   sudo tail -20 /var/log/nginx/error.log
   ```

3. **Verify build folder exists:**
   ```bash
   ls -la /home/ubuntu/YOUR_FOLDER_NAME/build
   ```
   Should show index.html and other files

4. **Check security group:**
   - Go to EC2 Console
   - Select your instance
   - Click "Security" tab
   - Verify HTTP (port 80) is allowed from 0.0.0.0/0

5. **Restart Nginx:**
   ```bash
   sudo systemctl restart nginx
   ```

---

## QUICK REFERENCE

### Important Paths:
- Your project: `/home/ubuntu/YOUR_FOLDER_NAME`
- Build folder: `/home/ubuntu/YOUR_FOLDER_NAME/build`
- Nginx config: `/etc/nginx/sites-available/react-app`

### Useful Commands:
```bash
# Reconnect to EC2
ssh -i my-react-key.pem ubuntu@YOUR_IP

# Restart Nginx
sudo systemctl restart nginx

# View Nginx logs
sudo tail -f /var/log/nginx/error.log

# Rebuild React app
cd /home/ubuntu/YOUR_FOLDER_NAME
npm run build
sudo systemctl reload nginx
```

### Update Your App:
When you make changes to your code:
```bash
# If using GitHub:
cd /home/ubuntu/YOUR_FOLDER_NAME
git pull
npm install
npm run build
sudo systemctl reload nginx

# If using SCP:
# Upload files from your computer, then:
cd /home/ubuntu/YOUR_FOLDER_NAME
npm install
npm run build
sudo systemctl reload nginx
```

---

## NEXT STEPS (FOR LATER)

Once your static site is working, you can add:
- Custom domain name
- HTTPS/SSL certificate
- MongoDB database
- Backend API

See `DEPLOYMENT.md` for detailed instructions on these advanced features.

---

## That's It!

You now have your React app running on AWS EC2! 

If you get stuck, check the troubleshooting section or refer to `DEPLOYMENT.md` for more details.

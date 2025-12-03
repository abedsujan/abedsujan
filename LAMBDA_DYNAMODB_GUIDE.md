# AWS Lambda + DynamoDB Serverless Backend Deployment Guide

**Project**: Serverless Backend API  
**Stack**: AWS Lambda + DynamoDB + API Gateway  
**Architecture**: Serverless (No EC2 needed!)

---

## 🎯 Why Serverless with Lambda + DynamoDB?

**Advantages over EC2 + MongoDB:**
- ✅ **No server management** - AWS handles scaling, updates, and maintenance
- ✅ **Pay per use** - Only pay when your API is called (very cost-effective for low traffic)
- ✅ **Auto-scaling** - Automatically handles traffic spikes
- ✅ **High availability** - Built-in redundancy across multiple availability zones
- ✅ **Free tier** - 1 million free Lambda requests/month + 25 GB DynamoDB storage

**Trade-offs:**
- ❌ Cold starts (first request may be slower)
- ❌ Different development paradigm
- ❌ DynamoDB is NoSQL (different from MongoDB/SQL)

---

## 📋 Prerequisites

- AWS Account
- AWS CLI installed on your computer
- Node.js installed locally (for development)
- Your frontend already deployed (Vercel, Netlify, etc.)

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Client/Browser                        │
│         (Your Frontend - Already Deployed)               │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ HTTPS Requests
                     ▼
┌─────────────────────────────────────────────────────────┐
│                   API Gateway                            │
│         https://xxx.execute-api.region.amazonaws.com     │
│                                                           │
│   Routes:                                                │
│   - GET  /api/cars                                       │
│   - GET  /api/cars/search?query=ABC                      │
│   - GET  /api/cars/{plate}                               │
│   - POST /api/cars                                       │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ Invokes
                     ▼
┌─────────────────────────────────────────────────────────┐
│                  AWS Lambda Functions                    │
│                                                           │
│   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│   │  getCars    │  │ searchCars  │  │  getCar     │    │
│   │  Function   │  │  Function   │  │  Function   │    │
│   └──────┬──────┘  └──────┬──────┘  └──────┬──────┘    │
│          │                 │                 │           │
└──────────┼─────────────────┼─────────────────┼──────────┘
           │                 │                 │
           └─────────────────┴─────────────────┘
                             │
                             ▼
                   ┌──────────────────┐
                   │   DynamoDB       │
                   │   Table: Cars    │
                   │                  │
                   │   Primary Key:   │
                   │   plate (String) │
                   └──────────────────┘
```

---

## PART 1: Setup AWS CLI

### Step 1: Install AWS CLI

**On Mac:**
```bash
brew install awscli
```

**On Linux:**
```bash
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
```

**On Windows:**
Download and run: https://awscli.amazonaws.com/AWSCLIV2.msi

**Verify installation:**
```bash
aws --version
```

### Step 2: Configure AWS Credentials

1. **Get AWS Access Keys**
   - Login to AWS Console
   - Go to **IAM** → **Users** → Your user → **Security credentials**
   - Click **"Create access key"**
   - Choose **"CLI"** as use case
   - Download and save the keys

2. **Configure AWS CLI**
```bash
aws configure
```

Enter:
- **AWS Access Key ID**: Your access key
- **AWS Secret Access Key**: Your secret key
- **Default region**: `us-east-1` (or your preferred region)
- **Default output format**: `json`

---

## PART 2: Create DynamoDB Table

### Step 3: Create Cars Table

**Option A: Using AWS Console**

1. Go to **AWS Console** → **DynamoDB**
2. Click **"Create table"**
3. Configure:
   - **Table name**: `Cars`
   - **Partition key**: `plate` (String)
   - **Table settings**: Use default settings (On-demand)
4. Click **"Create table"**

**Option B: Using AWS CLI**

```bash
aws dynamodb create-table \
    --table-name Cars \
    --attribute-definitions \
        AttributeName=plate,AttributeType=S \
    --key-schema \
        AttributeName=plate,KeyType=HASH \
    --billing-mode PAY_PER_REQUEST \
    --region us-east-1
```

### Step 4: Add Sample Data

Create `sample-data.json`:

```json
{
  "plate": "ABC123",
  "make": "Toyota",
  "model": "Camry",
  "year": 2020,
  "color": "Blue",
  "owner": "John Doe"
}
```

Insert data:

```bash
aws dynamodb put-item \
    --table-name Cars \
    --item file://sample-data.json \
    --region us-east-1
```

Or use JSON format:

```bash
aws dynamodb put-item \
    --table-name Cars \
    --item '{
        "plate": {"S": "ABC123"},
        "make": {"S": "Toyota"},
        "model": {"S": "Camry"},
        "year": {"N": "2020"},
        "color": {"S": "Blue"},
        "owner": {"S": "John Doe"}
    }' \
    --region us-east-1
```

---

## PART 3: Create Lambda Functions

### Step 5: Create Lambda Function Code

Create project structure:

```bash
mkdir lambda-backend
cd lambda-backend
npm init -y
npm install aws-sdk
```

**File: `getCars.js`** (Get all cars)

```javascript
const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    console.log('Event:', JSON.stringify(event, null, 2));
    
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // Update with your frontend domain
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET,POST,OPTIONS'
    };
    
    try {
        const params = {
            TableName: 'Cars'
        };
        
        const result = await dynamodb.scan(params).promise();
        
        return {
            statusCode: 200,
            headers: headers,
            body: JSON.stringify({
                success: true,
                data: result.Items
            })
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            headers: headers,
            body: JSON.stringify({
                success: false,
                error: error.message
            })
        };
    }
};
```

**File: `getCar.js`** (Get specific car by plate)

```javascript
const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    console.log('Event:', JSON.stringify(event, null, 2));
    
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET,OPTIONS'
    };
    
    try {
        const plate = event.pathParameters.plate;
        
        const params = {
            TableName: 'Cars',
            Key: {
                plate: plate
            }
        };
        
        const result = await dynamodb.get(params).promise();
        
        if (!result.Item) {
            return {
                statusCode: 404,
                headers: headers,
                body: JSON.stringify({
                    success: false,
                    error: 'Car not found'
                })
            };
        }
        
        return {
            statusCode: 200,
            headers: headers,
            body: JSON.stringify({
                success: true,
                data: result.Item
            })
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            headers: headers,
            body: JSON.stringify({
                success: false,
                error: error.message
            })
        };
    }
};
```

**File: `searchCars.js`** (Search cars)

```javascript
const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    console.log('Event:', JSON.stringify(event, null, 2));
    
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET,OPTIONS'
    };
    
    try {
        const query = event.queryStringParameters?.query || '';
        
        // Scan all items (for small datasets)
        // For production, consider using DynamoDB Streams + ElasticSearch
        const params = {
            TableName: 'Cars'
        };
        
        const result = await dynamodb.scan(params).promise();
        
        // Filter in Lambda (works for small datasets)
        const filteredItems = result.Items.filter(item => {
            const searchStr = query.toLowerCase();
            return (
                item.plate?.toLowerCase().includes(searchStr) ||
                item.make?.toLowerCase().includes(searchStr) ||
                item.model?.toLowerCase().includes(searchStr) ||
                item.color?.toLowerCase().includes(searchStr) ||
                item.owner?.toLowerCase().includes(searchStr)
            );
        });
        
        return {
            statusCode: 200,
            headers: headers,
            body: JSON.stringify({
                success: true,
                data: filteredItems
            })
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            headers: headers,
            body: JSON.stringify({
                success: false,
                error: error.message
            })
        };
    }
};
```

**File: `createCar.js`** (Create new car)

```javascript
const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    console.log('Event:', JSON.stringify(event, null, 2));
    
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST,OPTIONS'
    };
    
    try {
        const body = JSON.parse(event.body);
        
        // Validate required fields
        if (!body.plate) {
            return {
                statusCode: 400,
                headers: headers,
                body: JSON.stringify({
                    success: false,
                    error: 'Plate number is required'
                })
            };
        }
        
        const params = {
            TableName: 'Cars',
            Item: {
                plate: body.plate,
                make: body.make || '',
                model: body.model || '',
                year: body.year || 0,
                color: body.color || '',
                owner: body.owner || '',
                createdAt: new Date().toISOString()
            }
        };
        
        await dynamodb.put(params).promise();
        
        return {
            statusCode: 201,
            headers: headers,
            body: JSON.stringify({
                success: true,
                data: params.Item
            })
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            headers: headers,
            body: JSON.stringify({
                success: false,
                error: error.message
            })
        };
    }
};
```

### Step 6: Create Deployment Packages

Create deployment packages for each function:

```bash
# Create directories
mkdir -p dist/getCars dist/getCar dist/searchCars dist/createCar

# Copy files and create zip
cp getCars.js dist/getCars/index.js
cd dist/getCars && npm init -y && npm install aws-sdk && zip -r ../getCars.zip . && cd ../..

cp getCar.js dist/getCar/index.js
cd dist/getCar && npm init -y && npm install aws-sdk && zip -r ../getCar.zip . && cd ../..

cp searchCars.js dist/searchCars/index.js
cd dist/searchCars && npm init -y && npm install aws-sdk && zip -r ../searchCars.zip . && cd ../..

cp createCar.js dist/createCar/index.js
cd dist/createCar && npm init -y && npm install aws-sdk && zip -r ../createCar.zip . && cd ../..
```

Or use this script (`build.sh`):

```bash
#!/bin/bash

# Array of function names
functions=("getCars" "getCar" "searchCars" "createCar")

# Create dist directory
mkdir -p dist

for func in "${functions[@]}"; do
    echo "Building $func..."
    
    # Create function directory
    mkdir -p "dist/$func"
    
    # Copy function file
    cp "${func}.js" "dist/$func/index.js"
    
    # Create package.json
    cd "dist/$func"
    npm init -y
    npm install aws-sdk
    
    # Create zip
    zip -r "../${func}.zip" .
    
    cd ../..
    
    echo "✓ $func built successfully"
done

echo "All functions built!"
```

Make executable and run:
```bash
chmod +x build.sh
./build.sh
```

---

## PART 4: Deploy Lambda Functions

### Step 7: Create IAM Role for Lambda

Create `lambda-trust-policy.json`:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
```

Create role:

```bash
aws iam create-role \
    --role-name lambda-dynamodb-role \
    --assume-role-policy-document file://lambda-trust-policy.json
```

Attach policies:

```bash
# Basic Lambda execution
aws iam attach-role-policy \
    --role-name lambda-dynamodb-role \
    --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole

# DynamoDB access
aws iam attach-role-policy \
    --role-name lambda-dynamodb-role \
    --policy-arn arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess
```

Get role ARN (save this):
```bash
aws iam get-role --role-name lambda-dynamodb-role --query 'Role.Arn' --output text
```

### Step 8: Create Lambda Functions

Replace `ROLE_ARN` with your role ARN from previous step.

**Create getCars function:**

```bash
aws lambda create-function \
    --function-name getCars \
    --runtime nodejs18.x \
    --role ROLE_ARN \
    --handler index.handler \
    --zip-file fileb://dist/getCars.zip \
    --timeout 10 \
    --memory-size 256 \
    --region us-east-1
```

**Create getCar function:**

```bash
aws lambda create-function \
    --function-name getCar \
    --runtime nodejs18.x \
    --role ROLE_ARN \
    --handler index.handler \
    --zip-file fileb://dist/getCar.zip \
    --timeout 10 \
    --memory-size 256 \
    --region us-east-1
```

**Create searchCars function:**

```bash
aws lambda create-function \
    --function-name searchCars \
    --runtime nodejs18.x \
    --role ROLE_ARN \
    --handler index.handler \
    --zip-file fileb://dist/searchCars.zip \
    --timeout 10 \
    --memory-size 256 \
    --region us-east-1
```

**Create createCar function:**

```bash
aws lambda create-function \
    --function-name createCar \
    --runtime nodejs18.x \
    --role ROLE_ARN \
    --handler index.handler \
    --zip-file fileb://dist/createCar.zip \
    --timeout 10 \
    --memory-size 256 \
    --region us-east-1
```

### Step 9: Test Lambda Functions

Test getCars function:

```bash
aws lambda invoke \
    --function-name getCars \
    --payload '{}' \
    response.json

cat response.json
```

---

## PART 5: Create API Gateway

### Step 10: Create REST API

```bash
aws apigateway create-rest-api \
    --name "Cars API" \
    --description "API for car numberplate search" \
    --endpoint-configuration types=REGIONAL \
    --region us-east-1
```

Save the `id` from the output (you'll need it).

### Step 11: Get Root Resource ID

```bash
# Replace API_ID with your API ID
aws apigateway get-resources \
    --rest-api-id API_ID \
    --region us-east-1
```

Save the root resource `id`.

### Step 12: Create /api Resource

```bash
aws apigateway create-resource \
    --rest-api-id API_ID \
    --parent-id ROOT_RESOURCE_ID \
    --path-part api \
    --region us-east-1
```

Save the `/api` resource `id`.

### Step 13: Create /api/cars Resource

```bash
aws apigateway create-resource \
    --rest-api-id API_ID \
    --parent-id API_RESOURCE_ID \
    --path-part cars \
    --region us-east-1
```

Save the `/api/cars` resource `id`.

### Step 14: Create Methods and Integrations

This gets complex. **Recommended: Use AWS Console instead:**

1. Go to **API Gateway** in AWS Console
2. Select your API
3. Click **"Create Resource"**
   - Resource Name: `api`
   - Resource Path: `/api`
4. Create another resource under `/api`:
   - Resource Name: `cars`
   - Resource Path: `/cars`
5. Under `/api/cars`:
   - Click **"Create Method"** → **GET**
   - Integration type: **Lambda Function**
   - Lambda Function: `getCars`
   - Save
6. Create `/api/cars/search`:
   - Create resource: `search`
   - Method: **GET**
   - Lambda: `searchCars`
7. Create `/api/cars/{plate}`:
   - Create resource with path: `{plate}`
   - Method: **GET**
   - Lambda: `getCar`
8. Enable CORS for all methods:
   - Select each method
   - Click **Actions** → **Enable CORS**

### Step 15: Deploy API

1. Click **Actions** → **Deploy API**
2. Deployment stage: **New Stage**
3. Stage name: `prod`
4. Click **Deploy**

You'll get an **Invoke URL** like:
```
https://abc123xyz.execute-api.us-east-1.amazonaws.com/prod
```

---

## PART 6: Test Your API

### Step 16: Test Endpoints

**Get all cars:**
```bash
curl https://YOUR_API_ID.execute-api.us-east-1.amazonaws.com/prod/api/cars
```

**Get specific car:**
```bash
curl https://YOUR_API_ID.execute-api.us-east-1.amazonaws.com/prod/api/cars/ABC123
```

**Search cars:**
```bash
curl "https://YOUR_API_ID.execute-api.us-east-1.amazonaws.com/prod/api/cars/search?query=Toyota"
```

**Create car (POST):**
```bash
curl -X POST https://YOUR_API_ID.execute-api.us-east-1.amazonaws.com/prod/api/cars \
  -H "Content-Type: application/json" \
  -d '{
    "plate": "XYZ789",
    "make": "Honda",
    "model": "Civic",
    "year": 2021,
    "color": "Red",
    "owner": "Jane Smith"
  }'
```

---

## PART 7: Update Frontend

### Step 17: Configure Frontend to Use Lambda API

Update your frontend code:

```javascript
// In your frontend configuration
const API_BASE_URL = 'https://YOUR_API_ID.execute-api.us-east-1.amazonaws.com/prod';

// Get all cars
fetch(`${API_BASE_URL}/api/cars`)
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      console.log('Cars:', data.data);
    }
  })
  .catch(err => console.error(err));

// Search cars
fetch(`${API_BASE_URL}/api/cars/search?query=ABC`)
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      console.log('Search results:', data.data);
    }
  });

// Get specific car
fetch(`${API_BASE_URL}/api/cars/ABC123`)
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      console.log('Car:', data.data);
    }
  });

// Create car
fetch(`${API_BASE_URL}/api/cars`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    plate: 'NEW123',
    make: 'Tesla',
    model: 'Model 3',
    year: 2023,
    color: 'White',
    owner: 'Bob Johnson'
  })
})
  .then(res => res.json())
  .then(data => console.log('Created:', data));
```

---

## PART 8: Update Lambda Code

When you need to update your Lambda code:

```bash
# Update code file
nano getCars.js

# Rebuild
./build.sh

# Update Lambda function
aws lambda update-function-code \
    --function-name getCars \
    --zip-file fileb://dist/getCars.zip \
    --region us-east-1
```

---

## 🔧 Troubleshooting

### Lambda Function Errors

**View logs:**
```bash
aws logs tail /aws/lambda/getCars --follow
```

**Common issues:**

1. **DynamoDB access denied**
   - Check IAM role has DynamoDB permissions
   - Verify table name is correct

2. **CORS errors**
   - Enable CORS in API Gateway for all methods
   - Check headers in Lambda response

3. **Function timeout**
   - Increase timeout: `--timeout 30`
   - Check DynamoDB performance

### API Gateway Issues

1. **404 Not Found**
   - Verify API is deployed
   - Check resource paths are correct

2. **500 Internal Server Error**
   - Check Lambda function logs
   - Verify Lambda integration is configured

---

## 💰 Cost Estimation

**Free Tier (First 12 months):**
- Lambda: 1M requests/month free
- DynamoDB: 25 GB storage + 25 WCU + 25 RCU free
- API Gateway: 1M API calls/month free

**After Free Tier:**
- Lambda: $0.20 per 1M requests
- DynamoDB: $0.25 per GB/month
- API Gateway: $3.50 per million requests

**Example:** 100,000 requests/month = **~$0.50/month** (very cheap!)

---

## 🚀 Advanced: Using Serverless Framework

For easier deployment, use Serverless Framework:

### Install Serverless

```bash
npm install -g serverless
```

### Create serverless.yml

```yaml
service: cars-api

provider:
  name: aws
  runtime: nodejs18.x
  region: us-east-1
  iam:
    role:
      statements:
        - Effect: Allow
          Action:
            - dynamodb:*
          Resource: !GetAtt CarsTable.Arn

functions:
  getCars:
    handler: getCars.handler
    events:
      - http:
          path: api/cars
          method: get
          cors: true
  
  getCar:
    handler: getCar.handler
    events:
      - http:
          path: api/cars/{plate}
          method: get
          cors: true
  
  searchCars:
    handler: searchCars.handler
    events:
      - http:
          path: api/cars/search
          method: get
          cors: true
  
  createCar:
    handler: createCar.handler
    events:
      - http:
          path: api/cars
          method: post
          cors: true

resources:
  Resources:
    CarsTable:
      Type: AWS::DynamoDB::Table
      Properties:
        TableName: Cars
        BillingMode: PAY_PER_REQUEST
        AttributeDefinitions:
          - AttributeName: plate
            AttributeType: S
        KeySchema:
          - AttributeName: plate
            KeyType: HASH
```

### Deploy with One Command

```bash
serverless deploy
```

That's it! Everything is created automatically!

---

## 📊 Comparison: Lambda vs EC2

| Feature | Lambda + DynamoDB | EC2 + MongoDB |
|---------|------------------|---------------|
| **Setup Time** | 30 minutes | 2-3 hours |
| **Cost (low traffic)** | $0-5/month | $10-20/month |
| **Scaling** | Automatic | Manual |
| **Maintenance** | None | Updates, security patches |
| **Availability** | 99.99% | Manual setup needed |
| **Cold Start** | Yes (~1s first request) | No |
| **Best For** | Variable/low traffic | Constant traffic |

---

## ✅ Deployment Checklist

- [ ] DynamoDB table created
- [ ] Sample data inserted
- [ ] Lambda functions created and tested
- [ ] IAM role configured with permissions
- [ ] API Gateway created
- [ ] API routes configured
- [ ] CORS enabled
- [ ] API deployed to stage
- [ ] Frontend updated with API URL
- [ ] All endpoints tested

---

## 🎓 Next Steps

1. ✅ **Custom Domain**: Add custom domain to API Gateway
2. ✅ **Authentication**: Add API keys or Cognito
3. ✅ **Monitoring**: Set up CloudWatch alarms
4. ✅ **Logging**: Configure structured logging
5. ✅ **CI/CD**: Automate deployments with GitHub Actions

---

**Your Serverless API is now live!** 🚀

No servers to manage, automatic scaling, and pay only for what you use!

API URL: `https://YOUR_API_ID.execute-api.us-east-1.amazonaws.com/prod`

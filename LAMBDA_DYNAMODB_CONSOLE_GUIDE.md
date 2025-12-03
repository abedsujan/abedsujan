# AWS Lambda + DynamoDB Deployment Guide (AWS Console)

**Project**: Serverless Backend API  
**Stack**: AWS Lambda + DynamoDB + API Gateway  
**Method**: AWS Console (No CLI needed!)

---

## 🎯 Why Serverless with Lambda + DynamoDB?

**Advantages over EC2 + MongoDB:**
- ✅ **No server management** - AWS handles everything
- ✅ **Pay per use** - Only pay when your API is called
- ✅ **Auto-scaling** - Handles traffic spikes automatically
- ✅ **High availability** - Built-in redundancy
- ✅ **Free tier** - 1M Lambda requests/month + 25GB DynamoDB free

**Cost Example:**
- 100,000 requests/month = ~$0.50/month
- 1 million requests/month = ~$4.20/month

---

## 📋 Prerequisites

- AWS Account ([Sign up here](https://aws.amazon.com/))
- Node.js installed on your computer (for creating function code)
- Your frontend already deployed (Vercel, Netlify, etc.)

---

## Architecture Overview

```
Client Browser → API Gateway → Lambda Functions → DynamoDB
```

**Your API Endpoints:**
- GET  `/api/cars` - Get all cars
- GET  `/api/cars/search?query=ABC` - Search cars
- GET  `/api/cars/{plate}` - Get specific car
- POST `/api/cars` - Create new car

---

## PART 1: Create DynamoDB Table

### Step 1: Go to DynamoDB Console

1. Login to [AWS Console](https://console.aws.amazon.com/)
2. Search for **"DynamoDB"** in the search bar
3. Click on **DynamoDB** service

### Step 2: Create Table

1. Click **"Create table"** button (orange button)
2. Fill in table settings:
   - **Table name**: `Cars`
   - **Partition key**: `plate` (keep type as String)
3. **Table settings**: Keep default "Customize settings" selected
4. **Table class**: DynamoDB Standard
5. **Capacity mode**: Select **"On-demand"** (pay per request)
6. Leave other settings as default
7. Click **"Create table"** at the bottom

Wait 1-2 minutes for table to become **Active**.

### Step 3: Add Sample Data

1. Click on your **Cars** table
2. Click **"Explore table items"** button
3. Click **"Create item"**
4. Click **"Add new attribute"** dropdown and select **String** for each field
5. Add these attributes:
   - `plate` (already there): `ABC123`
   - Add new attribute → String: `make` = `Toyota`
   - Add new attribute → String: `model` = `Camry`
   - Add new attribute → Number: `year` = `2020`
   - Add new attribute → String: `color` = `Blue`
   - Add new attribute → String: `owner` = `John Doe`
6. Click **"Create item"**

Repeat to add more sample cars if needed.

---

## PART 2: Create Lambda Functions

### Step 4: Prepare Function Code Locally

Create a folder on your computer:

```bash
mkdir lambda-functions
cd lambda-functions
```

Create 4 files with the following code:

**File 1: `getCars.js`** (Get all cars)

```javascript
const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    console.log('Event:', JSON.stringify(event, null, 2));
    
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
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
                data: result.Items,
                count: result.Count
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

**File 2: `getCar.js`** (Get specific car)

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

**File 3: `searchCars.js`** (Search cars)

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
        
        const params = {
            TableName: 'Cars'
        };
        
        const result = await dynamodb.scan(params).promise();
        
        // Filter results
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
                data: filteredItems,
                count: filteredItems.length
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

**File 4: `createCar.js`** (Create new car)

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

### Step 5: Create ZIP Files

For each function file, create a ZIP file:

**On Mac/Linux:**
```bash
zip getCars.zip getCars.js
zip getCar.zip getCar.js
zip searchCars.zip searchCars.js
zip createCar.zip createCar.js
```

**On Windows:**
- Right-click on `getCars.js` → Send to → Compressed (zipped) folder → Rename to `getCars.zip`
- Repeat for other files

### Step 6: Create IAM Role for Lambda

1. Go to **IAM** console (search "IAM" in AWS Console)
2. Click **"Roles"** in left sidebar
3. Click **"Create role"**
4. Select **"AWS service"**
5. Use case: Select **"Lambda"**
6. Click **"Next"**
7. Search and select these policies:
   - `AWSLambdaBasicExecutionRole`
   - `AmazonDynamoDBFullAccess`
8. Click **"Next"**
9. Role name: `lambda-dynamodb-role`
10. Click **"Create role"**

### Step 7: Create Lambda Functions

We'll create 4 Lambda functions. Repeat these steps for each function:

#### Create getCars Function:

1. Go to **Lambda** console (search "Lambda")
2. Click **"Create function"**
3. Select **"Author from scratch"**
4. Function settings:
   - **Function name**: `getCars`
   - **Runtime**: Node.js 18.x
   - **Architecture**: x86_64
5. **Permissions**: Expand "Change default execution role"
   - Select **"Use an existing role"**
   - Choose: `lambda-dynamodb-role`
6. Click **"Create function"**
7. In the Code tab, click **"Upload from"** → **".zip file"**
8. Click **"Upload"** and select `getCars.zip`
9. Click **"Save"**
10. Click **"Deploy"** button

#### Create getCar Function:

Repeat above steps with:
- Function name: `getCar`
- Upload: `getCar.zip`

#### Create searchCars Function:

Repeat above steps with:
- Function name: `searchCars`
- Upload: `searchCars.zip`

#### Create createCar Function:

Repeat above steps with:
- Function name: `createCar`
- Upload: `createCar.zip`

### Step 8: Test Lambda Functions

1. Go to your **getCars** function
2. Click **"Test"** tab
3. **Event name**: `testEvent`
4. **Event JSON**: `{}`
5. Click **"Save"**
6. Click **"Test"** button
7. Check the response - should see your cars data!

---

## PART 3: Create API Gateway

### Step 9: Create REST API

1. Go to **API Gateway** console (search "API Gateway")
2. Click **"Create API"**
3. Choose **"REST API"** (not Private or HTTP API)
4. Click **"Build"**
5. Configure:
   - **Choose the protocol**: REST
   - **Create new API**: New API
   - **API name**: `Cars API`
   - **Description**: `API for car numberplate search`
   - **Endpoint Type**: Regional
6. Click **"Create API"**

### Step 10: Create Resources and Methods

#### Create /api resource:

1. Click **"Actions"** dropdown → **"Create Resource"**
2. **Resource Name**: `api`
3. **Resource Path**: `api`
4. Check **"Enable API Gateway CORS"**
5. Click **"Create Resource"**

#### Create /api/cars resource:

1. Select the `/api` resource
2. Click **"Actions"** → **"Create Resource"**
3. **Resource Name**: `cars`
4. **Resource Path**: `cars`
5. Check **"Enable API Gateway CORS"**
6. Click **"Create Resource"**

#### Create GET method for /api/cars (Get all cars):

1. Select `/api/cars` resource
2. Click **"Actions"** → **"Create Method"**
3. Select **"GET"** from dropdown, click checkmark
4. Setup:
   - **Integration type**: Lambda Function
   - **Use Lambda Proxy integration**: ✓ Checked
   - **Lambda Function**: `getCars`
   - **Use Default Timeout**: ✓ Checked
5. Click **"Save"**
6. Click **"OK"** on the permission popup

#### Create POST method for /api/cars (Create car):

1. Select `/api/cars` resource
2. Click **"Actions"** → **"Create Method"**
3. Select **"POST"**, click checkmark
4. **Lambda Function**: `createCar`
5. Check **"Use Lambda Proxy integration"**
6. Click **"Save"**, then **"OK"**

#### Create /api/cars/search resource:

1. Select `/api/cars` resource
2. Click **"Actions"** → **"Create Resource"**
3. **Resource Name**: `search`
4. **Resource Path**: `search`
5. Check **"Enable API Gateway CORS"**
6. Click **"Create Resource"**

#### Create GET method for /api/cars/search:

1. Select `/api/cars/search` resource
2. Click **"Actions"** → **"Create Method"**
3. Select **"GET"**, click checkmark
4. **Lambda Function**: `searchCars`
5. Check **"Use Lambda Proxy integration"**
6. Click **"Save"**, then **"OK"**

#### Create /api/cars/{plate} resource:

1. Select `/api/cars` resource
2. Click **"Actions"** → **"Create Resource"**
3. **Resource Name**: `plate`
4. **Resource Path**: `{plate}` (with curly braces!)
5. Check **"Enable API Gateway CORS"**
6. Click **"Create Resource"**

#### Create GET method for /api/cars/{plate}:

1. Select `/api/cars/{plate}` resource
2. Click **"Actions"** → **"Create Method"**
3. Select **"GET"**, click checkmark
4. **Lambda Function**: `getCar`
5. Check **"Use Lambda Proxy integration"**
6. Click **"Save"**, then **"OK"**

### Step 11: Enable CORS (For all methods)

For EACH resource (`/api/cars`, `/api/cars/search`, `/api/cars/{plate}`):

1. Select the resource
2. Click **"Actions"** → **"Enable CORS"**
3. Keep defaults
4. Click **"Enable CORS and replace existing CORS headers"**
5. Click **"Yes, replace existing values"**

### Step 12: Deploy API

1. Click **"Actions"** → **"Deploy API"**
2. **Deployment stage**: [New Stage]
3. **Stage name**: `prod`
4. **Stage description**: `Production`
5. Click **"Deploy"**

**Copy your Invoke URL!** It looks like:
```
https://abc123xyz.execute-api.us-east-1.amazonaws.com/prod
```

---

## PART 4: Test Your API

### Step 13: Test in Browser

**Test getCars (Get all cars):**
```
https://YOUR_API_ID.execute-api.REGION.amazonaws.com/prod/api/cars
```

Open this in your browser - you should see JSON with your cars!

**Test getCar (Get specific car):**
```
https://YOUR_API_ID.execute-api.REGION.amazonaws.com/prod/api/cars/ABC123
```

**Test searchCars:**
```
https://YOUR_API_ID.execute-api.REGION.amazonaws.com/prod/api/cars/search?query=Toyota
```

### Step 14: Test with Postman or curl

**Create a car (POST):**

Using Postman:
- Method: POST
- URL: `https://YOUR_API_ID.execute-api.REGION.amazonaws.com/prod/api/cars`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "plate": "XYZ789",
  "make": "Honda",
  "model": "Civic",
  "year": 2021,
  "color": "Red",
  "owner": "Jane Smith"
}
```

---

## PART 5: Connect to Frontend

### Step 15: Update Frontend Code

In your frontend application:

```javascript
// API configuration
const API_BASE_URL = 'https://YOUR_API_ID.execute-api.REGION.amazonaws.com/prod';

// Get all cars
async function getAllCars() {
    const response = await fetch(`${API_BASE_URL}/api/cars`);
    const data = await response.json();
    
    if (data.success) {
        console.log('Cars:', data.data);
        return data.data;
    }
}

// Search cars
async function searchCars(query) {
    const response = await fetch(`${API_BASE_URL}/api/cars/search?query=${query}`);
    const data = await response.json();
    
    if (data.success) {
        console.log('Search results:', data.data);
        return data.data;
    }
}

// Get specific car
async function getCar(plate) {
    const response = await fetch(`${API_BASE_URL}/api/cars/${plate}`);
    const data = await response.json();
    
    if (data.success) {
        console.log('Car:', data.data);
        return data.data;
    }
}

// Create new car
async function createCar(carData) {
    const response = await fetch(`${API_BASE_URL}/api/cars`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(carData)
    });
    
    const data = await response.json();
    
    if (data.success) {
        console.log('Created:', data.data);
        return data.data;
    }
}

// Example usage:
getAllCars();
searchCars('Toyota');
getCar('ABC123');
createCar({
    plate: 'NEW123',
    make: 'Tesla',
    model: 'Model 3',
    year: 2023,
    color: 'White',
    owner: 'Bob Johnson'
});
```

---

## PART 6: Update Lambda Code (When Needed)

When you need to modify your Lambda functions:

1. Edit the `.js` file locally
2. Create new ZIP file
3. Go to Lambda Console
4. Select your function
5. Click **"Upload from"** → **".zip file"**
6. Upload new ZIP
7. Click **"Deploy"**

No need to change API Gateway!

---

## 🔧 Troubleshooting

### Issue: CORS errors in frontend

**Solution:**
1. Go to API Gateway
2. Select each resource
3. Click **Actions** → **Enable CORS**
4. Click **Enable CORS and replace**
5. Click **Actions** → **Deploy API**
6. Select **prod** stage

### Issue: Lambda function timeout

**Solution:**
1. Go to Lambda function
2. Click **Configuration** tab
3. Click **General configuration** → **Edit**
4. Increase **Timeout** to 30 seconds
5. Click **Save**

### Issue: DynamoDB permission denied

**Solution:**
1. Go to IAM → Roles
2. Select `lambda-dynamodb-role`
3. Ensure `AmazonDynamoDBFullAccess` policy is attached
4. If not, click **Add permissions** → **Attach policies**

### Issue: Can't see function logs

**Solution:**
1. Go to Lambda function
2. Click **Monitor** tab
3. Click **View CloudWatch logs**
4. Check recent log streams

---

## 💰 Cost Breakdown

**Free Tier (First 12 months):**
- Lambda: 1M requests/month FREE
- DynamoDB: 25 GB storage FREE
- API Gateway: 1M calls/month FREE

**After Free Tier:**
- Lambda: $0.20 per 1M requests
- DynamoDB: $0.25 per GB/month (on-demand)
- API Gateway: $3.50 per million requests

**Example Costs:**
- 100,000 requests/month = **$0.50**
- 500,000 requests/month = **$2.00**
- 1,000,000 requests/month = **$4.20**

---

## ✅ Deployment Checklist

- [ ] DynamoDB table created with sample data
- [ ] IAM role created with DynamoDB permissions
- [ ] All 4 Lambda functions created and tested
- [ ] API Gateway REST API created
- [ ] Resources created: /api, /api/cars, /api/cars/search, /api/cars/{plate}
- [ ] Methods created and linked to Lambda functions
- [ ] CORS enabled for all resources
- [ ] API deployed to prod stage
- [ ] API URL tested in browser
- [ ] Frontend updated with API URL

---

## 🎓 Summary

You now have a fully serverless backend with:

✅ **DynamoDB** storing your data  
✅ **Lambda functions** handling requests  
✅ **API Gateway** exposing endpoints  
✅ **CORS** enabled for frontend  
✅ **Auto-scaling** built-in  
✅ **Pay-per-use** pricing  

**Your API URL:**
```
https://YOUR_API_ID.execute-api.REGION.amazonaws.com/prod
```

**Endpoints:**
- GET `/api/cars` - Get all cars
- GET `/api/cars/search?query=ABC` - Search
- GET `/api/cars/{plate}` - Get specific car
- POST `/api/cars` - Create new car

**No servers to manage, automatic scaling, and you only pay when your API is used!** 🚀

---

## 📚 Next Steps

1. **Custom Domain**: Add custom domain in API Gateway
2. **Authentication**: Add API keys or AWS Cognito
3. **Monitoring**: Set up CloudWatch alarms
4. **Backup**: Enable point-in-time recovery for DynamoDB
5. **Caching**: Enable API Gateway caching for better performance

For help, check [AWS Lambda Documentation](https://docs.aws.amazon.com/lambda/) or [API Gateway Documentation](https://docs.aws.amazon.com/apigateway/).

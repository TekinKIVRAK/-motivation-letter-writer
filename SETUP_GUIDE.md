# Setup Guide - Motivation Letter Writer AI

Complete step-by-step guide to set up the Motivation Letter Writer application on your local machine.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Getting an Anthropic API Key](#getting-an-anthropic-api-key)
- [Installation Steps](#installation-steps)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Troubleshooting](#troubleshooting)
- [Development Tips](#development-tips)

## Prerequisites

### Required Software

1. **Node.js** (version 18.0.0 or higher)
   - Download from: https://nodejs.org/
   - Verify installation:
     ```bash
     node --version  # Should show v18.0.0 or higher
     npm --version   # Should show 9.0.0 or higher
     ```

2. **Git** (optional, for cloning repository)
   - Download from: https://git-scm.com/
   - Verify installation:
     ```bash
     git --version
     ```

3. **Text Editor/IDE**
   - Recommended: VS Code, WebStorm, or Sublime Text

### System Requirements
- **OS**: Windows 10/11, macOS 10.15+, or Linux
- **RAM**: Minimum 4GB (8GB recommended)
- **Disk Space**: At least 500MB free space
- **Internet Connection**: Required for API calls and package installation

## Getting an Anthropic API Key

### Step 1: Create an Anthropic Account

1. Visit https://console.anthropic.com/
2. Click "Sign Up" or "Get Started"
3. Complete the registration process
4. Verify your email address

### Step 2: Get Your API Key

1. Log in to the Anthropic Console
2. Navigate to "API Keys" section
3. Click "Create Key" or "New API Key"
4. Give your key a descriptive name (e.g., "Motivation Letter App - Dev")
5. **Copy the API key immediately** - you won't be able to see it again!
6. Store it securely (you'll need it for the .env file)

### Step 3: Add Credits (if needed)

1. Some accounts may need to add credits
2. Go to "Billing" or "Credits" section
3. Add payment method if required
4. Purchase credits or start with free tier

**Important**:
- Keep your API key secret and never commit it to version control
- The key starts with `sk-ant-`
- Each request costs credits, so monitor your usage

## Installation Steps

### Step 1: Get the Project Files

**Option A: Clone from Git**
```bash
git clone <repository-url>
cd motivation-letter-writer
```

**Option B: Download ZIP**
1. Download the project ZIP file
2. Extract to your desired location
3. Open terminal/command prompt in that directory

### Step 2: Install Backend Dependencies

```bash
# Navigate to backend directory
cd backend

# Install all dependencies
npm install

# Wait for installation to complete
# You should see a success message
```

**Expected output:**
```
added 150+ packages in 30s
```

**Common packages installed:**
- express: Web framework
- @anthropic-ai/sdk: Claude AI integration
- multer: File upload handling
- pdf-parse-fork: PDF parsing
- mammoth: Word document parsing
- cors: Cross-origin resource sharing
- dotenv: Environment variables

### Step 3: Install Frontend Dependencies

```bash
# Navigate to frontend directory (from project root)
cd ../frontend

# Install all dependencies
npm install

# Wait for installation to complete
```

**Expected output:**
```
added 200+ packages in 45s
```

**Common packages installed:**
- react: UI framework
- vite: Build tool
- tailwind-css: Styling framework
- axios: HTTP client

## Configuration

### Step 1: Create Backend Environment File

```bash
# In backend directory
cd backend

# Create .env file (copy from example or create new)
```

**Create a file named `.env` with the following content:**

```env
# Anthropic API Configuration
ANTHROPIC_API_KEY=sk-ant-your-api-key-here

# Server Configuration
PORT=3001
NODE_ENV=development

# File Upload Configuration
MAX_FILE_SIZE=10485760

# CORS Configuration
CORS_ORIGIN=http://localhost:5173,http://localhost:5174
```

**Important**:
- Replace `sk-ant-your-api-key-here` with your actual Anthropic API key
- Don't add quotes around the values
- Don't commit this file to version control
- Keep the file in the `backend` directory

### Step 2: Verify Configuration

Create a `.env.example` file for reference (optional):

```env
ANTHROPIC_API_KEY=sk-ant-your-key-here
PORT=3001
MAX_FILE_SIZE=10485760
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
```

### Step 3: Create Uploads Directory

```bash
# In backend directory
mkdir uploads

# Or it will be created automatically on first run
```

## Running the Application

### Option 1: Run Both Servers (Recommended)

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Expected output:**
```
✅ ANTHROPIC_API_KEY loaded successfully

✉️  Motivation Letter Writer API running on port 3001
📍 Health check: http://localhost:3001/api/health
🔧 Environment: development
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

**Expected output:**
```
VITE v5.4.20  ready in 1318 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### Option 2: Development Mode (with auto-reload)

**Backend with auto-reload:**
```bash
cd backend
npm run dev
```

**Frontend (Vite has auto-reload by default):**
```bash
cd frontend
npm run dev
```

### Step 4: Access the Application

1. **Open your browser**
2. **Go to**: http://localhost:5173 (or the port shown in terminal)
3. **Test health check**: http://localhost:3001/api/health
4. **You should see the application interface**

## Troubleshooting

### Issue: "ANTHROPIC_API_KEY is not set"

**Solution:**
1. Check if `.env` file exists in `backend` directory
2. Verify the API key is correctly set
3. Make sure there are no quotes around the key
4. Restart the backend server

### Issue: "Port 3001 already in use"

**Solution:**
1. Change PORT in `.env` to a different number (e.g., 3002)
2. Update `frontend/vite.config.js` to match the new port
3. Restart both servers

### Issue: "Cannot find module"

**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

### Issue: "File upload not working"

**Solution:**
1. Check if `uploads` directory exists
2. Verify file permissions
3. Check MAX_FILE_SIZE in .env
4. Ensure file is PDF or DOC/DOCX format

### Issue: "CORS errors in browser console"

**Solution:**
1. Check CORS_ORIGIN in backend `.env`
2. Make sure it matches your frontend URL
3. Restart backend server after changes

### Issue: "AI generation fails"

**Solution:**
1. Verify API key is correct
2. Check Anthropic account has credits
3. Check internet connection
4. Look at backend console for detailed error messages

### Issue: "Frontend shows blank page"

**Solution:**
1. Check browser console for errors (F12)
2. Verify backend is running
3. Check if backend URL is correct in frontend
4. Clear browser cache and reload

## Development Tips

### 1. Hot Reload Setup

Both frontend and backend support hot reload in development mode:
- Frontend: Changes automatically refresh the browser
- Backend: Use `npm run dev` for auto-restart on file changes

### 2. Debugging

**Backend debugging:**
```bash
# Add console.logs to your code
console.log('Debug info:', variable);

# Check terminal for output
```

**Frontend debugging:**
```bash
# Use browser DevTools (F12)
# Add console.logs in components
console.log('Component state:', state);
```

### 3. Environment Switching

**Development:**
```env
NODE_ENV=development
```

**Production:**
```env
NODE_ENV=production
```

### 4. Code Quality

**Install ESLint (optional):**
```bash
npm install -D eslint
npx eslint --init
```

**Install Prettier (optional):**
```bash
npm install -D prettier
```

### 5. Testing Endpoints

Use tools like:
- **Postman**: For testing API endpoints
- **curl**: Command-line testing
- **Thunder Client**: VS Code extension

**Example curl command:**
```bash
curl http://localhost:3001/api/health
```

### 6. Monitoring Logs

**Backend logs:**
- All requests are logged to console
- Check for errors in red
- Success messages in green

**Frontend logs:**
- Open browser DevTools (F12)
- Check Console tab for errors
- Network tab for API calls

### 7. File Structure Best Practices

```
Keep your code organized:
- Components in components/
- Services in services/
- Utils in utils/
- Routes in routes/
```

### 8. Version Control

**Create .gitignore:**
```gitignore
# Dependencies
node_modules/

# Environment
.env
.env.local

# Build
dist/
build/

# Uploads
uploads/*
!uploads/.gitkeep

# OS
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
```

### 9. Useful Commands

```bash
# Check for outdated packages
npm outdated

# Update packages
npm update

# Clean install
rm -rf node_modules package-lock.json
npm install

# Build frontend for production
cd frontend
npm run build
```

### 10. Performance Tips

- Monitor API token usage
- Implement caching for repeated requests
- Optimize file upload sizes
- Use production build for deployment

## Next Steps

After successful setup:

1. ✅ Test the application with a sample resume
2. ✅ Generate a motivation letter
3. ✅ Read the [DEPLOYMENT.md](DEPLOYMENT.md) for production setup
4. ✅ Check [CLAUDE.md](CLAUDE.md) for AI integration details
5. ✅ Explore the codebase and customize as needed

## Getting Help

If you encounter issues:

1. Check the [Troubleshooting](#troubleshooting) section
2. Review console logs for errors
3. Verify all prerequisites are installed
4. Check GitHub issues for similar problems
5. Create a new issue with detailed information

## Resources

- [Node.js Documentation](https://nodejs.org/docs/)
- [React Documentation](https://react.dev/)
- [Anthropic API Docs](https://docs.anthropic.com/)
- [Vite Documentation](https://vitejs.dev/)
- [Express Documentation](https://expressjs.com/)

---

**Setup complete!** 🎉 You're ready to start using the Motivation Letter Writer AI.

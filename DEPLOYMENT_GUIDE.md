# 🚀 Complete Vercel Deployment Guide
## USF Business Analytics Course Planner

This guide will walk you through deploying your React prerequisite planner to Vercel in under 10 minutes.

## 📋 Prerequisites

- Node.js 18+ installed on your computer
- A GitHub account (recommended) or Vercel account
- The project files ready to deploy

## 🎯 Method 1: GitHub + Vercel (Recommended)

### Step 1: Create GitHub Repository

1. **Go to GitHub.com** and sign in
2. **Click "New Repository"** (green button)
3. **Repository settings:**
   - Name: `usf-buan-prerequisite-planner`
   - Description: `Interactive course planner for USF Business Analytics students`
   - Public ✅ (or Private if you prefer)
   - Add README ❌ (we have our own)
4. **Click "Create Repository"**

### Step 2: Upload Project Files

**Option A: GitHub Web Interface (Easiest)**
1. **Click "uploading an existing file"** on the GitHub page
2. **Drag and drop ALL project files** from your computer:
   ```
   ✅ package.json
   ✅ next.config.js  
   ✅ vercel.json
   ✅ README.md
   ✅ pages/ folder (with index.js and _app.js)
   ✅ components/ folder (with PrereqPlanner.jsx)
   ```
3. **Commit message**: "Initial commit - USF BUAN Planner"
4. **Click "Commit changes"**

**Option B: Git Command Line**
```bash
# Navigate to your project folder
cd /path/to/your/project/files

# Initialize git repository
git init

# Add all files
git add .

# Commit files
git commit -m "Initial commit - USF BUAN Planner"

# Connect to GitHub (replace with your repo URL)
git remote add origin https://github.com/YOUR_USERNAME/usf-buan-prerequisite-planner.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 3: Deploy to Vercel

1. **Go to [vercel.com](https://vercel.com)**
2. **Sign up/Login** (use GitHub account for easier integration)
3. **Click "New Project"**
4. **Import Git Repository:**
   - Find your `usf-buan-prerequisite-planner` repo
   - Click "Import"
5. **Configure Project:**
   - **Project Name**: `usf-buan-planner` (or keep default)
   - **Framework**: Next.js ✅ (auto-detected)
   - **Root Directory**: `./` ✅
   - **Build Command**: `npm run build` ✅
   - **Install Command**: `npm install` ✅
6. **Click "Deploy"** 🚀

### Step 4: Verify Deployment

- ⏳ **Wait 2-3 minutes** for build to complete
- ✅ **Success!** You'll see: "Your project has been successfully deployed"
- 🔗 **Your live URL**: `https://usf-buan-planner-xyz.vercel.app`

---

## ⚡ Method 2: Direct Vercel CLI (Alternative)

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Prepare Project Directory
```bash
# Create project folder
mkdir usf-buan-planner
cd usf-buan-planner

# Copy all your project files here
# Make sure you have:
# - package.json
# - next.config.js
# - vercel.json  
# - pages/index.js
# - pages/_app.js
# - components/PrereqPlanner.jsx
```

### Step 3: Deploy
```bash
# Login to Vercel
vercel login

# Deploy project
vercel

# Follow prompts:
# Set up and deploy? Y
# Which scope? (select your account)  
# Link to existing project? N
# Project name: usf-buan-planner
# In which directory? ./
# Auto-detect settings? Y
```

### Step 4: Production Deployment
```bash
# Deploy to production
vercel --prod
```

---

## 🔧 Verification Checklist

After deployment, test these features:

### ✅ Basic Functionality
- [ ] Page loads without errors
- [ ] Course map displays correctly
- [ ] Major/Minor toggle works
- [ ] Course completion checkboxes work
- [ ] Prerequisite validation works
- [ ] Warning messages appear/disappear

### ✅ Interactive Features  
- [ ] Click courses to select/deselect
- [ ] Course details panel opens
- [ ] Planning controls update course availability
- [ ] Progress bars update with completions

### ✅ PNG Export
- [ ] Save Image button appears
- [ ] PNG download works
- [ ] Image captures full planner
- [ ] Filename includes timestamp

### ✅ Responsive Design
- [ ] Mobile layout works
- [ ] Course map scrolls horizontally on small screens
- [ ] Touch interactions work on mobile

---

## 🛠️ Troubleshooting

### Common Deployment Issues

**❌ "Build failed - Module not found: html2canvas"**
```bash
# Fix: Ensure package.json includes html2canvas
{
  "dependencies": {
    "html2canvas": "^1.4.1"
  }
}
```

**❌ "TypeError: Cannot read properties of undefined"**
- Check that all files were uploaded correctly
- Verify `components/PrereqPlanner.jsx` exists
- Ensure proper import/export syntax

**❌ "404 - This page could not be found"**
- Verify `pages/index.js` exists
- Check that files are in correct directory structure
- Ensure Next.js configuration is correct

**❌ "PNG Export not working"**
- Check browser console for html2canvas errors
- Verify `.planner-container` class exists in component
- Test on different browsers (Chrome recommended)

### Build Errors

**Fix dependency issues:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Update Next.js if needed:**
```bash
npm install next@14 react@18 react-dom@18
```

---

## ⚙️ Custom Domain (Optional)

### Add Custom Domain to Vercel

1. **Go to Vercel Dashboard**
2. **Select your project**
3. **Go to Settings → Domains**
4. **Add Domain**: `buan-planner.yourdomain.com`
5. **Configure DNS** with your domain provider:
   ```
   Type: CNAME
   Name: buan-planner
   Value: cname.vercel-dns.com
   ```

### USF Subdomain (If Available)
Contact USF IT to request:
- `buan-planner.usfca.edu` subdomain
- Point CNAME to your Vercel deployment

---

## 📈 Post-Deployment Enhancements

### Analytics Integration
```javascript
// Add to pages/_app.js
import { GoogleAnalytics } from 'nextjs-google-analytics';

export default function App({ Component, pageProps }) {
  return (
    <>
      <GoogleAnalytics trackPageViews />
      <Component {...pageProps} />
    </>
  );
}
```

### Performance Monitoring
1. **Vercel Analytics**: Enable in project settings
2. **Core Web Vitals**: Monitor loading performance
3. **Error Tracking**: Set up Sentry integration

### SEO Improvements
```javascript
// Add to pages/index.js
<Head>
  <title>USF Business Analytics Course Planner</title>
  <meta name="description" content="Interactive prerequisite planner for USF BUAN students" />
  <meta name="keywords" content="USF, Business Analytics, Course Planner, Prerequisites" />
</Head>
```

---

## 🎉 Success!

Your USF Business Analytics Course Planner is now live! 

**Share your deployment:**
- 🎓 **With Students**: Share the URL for academic planning
- 🏫 **With Faculty**: Demonstrate the interactive planning tool  
- 📱 **On Social**: Showcase your technical project
- 💼 **In Portfolio**: Add to your developer portfolio

**Your live URL format**: `https://usf-buan-planner-[random].vercel.app`

---

## 🔄 Making Updates

### GitHub Method (Automatic):
1. Edit files in your GitHub repository
2. Commit changes
3. Vercel automatically rebuilds and deploys ✨

### CLI Method:
```bash
# Make changes to your files
# Then redeploy
vercel --prod
```

---

## 📞 Support

**Need help?**
- 📧 Vercel Support: [vercel.com/help](https://vercel.com/help)
- 📖 Next.js Docs: [nextjs.org/docs](https://nextjs.org/docs)
- 🐛 GitHub Issues: Create issue in your repository

**Deployment successful?** 
Your interactive USF Business Analytics Course Planner is ready to help students plan their academic journey! 🎓✨

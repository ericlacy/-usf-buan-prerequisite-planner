# USF Business Analytics Course Prerequisite Planner

A comprehensive, interactive course planning tool for University of San Francisco Business Analytics students. Plan your major or minor with visual prerequisite mapping, progress tracking, and requirement validation.

🔗 **[Live Demo on Vercel](https://your-vercel-deployment.vercel.app)**

## Features

- 📊 **Interactive Prerequisite Map** - Visual course flow with prerequisite arrows
- ✅ **Progress Tracking** - Real-time unit calculations and completion percentages  
- 🎯 **Smart Validation** - Prevents completing courses without prerequisites
- 📅 **Semester Planning** - Respects course scheduling and availability
- 💾 **PNG Export** - High-quality image snapshots for sharing/printing
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- 🎨 **USF Branding** - Official university colors and styling

## Quick Start

### Option 1: Deploy to Vercel (Recommended)

1. **Fork/Clone this repository**
   ```bash
   git clone https://github.com/your-username/usf-buan-prerequisite-planner.git
   cd usf-buan-prerequisite-planner
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Deploy to Vercel**
   - Visit [vercel.com](https://vercel.com) and sign up/login
   - Click "New Project" 
   - Connect your GitHub repository
   - Vercel will auto-detect Next.js and deploy
   - Your app will be live at `https://your-project-name.vercel.app`

### Option 2: One-Click Vercel Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/usf-buan-prerequisite-planner)

### Option 3: Manual Deployment

1. **Create Vercel account** at [vercel.com](https://vercel.com)

2. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

3. **Deploy**
   ```bash
   cd usf-buan-prerequisite-planner
   vercel
   ```

4. **Follow prompts:**
   - Link to existing project? **N**
   - Project name: **usf-buan-planner** (or your choice)
   - Directory: **./** (current directory)
   - Auto-detected Next.js? **Y**

## Local Development

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Run development server**
   ```bash
   npm run dev
   ```

3. **Open in browser**
   - Visit `http://localhost:3000`
   - Hot reloading enabled for development

4. **Build for production**
   ```bash
   npm run build
   npm run start
   ```

## Project Structure

```
usf-buan-prerequisite-planner/
├── components/
│   └── PrereqPlanner.jsx          # Main planner component
├── pages/
│   ├── _app.js                    # Next.js app wrapper
│   └── index.js                   # Home page
├── public/                        # Static assets
├── package.json                   # Dependencies
├── next.config.js                 # Next.js configuration
├── vercel.json                    # Vercel deployment config
└── README.md                      # This file
```

## Configuration

### Environment Variables

Create `.env.local` for local development:

```bash
# Optional: Analytics tracking
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Optional: Custom domain
NEXT_PUBLIC_DOMAIN=your-custom-domain.com
```

### Custom Styling

Edit `/components/PrereqPlanner.jsx` to customize:
- **Colors**: Update `catColors` and `semesterColors` objects
- **Layout**: Modify `NODE_W`, `NODE_H`, `COL_GAP`, `ROW_GAP`
- **Content**: Update `courses` array with new course data

## Features in Detail

### 🎯 Course Planning
- **Major/Minor Toggle**: Switch between 52-unit major and 20-unit minor
- **Prerequisite Validation**: Prevents impossible course sequences
- **Semester Restrictions**: Respects Fall/Spring course availability
- **Class Standing**: Restricts electives until Junior year

### 📊 Progress Tracking
- **Visual Progress Bars**: Real-time completion percentages
- **Unit Calculations**: Accurate credit hour tracking
- **Category Breakdown**: Separate tracking for core/electives/requirements
- **Completion Status**: Clear visual indicators for course states

### 💾 Image Export
- **High Quality PNG**: 2x resolution for crisp output
- **Smart Cropping**: Excludes UI buttons from capture
- **Descriptive Filenames**: Includes timestamp and program type
- **Professional Format**: Clean white background for printing

### 📱 Responsive Design
- **Mobile Optimized**: Touch-friendly interface
- **Horizontal Scrolling**: Course map scrolls on small screens
- **Collapsible Controls**: Planning panel can be hidden
- **Print Friendly**: Optimized styles for printing

## Technical Details

### Built With
- **Next.js 14** - React framework with SSR/SSG
- **React 18** - Component-based UI library  
- **html2canvas** - PNG image generation
- **Vercel** - Hosting and deployment platform

### Performance
- **Static Generation** - Pre-built HTML for fast loading
- **Code Splitting** - Lazy loading for optimal performance
- **Image Optimization** - Automatic image compression
- **CDN Delivery** - Global content delivery via Vercel Edge Network

### SEO & Accessibility
- **Meta Tags** - Complete Open Graph and Twitter cards
- **Semantic HTML** - Proper heading hierarchy and landmarks
- **Keyboard Navigation** - Full keyboard accessibility
- **Screen Reader Support** - ARIA labels and descriptions

## Deployment Options

### Vercel (Recommended)
- ✅ **Zero Configuration** - Auto-detects Next.js
- ✅ **Global CDN** - Fast worldwide delivery  
- ✅ **Automatic SSL** - HTTPS by default
- ✅ **Branch Previews** - Preview deployments for PRs
- ✅ **Analytics** - Built-in performance monitoring

### Alternative Platforms
- **Netlify**: `netlify deploy --prod`
- **GitHub Pages**: Requires `next export` for static generation
- **AWS Amplify**: Full-stack deployment with backend
- **Heroku**: Container or Node.js buildpack

## Customization Guide

### Adding New Courses

Edit `/components/PrereqPlanner.jsx`:

```javascript
// Add to courses array
{
  id: "BUS420",
  name: "BUS 420", 
  label: "Advanced Analytics",
  units: 4,
  cat: "elective",
  year: 5,
  col: 2,
  programs: ["major", "minor"],
  sem: "Spring",
  description: "Advanced analytical techniques..."
}

// Add prerequisites to edges array
{ from: "BUS315", to: "BUS420", type: "required" }
```

### Custom Branding

Update color scheme:

```javascript
const catColors = {
  // Change these hex values
  core: { bg: "#your-bg", border: "#your-border", ... }
}
```

### Analytics Integration

Add to `/pages/_app.js`:

```javascript
// Google Analytics
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

## Troubleshooting

### Common Issues

**"Module not found: html2canvas"**
```bash
npm install html2canvas
```

**"Build failed: Next.js requirements"**
```bash
npm install next@14 react@18 react-dom@18
```

**"Vercel deployment timeout"**
- Check `vercel.json` configuration
- Ensure `package.json` has correct build scripts

**"PNG export not working"**
- Verify html2canvas installation
- Check browser console for errors
- Ensure `.planner-container` class exists

### Performance Issues

**Slow initial load:**
- Enable Next.js static generation
- Optimize image sizes in `/public`
- Use dynamic imports for heavy components

**Large bundle size:**
- Use `next/dynamic` for code splitting
- Remove unused dependencies
- Enable gzip compression in `next.config.js`

## Contributing

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Make changes** and test thoroughly
4. **Commit changes**: `git commit -m 'Add amazing feature'`
5. **Push to branch**: `git push origin feature/amazing-feature`  
6. **Open Pull Request** with detailed description

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- **University of San Francisco** - McLaren School of Management
- **Business Analytics Program** - Course data and requirements
- **Next.js Team** - Excellent React framework
- **Vercel** - Seamless deployment platform

## Support

- 📧 **Email**: [your-email@usfca.edu](mailto:your-email@usfca.edu)
- 🐛 **Issues**: [GitHub Issues](https://github.com/your-username/usf-buan-prerequisite-planner/issues)
- 📖 **Documentation**: [Project Wiki](https://github.com/your-username/usf-buan-prerequisite-planner/wiki)

---

**Made with ❤️ for USF Business Analytics Students**

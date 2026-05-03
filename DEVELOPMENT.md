# 🌉 The Food Bridge - Development Guide

## Getting Started

### Prerequisites
- **Node.js** v14+ ([download](https://nodejs.org))
- **npm** (comes with Node.js)
- A modern web browser

### Quick Start (3 steps)

1. **Navigate to the project directory:**
```bash
cd /Users/tanushyadav/Documents/tnn.cpp/food-bridge
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start the development server:**
```bash
npm run dev
```

The website will automatically open at **http://localhost:3000** 🎉

---

## Available Commands

### `npm run dev`
Starts the Vite development server with hot module replacement (HMR).
- **Port**: 3000
- **Auto-opens** browser
- **Hot reload** on file changes
- Press `h + enter` for help inside the terminal

```bash
npm run dev
```

### `npm run build`
Creates an optimized production build in the `dist/` folder.
- Minified CSS and JavaScript
- Optimized images and assets
- Ready for deployment

```bash
npm run build
```

### `npm run preview`
Preview the production build locally.
- Serves the `dist/` folder
- Tests the build output before deployment

```bash
npm run preview
```

### `npm install`
Installs or updates all npm dependencies.
- Run this after pulling new changes
- Required on first setup

```bash
npm install
```

---

## Project Structure

```
food-bridge/
├── index.html              # Main HTML file
├── styles.css              # Global styles (8KB)
├── script.js               # Main JavaScript (module)
├── vite.config.js          # Vite configuration
├── package.json            # Dependencies & scripts
├── README.md               # Full documentation
├── PROJECT_SUMMARY.md      # Detailed project info
├── start-dev.sh            # Quick start script
│
├── src/
│   ├── api.js              # Mock data & utilities
│   ├── ui.js               # UI helper functions
│   ├── utilities.css       # Utility CSS classes
│   └── components.css      # Component styles
│
└── dist/                   # Production build (generated)
```

---

## Development Workflow

### Making Changes

1. **Edit HTML** (`index.html`)
   - Add new sections or elements
   - Changes auto-reload in browser

2. **Update Styles** (`styles.css` or `src/*.css`)
   - Modify colors, layout, spacing
   - Hot reload updates instantly

3. **Write JavaScript** (`script.js`)
   - Add event listeners
   - Update functionality
   - Import from modules in `src/`

4. **Modify Mock Data** (`src/api.js`)
   - Update listings, FAQs, impact stats
   - Changes reflect immediately

### Testing

- Open **Chrome DevTools** (F12 / Cmd+Option+I)
- Check **Console** for errors
- Use **Network tab** for performance
- Use **Mobile View** (Ctrl+Shift+M) for responsive testing

### Responsive Design Testing

```bash
# Desktop: Full width (1366px+)
# Tablet: 760px - 1366px (iPad, etc)
# Mobile: < 760px (iPhone, Android)
```

Use browser DevTools to toggle between device sizes.

---

## Module System

### Importing Modules

```javascript
// Import mock data
import { mockListings, mockFAQ } from './src/api.js';

// Import UI utilities
import { showModal, createNotification } from './src/ui.js';
```

### Creating New Modules

1. Create a new file in `src/` folder:
```javascript
// src/myModule.js
export function myFunction() {
  // your code
}
```

2. Import in `script.js`:
```javascript
import { myFunction } from './src/myModule.js';
```

---

## Styling Guide

### Adding Styles

1. **Global styles** → `styles.css`
   - Colors, typography, layout

2. **Utility classes** → `src/utilities.css`
   - Spacing, flexbox, grids

3. **Component styles** → `src/components.css`
   - Modals, cards, badges

### Color Palette

```css
Primary Green:    #047857
Dark Navy:        #15202b
Slate Gray:       #475569
Light Blue BG:    #f7fafc
Border Gray:      #e5e7eb
Success Green:    #10b981
Error Red:        #b91c1c
```

### Responsive Breakpoints

```css
Mobile: < 760px
Tablet: 760px - 1366px
Desktop: > 1366px
```

---

## Debugging

### Common Issues

**Problem**: Port 3000 already in use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
npm run dev -- --port 3001
```

**Problem**: Module not found error
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Problem**: Changes not reflecting
```bash
# Hard refresh browser
Ctrl+Shift+R (Windows/Linux)
Cmd+Shift+R (Mac)
```

### Browser Console

Check the browser console (F12) for:
- ❌ JavaScript errors
- ⚠️ Warnings
- ℹ️ Console logs

---

## Performance Tips

- ✅ Use CSS animations instead of JavaScript when possible
- ✅ Lazy-load images and heavy assets
- ✅ Minimize DOM queries (cache selectors)
- ✅ Debounce scroll events
- ✅ Use event delegation for many elements
- ✅ Profile with DevTools Lighthouse

---

## Deploying to Production

### 1. Build the project:
```bash
npm run build
```

### 2. Upload `dist/` folder to hosting:
- **Vercel** (recommended)
- **Netlify**
- **GitHub Pages**
- **AWS S3**

### 3. Configure for your domain:
- Point domain to hosting provider
- Enable HTTPS
- Set up staging/production environments

---

## Environment Variables

If you need environment variables, create a `.env` file:

```
VITE_API_URL=https://api.example.com
VITE_YOUR_VARIABLE=your_value
```

Access in code:
```javascript
const apiUrl = import.meta.env.VITE_API_URL;
```

---

## Git & Version Control

### Initial Setup
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo>
git push -u origin main
```

### Typical Workflow
```bash
git status              # Check changes
git add .              # Stage all changes
git commit -m "Message" # Commit
git push               # Push to remote
```

### .gitignore
Already configured to ignore:
- `node_modules/`
- `dist/`
- `.env` files
- OS-specific files

---

## Useful Tools & Extensions

### VS Code Extensions
- **Live Server** - Local dev server
- **Prettier** - Code formatter
- **ESLint** - JavaScript linter
- **Web Vitals** - Performance monitoring
- **Thunder Client** - API testing

### Browser Extensions
- **React DevTools** (for component inspection)
- **Redux DevTools** (if using state management)
- **Lighthouse** (performance audits)
- **WAVE** (accessibility testing)

---

## Learning Resources

- **Vite Docs**: https://vitejs.dev
- **MDN Web Docs**: https://developer.mozilla.org
- **JavaScript.info**: https://javascript.info
- **CSS Tricks**: https://css-tricks.com

---

## Support & Troubleshooting

### FAQ

**Q: How do I stop the dev server?**
A: Press `Ctrl+C` in the terminal

**Q: How do I access the site from another device?**
A: Use the network URL shown (e.g., http://172.17.61.241:3000)

**Q: Where are dependencies installed?**
A: In the `node_modules/` folder (automatically)

**Q: Can I deploy this directly?**
A: No, run `npm run build` first, then deploy the `dist/` folder

**Q: Does it work offline?**
A: Yes, after first build. Use `npm run preview` to test

---

## Next Steps

1. ✅ Start dev server: `npm run dev`
2. 📝 Make changes to HTML/CSS/JS
3. 🔄 Save files (auto-reload in browser)
4. 🧪 Test on different devices
5. 🏗️ Build when ready: `npm run build`
6. 🚀 Deploy to hosting

---

**Happy coding! 🚀**

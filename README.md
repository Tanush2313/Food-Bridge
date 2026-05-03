# The Food Bridge 🌉

A modern, feature-rich web application connecting surplus food from commercial kitchens with communities in need.

## Features ✨

- **Live Food Listings**: Browse real-time available food from restaurants and catering services
- **Searchable Listings**: Filter offers instantly by kitchen name, food item, or city
- **Dark Mode Support**: Toggle between light and dark themes for accessibility
- **Live Activity Feed**: Real-time donation updates and logistics alerts
- **Impact Metrics**: Track food redirected and people reached
- **Interactive Testimonials**: Stories from partners using the platform
- **FAQ Section**: Comprehensive answers to common questions
- **Responsive Design**: Works beautifully on desktop, tablet, and mobile
- **Dynamic Forms**: Partner registration and inquiry submission
- **Smooth Animations**: Reveal effects, counter animations, and smooth scrolling
- **Modular TypeScript**: Fully typed and organized code structure

## Project Structure

```
food-bridge/
├── index.html              # Main landing page
├── styles.css              # Global styles and responsive design
├── script.js               # Main JavaScript with module imports
├── script.ts               # TypeScript version
├── vite.config.js          # Vite development server configuration
├── tsconfig.json           # TypeScript configuration
├── package.json            # NPM dependencies and scripts
├── src/
│   ├── api.js              # Mock data and API utilities
│   ├── ui.js               # UI helper functions
│   ├── utilities.css       # Utility CSS classes
│   └── components.css      # Component-specific styles
└── dist/                   # Built output (generated)
```

## Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)

### Installation

1. Navigate to the project directory:
```bash
cd food-bridge
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The website will automatically open in your browser at `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start the Vite development server with hot module replacement
- `npm run build` - Build for production (optimized output in `dist/` folder)
- `npm run preview` - Preview the production build locally

## Features in Detail

### Live Listings 📋
Browse available food from verified restaurants and catering services with:
- Business name and location
- Food types and quantities
- Pickup time windows
- One-click claim functionality

### Impact Dashboard 📊
Real-time statistics showing:
- Total food redirected (kg)
- People reached through donations
- Active food partners
- Verified NGO partners

### FAQ Section ❓
Expandable questions and answers covering:
- How to get started
- Pricing and costs
- Food safety protocols
- Frequently encountered issues

### Partner Filtering 🤝
Filter partner types:
- All partners
- Businesses (restaurants, hotels)
- NGOs (shelters, food banks)
- Logistics (pickup and delivery)

### Responsive Design 📱
Works seamlessly across:
- Desktop (1366px+)
- Tablet (760px - 1366px)
- Mobile (< 760px)

## Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Build Tool**: Vite (ultra-fast bundler)
- **Type Safety**: TypeScript (included)
- **Styling**: Custom CSS with utility classes
- **Architecture**: Modular, component-based structure

## Module Organization

### `script.js` (Main Script)
- DOM element queries and event listeners
- Navigation and menu toggle
- Scroll animations and reveals
- Form handling and validation
- Dynamic content rendering

### `src/api.js`
Mock data providers for:
- Food listings
- NGO partners
- FAQ entries
- Impact statistics
- Donation submission simulation

### `src/ui.js`
Helper functions for:
- Modal windows
- Toast notifications
- Loading spinners
- Date/time formatting

### `src/utilities.css`
Utility classes for:
- Flexbox layouts
- Grid systems
- Spacing (margins, padding)
- Text alignment
- Opacity and shadows

### `src/components.css`
Styles for:
- Modals and overlays
- Notifications
- Spinners
- Listing cards
- Data displays

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Optimizations

- Lazy-loaded animations on scroll
- Efficient DOM queries and event delegation
- CSS animations (GPU-accelerated)
- Minimal JavaScript bundle size
- Fast Vite dev server with HMR

## Development Tips

### Adding New Sections
1. Add HTML markup to `index.html`
2. Create associated CSS in `styles.css` or new module files
3. Add JavaScript event listeners in `script.js`
4. Test with `npm run dev`

### Modifying Mock Data
Edit `src/api.js` to update:
- Food listings
- NGO partners
- FAQ entries
- Impact statistics

### Styling Guidelines
- Use CSS utility classes from `src/utilities.css`
- Keep component styles in `src/components.css`
- Follow the existing color scheme (`#047857` for primary, `#15202b` for text)

## Building for Production

```bash
npm run build
```

This creates a `dist/` folder with:
- Optimized HTML
- Minified CSS and JavaScript
- Asset optimization
- Ready for deployment to web servers

## Deployment

The built `dist/` folder can be deployed to:
- Vercel
- Netlify
- GitHub Pages
- Traditional web servers
- AWS S3 + CloudFront

## Future Enhancements

- Real backend API integration
- User authentication and profiles
- Real-time notifications
- Map integration for locations
- Payment/donation processing
- Multi-language support
- Dark mode theme
- Progressive Web App (PWA) features

## Contributing

To contribute improvements:
1. Make changes to the source files
2. Test with `npm run dev`
3. Ensure responsive design works on all screen sizes
4. Build with `npm run build` to verify production output

## License

MIT License - feel free to use this for your food waste reduction initiative!

## Contact & Support

For questions or issues:
- Open an issue in the repository
- Contact: support@foodbridge.local

---

**Built with ❤️ to reduce food waste and feed communities.**

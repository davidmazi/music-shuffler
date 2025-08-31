# 🚀 PWA Setup Guide

This project has been configured as a Progressive Web App (PWA) with the following features:

## ✨ PWA Features

- **Offline Support**: Service worker caches app resources for offline use
- **Install Prompt**: Users can install the app to their home screen
- **App-like Experience**: Runs in standalone mode when installed
- **Background Sync**: Handles offline actions when connection is restored
- **Push Notifications**: Ready for future notification features
- **Auto Updates**: Service worker updates automatically

## 🛠️ Setup Instructions

### 1. Generate PWA Icons

```bash
# Install dependencies (if not already installed)
bun install

# Generate PWA icons from your logo
bun run generate-icons
```

This will create icons in various sizes in the `public/icons/` directory.

### 2. Build and Deploy

```bash
# Build the project (includes PWA assets)
bun run build

# Deploy to Vercel
vercel --prod
```

## 📱 PWA Components

### PWAInstallButton

Use this component to show an install button when the app can be installed:

```tsx
import { PWAInstallButton } from './components/PWAInstallButton';

function App() {
  return (
    <div>
      <h1>Music Shuffler</h1>
      <PWAInstallButton />
    </div>
  );
}
```

### PWAUpdateButton

Use this component to notify users when an update is available:

```tsx
import { PWAUpdateButton } from './components/PWAInstallButton';

function App() {
  return (
    <div>
      <h1>Music Shuffler</h1>
      <PWAUpdateButton />
    </div>
  );
}
```

## 🔧 PWA Utilities

The PWA utilities are automatically initialized when the app loads:

```tsx
import { 
  installPWA, 
  isPWAInstalled, 
  canInstallPWA, 
  checkPWAUpdates 
} from './utils/pwa';

// Check if app is installed
if (isPWAInstalled()) {
  console.log('App is running in standalone mode');
}

// Check if app can be installed
if (canInstallPWA()) {
  console.log('App can be installed');
}

// Install the app
await installPWA();

// Check for updates
await checkPWAUpdates();
```

## 📋 PWA Manifest

The `public/manifest.json` file contains:

- **App Name**: "Music Shuffler"
- **Display Mode**: Standalone (app-like experience)
- **Theme Color**: Blue (#3b82f6)
- **Icons**: Multiple sizes for different devices
- **Shortcuts**: Quick access to main features

## 🔄 Service Worker

The service worker (`public/sw.js`) provides:

- **Static Caching**: Core app files cached immediately
- **Dynamic Caching**: API responses cached on demand
- **Network First**: HTML and API calls try network first
- **Cache First**: Static assets served from cache first
- **Offline Fallback**: App works offline with cached content

## 🚀 Deployment

The PWA is configured to work with Vercel deployment:

- **HTTPS**: Automatically provided by Vercel
- **Headers**: Proper content types for manifest and service worker
- **Build Process**: PWA assets are copied during build

## 🧪 Testing PWA Features

### Test Install Prompt

1. Open the app in Chrome/Edge
2. Look for the install button or browser install prompt
3. Click to install the app

### Test Offline Functionality

1. Install the app
2. Open Chrome DevTools
3. Go to Network tab
4. Check "Offline"
5. Refresh the page - it should still work

### Test Service Worker

1. Open Chrome DevTools
2. Go to Application tab
3. Click "Service Workers" in the left sidebar
4. You should see the service worker registered

## 📱 Browser Support

- ✅ Chrome/Edge (full PWA support)
- ✅ Firefox (basic PWA support)
- ✅ Safari (limited PWA support)
- ⚠️ Mobile browsers (varies by platform)

## 🔧 Customization

### Update App Name/Description

Edit `public/manifest.json`:

```json
{
  "name": "Your App Name",
  "short_name": "AppName",
  "description": "Your app description"
}
```

### Update Theme Color

Edit both `public/manifest.json` and `src/index.html`:

```json
// manifest.json
{
  "theme_color": "#your-color"
}
```

```html
<!-- index.html -->
<meta name="theme-color" content="#your-color" />
```

### Add More Icons

1. Add icon sizes to `scripts/generate-icons.js`
2. Update `public/manifest.json` with new icon entries
3. Run `bun run generate-icons`

## 🐛 Troubleshooting

### Service Worker Not Registering

- Check browser console for errors
- Ensure HTTPS is enabled (required for service workers)
- Clear browser cache and reload

### Install Prompt Not Showing

- App must meet PWA criteria (HTTPS, manifest, service worker)
- User must not have already dismissed the prompt
- Check browser console for install criteria

### Icons Not Loading

- Run `bun run generate-icons` to create icons
- Check file paths in `manifest.json`
- Ensure icons are copied to `dist/` during build

## 📚 Resources

- [PWA Documentation](https://web.dev/progressive-web-apps/)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest)
- [Vercel PWA Deployment](https://vercel.com/docs/deployments/progressive-web-apps)

# Quick Setup Checklist

## ✅ Completed
- [x] Next.js PWA application
- [x] Authentication with multiple roles
- [x] Work order management system
- [x] Responsive mobile design
- [x] PWA manifest and configuration
- [x] Firebase integration setup
- [x] Vercel deployment configuration
- [x] Development environment

## 🔧 Before Mobile Testing

### 1. Generate PWA Icons (Required)
You need actual PNG icons for mobile installation:

```bash
# Option 1: Use online tool
# Visit https://realfavicongenerator.net/
# Upload public/icon.svg and download the generated icons

# Option 2: Manual creation
# Create these PNG files in the public/ directory:
# - icon-192x192.png (192x192 pixels)
# - icon-512x512.png (512x512 pixels)
# - apple-touch-icon.png (180x180 pixels)
```

Place generated icons in `public/` directory.

### 2. Firebase Setup (For Push Notifications)

**Step 1: Create Firebase Project**
1. Go to https://console.firebase.google.com/
2. Click "Add project"
3. Follow the setup wizard

**Step 2: Get Configuration**
1. Add a web app in Firebase console
2. Copy the config values
3. Update `.env.local`:
```bash
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123:web:abc
NEXT_PUBLIC_FIREBASE_VAPID_KEY=BM8x...
```

**Step 3: Update Service Worker**
Edit `public/firebase-messaging-sw.js` with your Firebase config values.

### 3. Test Locally

```bash
# Start development server
npm run dev

# Visit http://localhost:3000
# Test on different screen sizes
```

### 4. Test on Mobile Devices

**Local Network Testing:**
1. Find your computer's IP address
2. Update NEXTAUTH_URL in `.env.local`:
   ```bash
   NEXTAUTH_URL=http://YOUR_IP:3000
   ```
3. Restart dev server
4. Visit `http://YOUR_IP:3000` on mobile device

**Test PWA Features:**
- [ ] Login functionality
- [ ] Create work orders
- [ ] Assign orders (Manager)
- [ ] Update status (Worker)
- [ ] Install app to home screen
- [ ] Enable notifications
- [ ] Test offline behavior

## 🚀 Production Deployment

See [DEPLOYMENT.md](../DEPLOYMENT.md) for complete guide:

1. Push code to GitHub
2. Connect repo to Vercel
3. Add environment variables
4. Deploy
5. Test on mobile devices with production URL

## 📱 Mobile Installation Guide

### Android (Chrome)
1. Open app URL in Chrome
2. Tap menu (⋮) → "Install app"
3. Confirm installation

### iOS (Safari)
1. Open app URL in Safari
2. Tap Share → "Add to Home Screen"
3. Tap Add

## 🐛 Common Issues

**PWA not installing:**
- Ensure icons are present in public/
- Check manifest.json is accessible
- Verify HTTPS in production

**Notifications not working:**
- Complete Firebase setup
- Grant browser permissions
- Check VAPID key is correct

**Build errors:**
```bash
rm -rf .next node_modules
npm install
npm run build
```

## 📚 Resources

- [README.md](../README.md) - Full documentation
- [DEPLOYMENT.md](../DEPLOYMENT.md) - Deployment guide
- [Firebase Docs](https://firebase.google.com/docs/cloud-messaging)
- [PWA Docs](https://web.dev/progressive-web-apps/)

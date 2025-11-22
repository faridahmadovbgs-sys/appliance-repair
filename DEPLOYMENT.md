# Deployment Guide

## Prerequisites

1. **GitHub Account** - To connect with Vercel
2. **Firebase Account** - For push notifications and real-time features
3. **Vercel Account** - For hosting (free tier available)

## Step 1: Firebase Setup

### Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" and follow the wizard
3. Enable Google Analytics (optional)

### Configure Firebase

1. **Register Web App:**
   - In project overview, click web icon (</>) to add a web app
   - Register app with nickname "Work Order Management"
   - Copy the Firebase config values

2. **Enable Cloud Messaging:**
   - Go to Project Settings > Cloud Messaging
   - Click "Generate a new key pair" under Web Push certificates
   - Copy the VAPID key

3. **Get Service Account:**
   - Go to Project Settings > Service Accounts
   - Click "Generate new private key"
   - Save the JSON file securely

### Update Environment Variables

Update your `.env.local` file with Firebase values:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_VAPID_KEY=your-vapid-key
```

Update `public/firebase-messaging-sw.js` with your Firebase config.

## Step 2: Generate PWA Icons

### Option 1: Using Online Tools

1. Go to [RealFaviconGenerator](https://realfavicongenerator.net/)
2. Upload your `public/icon.svg`
3. Download the generated icons
4. Place them in the `public/` directory

### Option 2: Using PWA Builder

1. Visit [PWA Builder Image Generator](https://www.pwabuilder.com/imageGenerator)
2. Upload your icon
3. Generate icons in all sizes
4. Download and extract to `public/`

### Required Icons

- `icon-192x192.png` - Small icon
- `icon-512x512.png` - Large icon
- `apple-touch-icon.png` - iOS icon (180x180)

## Step 3: Deploy to Vercel

### Initial Setup

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/work-order-app.git
   git push -u origin main
   ```

2. **Connect to Vercel:**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New Project"
   - Import your GitHub repository
   - Select "Next.js" as framework

### Configure Environment Variables

In Vercel project settings, add these environment variables:

```bash
# Authentication
AUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=https://your-domain.vercel.app

# Firebase Config
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_VAPID_KEY=your-vapid-key

# Firebase Admin (for server-side)
FIREBASE_ADMIN_PROJECT_ID=your-project-id
FIREBASE_ADMIN_CLIENT_EMAIL=service-account@project.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY\n-----END PRIVATE KEY-----\n"
```

### Deploy

1. Click "Deploy"
2. Wait for build to complete
3. Visit your deployed URL

### Post-Deployment

1. **Update NEXTAUTH_URL:**
   - Go to Vercel project settings
   - Update `NEXTAUTH_URL` with your actual domain
   - Redeploy

2. **Update Firebase Authorized Domains:**
   - Go to Firebase Console > Authentication > Settings
   - Add your Vercel domain to authorized domains

## Step 4: Install on Mobile Devices

### Android

1. **Chrome Browser:**
   - Visit your Vercel URL
   - Tap menu (⋮) > "Install app" or "Add to Home Screen"
   - Confirm installation

2. **Samsung Internet:**
   - Visit your Vercel URL
   - Tap menu > "Add page to" > "Home screen"

### iOS (iPhone/iPad)

1. **Safari Browser:**
   - Visit your Vercel URL
   - Tap Share button (square with arrow)
   - Scroll down and tap "Add to Home Screen"
   - Tap "Add"

**Note:** iOS Safari is required - Chrome/Firefox won't work for PWA installation on iOS.

## Step 5: Enable Push Notifications

### Mobile Setup

After installing the app:

1. Open the installed app
2. Log in with credentials
3. Allow notifications when prompted
4. Grant permission in device settings if needed

### Testing Notifications

Test notifications using Firebase Console:

1. Go to Firebase Console > Cloud Messaging
2. Click "Send your first message"
3. Enter notification title and text
4. Select your app
5. Send test message

## Step 6: Custom Domain (Optional)

### Add Custom Domain in Vercel

1. Go to project Settings > Domains
2. Add your domain (e.g., workorders.yourcompany.com)
3. Follow DNS configuration instructions
4. Update environment variables:
   - `NEXTAUTH_URL=https://workorders.yourcompany.com`

### Update Firebase

1. Add custom domain to Firebase authorized domains
2. Update `firebase-messaging-sw.js` if needed

## Database Migration (Production)

For production, consider migrating from SQLite to PostgreSQL:

### Option 1: Vercel Postgres

```bash
npm install @vercel/postgres
```

Update `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("POSTGRES_PRISMA_URL")
}
```

### Option 2: Supabase

1. Create Supabase project
2. Get connection string
3. Update DATABASE_URL in Vercel

## Monitoring & Analytics

### Vercel Analytics

1. Go to Vercel project > Analytics
2. Enable Web Analytics
3. Monitor performance metrics

### Firebase Analytics

1. Firebase Console > Analytics
2. View user engagement
3. Track notification performance

## Troubleshooting

### PWA Not Installing

- Ensure HTTPS is enabled (automatic on Vercel)
- Check manifest.json is accessible
- Verify icons are proper sizes
- Clear browser cache

### Notifications Not Working

- Verify VAPID key is correct
- Check Firebase service worker is registered
- Ensure HTTPS is enabled
- Check browser console for errors

### Build Errors

```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### Database Issues

```bash
# Reset and migrate database
npm run db:push
npm run db:seed
```

## Security Checklist

- [ ] Change default AUTH_SECRET
- [ ] Secure Firebase Admin credentials
- [ ] Enable Firebase security rules
- [ ] Set up rate limiting
- [ ] Enable CORS properly
- [ ] Review environment variables
- [ ] Enable Vercel authentication (if needed)

## Maintenance

### Regular Updates

```bash
# Update dependencies
npm update
npm audit fix

# Deploy
git add .
git commit -m "Update dependencies"
git push
```

### Backup Database

Set up regular backups based on your database provider.

## Support Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [PWA Documentation](https://web.dev/progressive-web-apps/)

## Cost Estimates

- **Vercel**: Free tier (Hobby) - Suitable for small teams
- **Firebase**: Free Spark plan - 10K notifications/month
- **Domain**: ~$10-15/year (optional)

For production with more users, consider:
- Vercel Pro: $20/month
- Firebase Blaze: Pay-as-you-go

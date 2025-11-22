# Firebase Firestore Setup Guide

## Why Firestore?

We're using Firebase Firestore as the database because:
- ✅ **Integrated with Firebase** - We're already using Firebase for push notifications
- ✅ **Real-time updates** - Perfect for work order management
- ✅ **Offline support** - Great for PWA functionality
- ✅ **NoSQL flexibility** - Easy to adapt as requirements change
- ✅ **Auto-scaling** - No database setup or maintenance needed
- ✅ **Built-in security** - Firestore security rules

## Setup Steps

### 1. Go to Firebase Console
Visit: https://console.firebase.google.com/

### 2. Select Your Project
Select the Firebase project you're already using for push notifications.

### 3. Enable Firestore Database
1. In the left sidebar, click **Build** → **Firestore Database**
2. Click **Create database**
3. Choose **Production mode** (we'll add security rules later)
4. Select a location (choose one close to your users)
5. Click **Enable**

### 4. Get Firebase Admin Credentials
1. Go to **Project Settings** (gear icon) → **Service accounts**
2. Click **Generate new private key**
3. Click **Generate key** - this will download a JSON file

### 5. Configure Environment Variables

Open the downloaded JSON file and copy the values to your `.env.local` file:

```env
# From the downloaded JSON file:
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour\nPrivate\nKey\nHere\n-----END PRIVATE KEY-----\n"

# Your existing Firebase web config (already set):
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
NEXT_PUBLIC_FIREBASE_VAPID_KEY=BEMYc5rsUlK...

# Your existing NextAuth config:
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here
```

### 6. Set Firestore Security Rules

In Firebase Console → Firestore Database → Rules, paste these rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper function to check if user is authenticated
    function isSignedIn() {
      return request.auth != null;
    }
    
    // Organizations collection
    match /organizations/{orgId} {
      allow read: if isSignedIn();
      allow create: if isSignedIn();
      allow update, delete: if false; // Only through admin SDK
    }
    
    // Users collection
    match /users/{userId} {
      allow read: if isSignedIn();
      allow create: if isSignedIn();
      allow update: if isSignedIn() && request.auth.uid == userId;
      allow delete: if false; // Only through admin SDK
    }
    
    // Work Orders collection
    match /workOrders/{orderId} {
      allow read: if isSignedIn();
      allow create: if isSignedIn();
      allow update: if isSignedIn();
      allow delete: if false; // Soft delete only
    }
  }
}
```

### 7. Create Composite Indexes

Firestore requires indexes for certain queries. Go to Firestore Database → Indexes and create these:

**Index 1: Work Orders by Organization**
- Collection ID: `workOrders`
- Fields indexed:
  - `organizationId` (Ascending)
  - `createdAt` (Descending)

**Index 2: Assigned Work Orders**
- Collection ID: `workOrders`
- Fields indexed:
  - `organizationId` (Ascending)
  - `assignedUserId` (Ascending)
  - `createdAt` (Descending)

> **Note:** You can also wait for errors in the console - Firestore will provide direct links to create missing indexes!

### 8. Test the Application

1. Restart your development server:
   ```powershell
   npm run dev
   ```

2. Try registering a new user
3. Try creating a work order
4. Check Firebase Console → Firestore Database to see your data!

## Data Structure

Your Firestore database will have these collections:

### `organizations`
```javascript
{
  id: "auto-generated",
  name: "ABC Repairs",
  createdAt: Timestamp
}
```

### `users`
```javascript
{
  id: "auto-generated",
  email: "user@example.com",
  firstName: "John",
  lastName: "Doe",
  role: "MANAGER", // CALL_CENTER, MANAGER, FIELD_WORKER
  organizationId: "org-id",
  organizationName: "ABC Repairs",
  passwordHash: "hashed-password",
  createdAt: Timestamp
}
```

### `workOrders`
```javascript
{
  id: "auto-generated",
  title: "Fix refrigerator",
  description: "Fridge not cooling",
  customerName: "Jane Smith",
  customerPhone: "555-1234",
  customerAddress: "123 Main St",
  status: "PENDING", // ASSIGNED, IN_PROGRESS, COMPLETED
  priority: "HIGH", // LOW, MEDIUM, HIGH
  assignedUserId: "user-id" (optional),
  assignedUserName: "John Doe" (optional),
  organizationId: "org-id",
  createdById: "user-id",
  createdByName: "Manager Name",
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

## Troubleshooting

### Error: "7 PERMISSION_DENIED: Missing or insufficient permissions"
- Check that you've enabled Firestore in the Firebase Console
- Verify your security rules are set correctly
- Make sure your `.env.local` has the correct credentials

### Error: "The query requires an index"
- Click the link in the error message to create the index automatically
- Or manually create the indexes as shown in Step 7

### Data not showing up
- Check Firebase Console → Firestore Database to see if data is being written
- Check browser console for errors
- Verify environment variables are loaded (restart dev server after changes)

## For Production (Vercel)

Add the same environment variables to Vercel:
1. Go to your Vercel project
2. Settings → Environment Variables
3. Add all the `FIREBASE_*` and `NEXTAUTH_*` variables
4. Redeploy your application

**Important:** For `FIREBASE_PRIVATE_KEY` in Vercel, keep the quotes and newlines:
```
"-----BEGIN PRIVATE KEY-----\nYour\nPrivate\nKey\n-----END PRIVATE KEY-----\n"
```

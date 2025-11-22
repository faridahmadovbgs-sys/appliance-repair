// Firebase Cloud Messaging Service Worker
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// Initialize Firebase in the service worker
firebase.initializeApp({
  apiKey: "AIzaSyD2p7UkbM4cEz29IXfd2S-gx3OZa3DIif4",
  authDomain: "contractor-aspp.firebaseapp.com",
  projectId: "contractor-aspp",
  storageBucket: "contractor-aspp.firebasestorage.app",
  messagingSenderId: "291246094320",
  appId: "1:291246094320:web:ec84081a28eef42d1e4f35"
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('Received background message:', payload);

  const notificationTitle = payload.notification?.title || 'Work Order Update';
  const notificationOptions = {
    body: payload.notification?.body || 'You have a new update',
    icon: '/icon-192x192.png',
    badge: '/icon-192x192.png',
    data: payload.data,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow(event.notification.data?.url || '/dashboard')
  );
});

// Handle skip waiting message for updates
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Take control of all pages immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

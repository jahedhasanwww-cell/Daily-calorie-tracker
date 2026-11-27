importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDTa6QDG653jRSeylE392IWv6fKOITdlw4",
  authDomain: "calories-tracker-4b0bb.firebaseapp.com",
  projectId: "calories-tracker-4b0bb",
  storageBucket: "calories-tracker-4b0bb.firebasestorage.app",
  messagingSenderId: "250215786286",
  appId: "1:250215786286:web:8290ab24ea321f9099bcbf"
});

const messaging = firebase.messaging();
messaging.onBackgroundMessage((payload) => {
  const title = (payload.notification && payload.notification.title) || 'খাবার ও ক্যালরি হিসাব';
  const options = {
    body: (payload.notification && payload.notification.body) || 'আজকের খাবার কি লগ করেছেন?',
    icon: './icon-192.png',
    badge: './icon-192.png'
  };
  self.registration.showNotification(title, options);
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clientList) {
      for (var i = 0; i < clientList.length; i++) {
        var client = clientList[i];
        if (client.url.indexOf(self.location.origin) === 0 && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('./');
      }
    })
  );
});

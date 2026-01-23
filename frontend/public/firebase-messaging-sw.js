// Import and configure the Firebase SDK
// These scripts are made available when the app is served or deployed on Firebase Hosting
// If you do not serve/host your project using Firebase Hosting see https://firebase.google.com/docs/web/setup
importScripts('https://www.gstatic.com/firebasejs/9.1.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.1.0/firebase-messaging-compat.js');
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: 'AIzaSyC9BDs30Rm0VqFfWKrpV1oQKO7bPsxUILY',
    authDomain: 'villages-io-cbb64.firebaseapp.com',
    projectId: 'villages-io-cbb64',
    storageBucket: 'villages-io-cbb64.appspot.com',
    messagingSenderId: '642030681194',
    appId: '1:642030681194:web:5fab0fc8fcc166ebee5e13',
    measurementId: 'G-0C7WENPWK8'
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();
// const messaging = firebase.messaging();

// messaging.onBackgroundMessage(function (payload) {
//     console.log('[firebase-messaging-sw.js] Received background message ', payload);
//     // Customize notification here
//     const notificationTitle = payload.notification.title;
//     const notificationOptions = {
//         body: payload.notification.body,
//         icon: './favicon/favicon-16x16.png',
//         tag: 'notification-1'
//     };
//     self.registration.showNotification(notificationTitle, notificationOptions);
// });

self.addEventListener('push', (e) => {
    // Skip if event is our own custom event
    if (e.custom) return;

    // Kep old event data to override
    let oldData = e.data;

    // Create a new event to dispatch
    let newEvent = new CustomPushEvent({
        data: {
            json() {
                let newData = oldData.json();
                newData._notification = newData.notification;
                delete newData.notification;
                return newData;
            }
        },

        waitUntil: e.waitUntil.bind(e)
    });

    // Stop event propagation
    e.stopImmediatePropagation();

    // Dispatch the new wrapped event
    dispatchEvent(newEvent);
});

// if ('serviceWorker' in navigator) {
//     navigator.serviceWorker
//         .register('firebase-messaging-sw.js')
//         .then(function (registration) {
//             console.log('Registration successful, scope is:', registration.scope);
//         })
//         .catch(function (err) {
//             console.log('Service worker registration failed, error:', err);
//         });
// }

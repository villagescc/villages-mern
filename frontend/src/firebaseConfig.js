// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getMessaging, getToken } from 'firebase/messaging';
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
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const messaging = getMessaging(app);

export { messaging, getToken };

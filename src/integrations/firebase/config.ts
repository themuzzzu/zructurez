
import { initializeApp } from "firebase/app";
import { getMessaging, isSupported } from "firebase/messaging";

// Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY", // Replace with your Firebase API Key
  authDomain: "your-app.firebaseapp.com", 
  projectId: "your-project-id", 
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id",
  measurementId: "your-measurement-id" // Optional
};

// Initialize Firebase app
let app;
try {
  app = initializeApp(firebaseConfig);
} catch (error) {
  console.error("Error initializing Firebase:", error);
}

// Initialize Firebase Messaging - will only work in supported browsers
let messaging = null;
const initMessaging = async () => {
  try {
    if (await isSupported()) {
      messaging = getMessaging(app);
      return messaging;
    }
    return null;
  } catch (error) {
    console.error("Error initializing Firebase Messaging:", error);
    return null;
  }
};

export { app, initMessaging, messaging };

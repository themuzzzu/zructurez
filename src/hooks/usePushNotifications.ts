
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { initializeApp } from 'firebase/app';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "YOUR_API_KEY", // Replace with your Firebase API Key
  authDomain: "your-app.firebaseapp.com", 
  projectId: "your-project-id", 
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id",
  measurementId: "your-measurement-id" // Optional
};

// Firebase vapid key
const vapidKey = 'YOUR_VAPID_KEY'; // Replace with your Firebase vapid key

export const usePushNotifications = () => {
  const { user } = useAuth();
  const [permission, setPermission] = useState<NotificationPermission | null>(null);
  const [deviceToken, setDeviceToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Initialize Firebase
  let messaging: any;
  
  try {
    const app = initializeApp(firebaseConfig);
    // This won't work in Safari yet as Safari doesn't support Push API
    if ('Notification' in window && navigator.serviceWorker) {
      messaging = getMessaging(app);
    }
  } catch (err) {
    console.error('Firebase initialization error', err);
  }
  
  // Request permission and get token
  const requestPermission = async () => {
    try {
      setLoading(true);
      
      if (!("Notification" in window)) {
        throw new Error('This browser does not support desktop notification');
      }

      const permission = await Notification.requestPermission();
      setPermission(permission);
      
      if (permission !== 'granted') {
        throw new Error('Notification permission not granted');
      }
      
      if (!messaging) {
        throw new Error('Firebase messaging not initialized');
      }
      
      // Get the token
      const currentToken = await getToken(messaging, { vapidKey });
      
      if (!currentToken) {
        throw new Error('No registration token available');
      }
      
      setDeviceToken(currentToken);
      
      // Save the token to the database if user is logged in
      if (user?.id) {
        await saveDeviceToken(currentToken);
      }
      
      return currentToken;
    } catch (err) {
      setError(err as Error);
      console.error('Error requesting notification permission:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Save device token to Supabase
  const saveDeviceToken = async (token: string) => {
    if (!user?.id) return;
    
    try {
      // Check if token already exists for this user
      const { data: existingTokens } = await supabase
        .from('user_device_tokens')
        .select('*')
        .eq('user_id', user.id)
        .eq('device_token', token);
      
      if (existingTokens && existingTokens.length > 0) {
        // Token already exists, no need to insert
        return;
      }
      
      // Insert new token
      const { error } = await supabase
        .from('user_device_tokens')
        .insert({
          user_id: user.id,
          device_token: token,
          platform: 'web'
        });
      
      if (error) throw error;
      
    } catch (err) {
      console.error('Error saving device token:', err);
      throw err;
    }
  };
  
  // Handle incoming messages when the app is in the foreground
  useEffect(() => {
    if (!messaging) return;
    
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log('Message received in foreground:', payload);
      
      // Display a toast notification
      if (payload.notification) {
        toast(payload.notification.title, {
          description: payload.notification.body,
        });
      }
    });
    
    // Check browser permission status on load
    if ("Notification" in window) {
      setPermission(Notification.permission as NotificationPermission);
    }
    
    setLoading(false);
    
    return () => {
      unsubscribe && unsubscribe();
    };
  }, [messaging]);
  
  // Register token when user changes
  useEffect(() => {
    if (user && permission === 'granted' && messaging) {
      getToken(messaging, { vapidKey })
        .then(token => {
          if (token) {
            setDeviceToken(token);
            saveDeviceToken(token);
          }
        })
        .catch(err => console.error('Error getting token:', err));
    }
  }, [user, permission, messaging]);
  
  return {
    permission,
    deviceToken,
    loading,
    error,
    requestPermission,
    isSupported: !!messaging
  };
};

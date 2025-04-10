
import { supabase } from '@/integrations/supabase/client';

interface NotificationOptions {
  title: string;
  body: string;
  userId?: string;
  tokens?: string[];
  topic?: string;
  data?: Record<string, string>;
  type?: 'order' | 'booking' | 'promo' | 'general';
}

export async function sendNotification({
  title,
  body,
  userId,
  tokens,
  topic,
  data = {},
  type = 'general'
}: NotificationOptions): Promise<boolean> {
  try {
    if (!userId && !tokens && !topic) {
      console.error('Must provide either userId, tokens, or topic');
      return false;
    }

    const payload = {
      title,
      body,
      user_id: userId,
      tokens,
      topic,
      data,
      type
    };

    const { data: response, error } = await supabase.functions.invoke('send-notification', {
      body: payload
    });

    if (error) {
      console.error('Error sending notification:', error);
      return false;
    }

    console.log('Notification sent successfully:', response);
    return true;
  } catch (error) {
    console.error('Error in sendNotification:', error);
    return false;
  }
}

// Helper functions for common notification types
export const notifyOrderPlaced = async (userId: string, orderId: string, businessName: string) => {
  return sendNotification({
    userId,
    title: 'Order Placed Successfully',
    body: `Your order from ${businessName} has been placed. Order ID: ${orderId}`,
    type: 'order',
    data: { 
      orderId,
      businessName,
      url: `/orders/${orderId}`
    }
  });
};

export const notifyBookingConfirmed = async (userId: string, businessName: string, date: string) => {
  return sendNotification({
    userId,
    title: 'Booking Confirmed',
    body: `Your booking with ${businessName} on ${date} has been confirmed.`,
    type: 'booking',
    data: {
      businessName,
      date,
      url: '/profile?tab=bookings'
    }
  });
};

export const notifyPromotion = async (topic: string, businessName: string, promoDetails: string) => {
  return sendNotification({
    topic, // e.g. 'business-123' where users can subscribe to business promotions
    title: `New Promotion from ${businessName}`,
    body: promoDetails,
    type: 'promo',
    data: {
      businessName,
      url: `/business/${topic.replace('business-', '')}`
    }
  });
};

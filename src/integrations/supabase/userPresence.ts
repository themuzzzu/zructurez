
import { supabase } from './client';

// Function to update a user's presence
export const updateUserPresence = async (userId: string) => {
  try {
    const { data, error } = await supabase.rpc('update_user_presence', {
      user_id: userId,
      last_seen_time: new Date().toISOString()
    });
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating user presence:', error);
    return false;
  }
};

// Function to get a user's last seen time
export const getUserPresence = async (userId: string) => {
  try {
    const { data, error } = await supabase.rpc('get_user_presence', {
      user_id: userId
    });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error getting user presence:', error);
    return null;
  }
};

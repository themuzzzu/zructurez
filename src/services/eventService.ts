
import { supabase } from '@/integrations/supabase/client';

export interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  city?: string;
  date: string;
  time: string;
  image_url?: string;
  category: string;
  price?: number;
  is_free: boolean;
  organizer_name: string;
  organizer_id: string;
  max_attendees?: number;
  current_attendees: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  latitude?: number;
  longitude?: number;
  venue_details?: string;
  contact_info?: string;
  registration_required: boolean;
  created_at: string;
  updated_at: string;
}

export interface EventFilters {
  city?: string;
  category?: string;
  dateFrom?: string;
  dateTo?: string;
  isFree?: boolean;
  latitude?: number;
  longitude?: number;
  radius?: number; // in kilometers
}

/**
 * Get events filtered by location and other criteria
 */
export const getEventsByLocation = async (
  filters: EventFilters
): Promise<Event[]> => {
  try {
    let query = supabase
      .from('events')
      .select('*');

    // Location filtering
    if (filters.city) {
      query = query.ilike('city', `%${filters.city}%`);
    }

    // Category filtering
    if (filters.category && filters.category !== 'all') {
      query = query.eq('category', filters.category);
    }

    // Date filtering
    if (filters.dateFrom) {
      query = query.gte('date', filters.dateFrom);
    }
    if (filters.dateTo) {
      query = query.lte('date', filters.dateTo);
    }

    // Free events filter
    if (filters.isFree !== undefined) {
      query = query.eq('is_free', filters.isFree);
    }

    // Only show upcoming and ongoing events by default
    query = query.in('status', ['upcoming', 'ongoing']);

    // Order by date
    query = query.order('date', { ascending: true });

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching events:', error);
      return [];
    }

    if (!data) return [];

    // Calculate distance if coordinates are provided
    if (filters.latitude && filters.longitude) {
      return data
        .map((event: any) => {
          let distance_km: number | undefined;
          
          if (event.latitude && event.longitude) {
            distance_km = calculateDistance(
              filters.latitude!,
              filters.longitude!,
              event.latitude,
              event.longitude
            );
          }

          return {
            ...event,
            distance_km
          };
        })
        .filter((event: any) => {
          // Filter by radius if specified
          if (filters.radius && event.distance_km) {
            return event.distance_km <= filters.radius;
          }
          return true;
        })
        .sort((a: any, b: any) => {
          // Sort by distance if available
          if (a.distance_km !== undefined && b.distance_km !== undefined) {
            return a.distance_km - b.distance_km;
          }
          return 0;
        });
    }

    return data;

  } catch (error) {
    console.error('Error in getEventsByLocation:', error);
    return [];
  }
};

/**
 * Get upcoming events in a specific city
 */
export const getUpcomingEventsInCity = async (
  city: string,
  limit: number = 10
): Promise<Event[]> => {
  const filters: EventFilters = {
    city,
    dateFrom: new Date().toISOString().split('T')[0] // Today onwards
  };
  
  const events = await getEventsByLocation(filters);
  return events.slice(0, limit);
};

/**
 * Get featured events (free events or high attendance)
 */
export const getFeaturedEvents = async (
  city?: string,
  limit: number = 6
): Promise<Event[]> => {
  try {
    let query = supabase
      .from('events')
      .select('*')
      .in('status', ['upcoming', 'ongoing'])
      .gte('date', new Date().toISOString().split('T')[0])
      .or('is_free.eq.true,current_attendees.gt.10')
      .order('current_attendees', { ascending: false })
      .limit(limit);

    if (city) {
      query = query.ilike('city', `%${city}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching featured events:', error);
      return [];
    }

    return data || [];

  } catch (error) {
    console.error('Error in getFeaturedEvents:', error);
    return [];
  }
};

/**
 * Get events by category in a specific location
 */
export const getEventsByCategory = async (
  category: string,
  city?: string,
  limit: number = 10
): Promise<Event[]> => {
  const filters: EventFilters = {
    city,
    category,
    dateFrom: new Date().toISOString().split('T')[0]
  };
  
  const events = await getEventsByLocation(filters);
  return events.slice(0, limit);
};

/**
 * Register for an event
 */
export const registerForEvent = async (
  eventId: string,
  userId: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    // Check if user is already registered
    const { data: existingRegistration } = await supabase
      .from('event_registrations')
      .select('id')
      .eq('event_id', eventId)
      .eq('user_id', userId)
      .single();

    if (existingRegistration) {
      return { success: false, error: 'Already registered for this event' };
    }

    // Check if event has available spots
    const { data: event } = await supabase
      .from('events')
      .select('max_attendees, current_attendees')
      .eq('id', eventId)
      .single();

    if (event?.max_attendees && event.current_attendees >= event.max_attendees) {
      return { success: false, error: 'Event is full' };
    }

    // Register the user
    const { error: registrationError } = await supabase
      .from('event_registrations')
      .insert([
        {
          event_id: eventId,
          user_id: userId,
          registered_at: new Date().toISOString()
        }
      ]);

    if (registrationError) {
      return { success: false, error: registrationError.message };
    }

    // Update attendee count
    const { error: updateError } = await supabase
      .from('events')
      .update({ 
        current_attendees: (event?.current_attendees || 0) + 1 
      })
      .eq('id', eventId);

    if (updateError) {
      console.error('Error updating attendee count:', updateError);
    }

    return { success: true };

  } catch (error) {
    console.error('Error registering for event:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
};

/**
 * Calculate distance between two coordinates using Haversine formula
 */
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Create a new event
 */
export const createEvent = async (
  eventData: Omit<Event, 'id' | 'current_attendees' | 'created_at' | 'updated_at'>
): Promise<{ success: boolean; eventId?: string; error?: string }> => {
  try {
    const { data, error } = await supabase
      .from('events')
      .insert([
        {
          ...eventData,
          current_attendees: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ])
      .select('id')
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, eventId: data.id };

  } catch (error) {
    console.error('Error creating event:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
};

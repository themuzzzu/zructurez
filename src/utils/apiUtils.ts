
import { supabase } from "@/integrations/supabase/client";
import { applyRateLimit, getClientIP, RateLimitOptions } from "./rateLimiting";
import { validateRequest } from "./requestValidation";
import { z } from "zod";
import { toast } from "sonner";
import { measureApiCall } from "./performanceTracking";

/**
 * A wrapper function that combines rate limiting, validation, and performance tracking
 * @param endpoint Endpoint identifier for tracking
 * @param requestData Request data to validate
 * @param schema Zod schema for validation
 * @param apiCallFn The API call function to execute
 * @param rateLimitOptions Rate limiting options
 * @returns Result of the API call or null if validation fails or rate limit exceeded
 */
export const safeApiCall = async <TData, TResult>(
  endpoint: string,
  requestData: TData,
  schema: z.ZodSchema<TData>,
  apiCallFn: (data: TData) => Promise<TResult>,
  rateLimitOptions?: Partial<RateLimitOptions>
): Promise<TResult | null> => {
  try {
    // 1. Validate request data
    const validData = validateRequest(requestData, schema);
    if (!validData) {
      return null;
    }
    
    // 2. Get client info for rate limiting
    const { data: { user } } = await supabase.auth.getUser();
    const clientId = user?.id || 'anonymous-user';
    
    // 3. Apply rate limiting
    return await applyRateLimit(
      // 4. Measure API call performance
      () => measureApiCall(endpoint, () => apiCallFn(validData)),
      clientId,
      rateLimitOptions
    );
  } catch (error) {
    if (error instanceof Error && error.message === "Rate limit exceeded") {
      // Already handled by rate limiting utility
      return null;
    }
    
    // Handle other errors
    console.error(`API call to ${endpoint} failed:`, error);
    toast.error(`Request failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return null;
  }
};

// Example usage for reference:
/*
import { safeApiCall } from '@/utils/apiUtils';
import { z } from 'zod';

// Define a schema for your data
const messageSchema = z.object({
  content: z.string().min(1, "Message cannot be empty"),
  receiverId: z.string().uuid("Invalid receiver ID")
});

// Use in an API call
const sendMessage = async (content: string, receiverId: string) => {
  const result = await safeApiCall(
    'sendMessage',
    { content, receiverId },
    messageSchema,
    async (data) => {
      // The actual API call logic
      const { data: message, error } = await supabase
        .from('messages')
        .insert([{
          content: data.content,
          receiver_id: data.receiverId,
          sender_id: user.id
        }])
        .single();
        
      if (error) throw error;
      return message;
    },
    { maxRequests: 10, windowMs: 10000 } // Custom rate limit: 10 messages per 10 seconds
  );
  
  return result;
};
*/

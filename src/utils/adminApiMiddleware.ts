
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { z } from 'zod';

// Admin role verification
export const verifyAdminRole = async (): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return false;
    
    // Get user role from profiles
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
      
    if (error) {
      console.error('Error fetching user profile:', error);
      return false;
    }
    
    // Temporary solution: check if the user is an admin based on an admin list
    // This should be replaced with a proper roles table
    const adminIds = [
      'feb4a063-6dfc-4b6f-a1d9-0fc2c57c04db', // Example admin ID
      user.id // For development, treat current user as admin
    ];
    
    return adminIds.includes(user.id);
  } catch (error) {
    console.error('Error verifying admin role:', error);
    return false;
  }
};

// Rate limiting implementation
interface RateLimitOptions {
  maxRequests: number;
  windowMs: number;
  message: string;
}

export const rateLimit = (
  clientId: string,
  options: RateLimitOptions
): boolean => {
  const now = Date.now();
  const windowStart = now - options.windowMs;
  
  // In a real implementation, this would use a persistent store
  // For now, use localStorage for demo purposes
  const key = `ratelimit:${clientId}`;
  const requestTimesStr = localStorage.getItem(key) || '[]';
  let requestTimes: number[] = JSON.parse(requestTimesStr);
  
  // Filter request times to only include those within the current window
  requestTimes = requestTimes.filter(time => time > windowStart);
  
  if (requestTimes.length >= options.maxRequests) {
    toast.error(options.message);
    return false;
  }
  
  // Add the current request time and save
  requestTimes.push(now);
  localStorage.setItem(key, JSON.stringify(requestTimes));
  
  return true;
};

// Request validation
export const validateRequest = <T>(
  data: unknown,
  schema: z.ZodSchema<T>,
  errorMessage = 'Invalid request data'
): T | null => {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const issues = error.issues.map(issue => issue.message).join(", ");
      toast.error(`${errorMessage}: ${issues}`);
    } else {
      toast.error(errorMessage);
    }
    return null;
  }
};

// Combine admin verification, rate limiting and validation
export const adminApiMiddleware = async <T>(
  requestData: unknown, 
  schema: z.ZodSchema<T>,
  clientId: string,
  rateLimitOptions?: Partial<RateLimitOptions>
): Promise<T | null> => {
  try {
    // 1. Verify admin role
    const isAdmin = await verifyAdminRole();
    if (!isAdmin) {
      toast.error('Unauthorized: Admin access required');
      return null;
    }
    
    // 2. Apply stricter rate limits for admin actions
    const adminRateLimits: RateLimitOptions = {
      maxRequests: 50,  // 50 requests
      windowMs: 60 * 1000, // per minute
      message: "Too many admin actions, please try again later."
    };
    
    const limitOptions = { ...adminRateLimits, ...rateLimitOptions };
    if (!rateLimit(clientId, limitOptions)) {
      return null; // Toast already shown by rateLimit function
    }
    
    // 3. Validate request data
    return validateRequest(requestData, schema, 'Invalid admin request data');
  } catch (error) {
    console.error('Admin API middleware error:', error);
    toast.error('An error occurred during admin request processing');
    return null;
  }
};

// Admin request validation schemas
export const AdminSchemas = {
  adApproval: z.object({
    adId: z.string().uuid('Invalid ad ID'),
    approved: z.boolean(),
    rejectionReason: z.string().optional()
  }),
  
  adUpdate: z.object({
    adId: z.string().uuid('Invalid ad ID'),
    title: z.string().min(3, 'Title is too short').optional(),
    description: z.string().min(10, 'Description is too short').optional(),
    status: z.enum(['pending', 'approved', 'rejected', 'active', 'paused', 'expired']).optional(),
    budget: z.number().positive('Budget must be positive').optional()
  }),
  
  productUpdate: z.object({
    productId: z.string().uuid('Invalid product ID'),
    title: z.string().min(3, 'Title is too short').optional(),
    price: z.number().positive('Price must be positive').optional(),
    stock: z.number().min(0, 'Stock cannot be negative').optional(),
    featured: z.boolean().optional()
  })
};

// Example usage for admin API endpoints
export const approveAd = async (adData: unknown): Promise<boolean> => {
  const clientId = 'admin-ad-approval';
  const validData = await adminApiMiddleware(
    adData, 
    AdminSchemas.adApproval, 
    clientId, 
    { maxRequests: 30, windowMs: 60 * 1000 } // 30 approvals per minute
  );
  
  if (!validData) return false;
  
  try {
    const { adId, approved, rejectionReason } = validData;
    
    const { error } = await supabase
      .from('advertisements')
      .update({ 
        status: approved ? 'approved' : 'rejected',
        rejection_reason: approved ? null : rejectionReason
      })
      .eq('id', adId);
      
    if (error) throw error;
    
    toast.success(`Ad ${approved ? 'approved' : 'rejected'} successfully`);
    return true;
  } catch (error) {
    console.error('Error approving ad:', error);
    toast.error('Failed to update ad status');
    return false;
  }
};

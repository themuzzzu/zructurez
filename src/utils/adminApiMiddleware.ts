
import { z } from "zod";
import { validateRequest } from "./requestValidation";
import { rateLimit } from "./rateLimiting";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { hasRole } from "./securityUtils";

// Define common schemas for admin API validation
export const AdminSchemas = {
  // Schema for ad approval
  adApproval: z.object({
    adId: z.string().uuid("Invalid ad ID format"),
    approved: z.boolean(),
    rejectionReason: z.string().optional().nullable(),
  }),
  
  // Schema for user management
  userAction: z.object({
    userId: z.string().uuid("Invalid user ID format"),
    action: z.enum(["suspend", "reinstate", "delete", "promote"]),
    reason: z.string().min(3, "Reason must be at least 3 characters").optional(),
  }),
  
  // Schema for content moderation
  contentModeration: z.object({
    contentId: z.string().uuid("Invalid content ID format"),
    contentType: z.enum(["post", "comment", "business", "product", "service"]),
    action: z.enum(["flag", "remove", "approve"]),
    reason: z.string().optional(),
  }),
};

/**
 * Function to securely approve or reject an advertisement
 * Protected with RBAC, rate limiting, and input validation
 */
export const approveAd = async (data: z.infer<typeof AdminSchemas.adApproval>): Promise<boolean> => {
  try {
    // 1. Check user session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      toast.error('Authentication required');
      return false;
    }
    
    // 2. Verify admin role using the RBAC utility
    const isAdmin = await hasRole('admin');
    if (!isAdmin) {
      toast.error('Admin privileges required');
      return false;
    }
    
    // 3. Apply rate limiting to prevent automated abuse
    const rateLimited = rateLimit(`admin-ad-approval:${session.user.id}`, {
      windowMs: 60000, // 1 minute
      maxRequests: 15,  // 15 requests per minute
      message: 'Rate limit exceeded for admin actions',
    });
    
    if (!rateLimited) return false;
    
    // 4. Validate input data
    const validData = validateRequest(data, AdminSchemas.adApproval);
    if (!validData) return false;
    
    // 5. Log the admin action for audit trail
    await supabase.from('admin_audit_logs').insert({
      user_id: session.user.id,
      action: validData.approved ? 'ad_approved' : 'ad_rejected',
      resource_id: validData.adId,
      resource_type: 'advertisement',
      details: validData.approved ? {} : { reason: validData.rejectionReason },
    });
    
    // 6. Update the advertisement status
    const { error } = await supabase
      .from('advertisements')
      .update({
        status: validData.approved ? 'approved' : 'rejected',
        ...(validData.rejectionReason && { rejection_reason: validData.rejectionReason }),
      })
      .eq('id', validData.adId);
    
    if (error) {
      console.error('Error updating ad status:', error);
      toast.error('Failed to update advertisement status');
      return false;
    }
    
    // 7. Notify client of success
    toast.success(
      validData.approved
        ? 'Advertisement approved successfully'
        : 'Advertisement rejected successfully'
    );
    
    return true;
  } catch (error) {
    console.error('Error in approveAd:', error);
    toast.error('An unexpected error occurred');
    return false;
  }
};

/**
 * Function to securely moderate user content
 * Protected with RBAC, rate limiting, and input validation
 */
export const moderateContent = async (
  data: z.infer<typeof AdminSchemas.contentModeration>
): Promise<boolean> => {
  try {
    // 1. Check user session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      toast.error('Authentication required');
      return false;
    }
    
    // 2. Verify admin role
    const isAdmin = await hasRole('admin');
    if (!isAdmin) {
      toast.error('Admin privileges required');
      return false;
    }
    
    // 3. Apply rate limiting
    const rateLimited = rateLimit(`admin-content-moderation:${session.user.id}`, {
      windowMs: 60000,
      maxRequests: 20,
      message: 'Rate limit exceeded for content moderation',
    });
    
    if (!rateLimited) return false;
    
    // 4. Validate input data
    const validData = validateRequest(data, AdminSchemas.contentModeration);
    if (!validData) return false;
    
    // 5. Log the admin action
    await supabase.from('admin_audit_logs').insert({
      user_id: session.user.id,
      action: `content_${validData.action}ed`,
      resource_id: validData.contentId,
      resource_type: validData.contentType,
      details: { reason: validData.reason },
    });
    
    // 6. Update the content status based on type
    const table = getTableForContentType(validData.contentType);
    const statusField = getStatusFieldForContentType(validData.contentType);
    
    if (!table || !statusField) {
      toast.error('Invalid content type');
      return false;
    }
    
    const { error } = await supabase
      .from(table)
      .update({ [statusField]: getModerationStatus(validData.action) })
      .eq('id', validData.contentId);
    
    if (error) {
      console.error('Error updating content status:', error);
      toast.error('Failed to update content status');
      return false;
    }
    
    // 7. Notify client of success
    toast.success(`Content has been ${validData.action}ed`);
    
    return true;
  } catch (error) {
    console.error('Error in moderateContent:', error);
    toast.error('An unexpected error occurred');
    return false;
  }
};

// Helper functions for content moderation
function getTableForContentType(type: string): string | null {
  const tableMap: Record<string, string> = {
    'post': 'posts',
    'comment': 'comments',
    'business': 'businesses',
    'product': 'products',
    'service': 'services',
  };
  return tableMap[type] || null;
}

function getStatusFieldForContentType(type: string): string | null {
  const fieldMap: Record<string, string> = {
    'post': 'moderation_status',
    'comment': 'moderation_status',
    'business': 'verification_status',
    'product': 'moderation_status',
    'service': 'moderation_status',
  };
  return fieldMap[type] || null;
}

function getModerationStatus(action: string): string {
  const statusMap: Record<string, string> = {
    'flag': 'flagged',
    'remove': 'removed',
    'approve': 'approved',
  };
  return statusMap[action] || 'pending';
}

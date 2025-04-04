
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { rateLimit } from "./rateLimiting";
import { z } from "zod";

// Schema for validating API requests with security filtering
export const secureStringSchema = (fieldName: string) => 
  z.string()
    .min(1, `${fieldName} is required`)
    .max(500, `${fieldName} too long`)
    .refine(
      (value) => !containsMaliciousPatterns(value),
      { message: `${fieldName} contains potentially unsafe content` }
    );

// Schema for validating URLs in API requests
export const secureUrlSchema = 
  z.string()
    .url("Invalid URL format")
    .refine(
      (value) => isAllowedUrl(value),
      { message: "URL domain not allowed" }
    );

// Function to prevent SQL/NoSQL injection and XSS
const containsMaliciousPatterns = (value: string): boolean => {
  if (!value) return false;
  
  // SQL Injection patterns
  const sqlPatterns = [
    /'\s*OR\s*'1'='1/i,
    /'\s*OR\s*1=1/i,
    /'\s*OR\s*'\w+'='\w+/i,
    /'\s*;\s*DROP\s+TABLE/i,
    /'\s*;\s*DELETE\s+FROM/i,
    /'\s*UNION\s+SELECT/i,
    /'\s*EXEC\s+XP_/i
  ];
  
  // XSS patterns
  const xssPatterns = [
    /<script\b[^>]*>/i,
    /<iframe\b[^>]*>/i,
    /<img[^>]+\bon\w+=/i,
    /javascript:/i,
    /onerror=/i,
    /onload=/i,
    /eval\(/i,
    /document\.cookie/i
  ];
  
  // NoSQL injection patterns
  const noSqlPatterns = [
    /\{\s*\$gt\s*:/i,
    /\{\s*\$ne\s*:/i,
    /\{\s*\$where\s*:/i,
    /\{\s*\$exists\s*:/i
  ];
  
  // Path traversal patterns
  const pathTraversalPatterns = [
    /\.\.\//,
    /\.\.\\/, 
    /%2e%2e\//i,
    /%2e%2e\\/i
  ];
  
  const allPatterns = [
    ...sqlPatterns,
    ...xssPatterns,
    ...noSqlPatterns,
    ...pathTraversalPatterns
  ];
  
  return allPatterns.some(pattern => pattern.test(value));
};

// Function to validate URLs against an allowlist
const isAllowedUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    
    // Define allowed domains (would be configured in a real app)
    const allowedDomains = [
      'kjmlxafygdzkrlopyyvk.supabase.co',
      'supabase.co',
      'supabase.com',
      'api.example.com',
      'cdn.example.com',
      'storage.googleapis.com',
      'firebasestorage.googleapis.com',
      'maps.googleapis.com',
      'drive.google.com',
      'youtube.com',
      'youtu.be',
      'vimeo.com',
      'player.vimeo.com',
      'images.unsplash.com',
      'cloudinary.com',
      'res.cloudinary.com'
    ];
    
    // Check if domain or parent domain is in allowlist
    return allowedDomains.some(domain => 
      urlObj.hostname === domain || 
      urlObj.hostname.endsWith(`.${domain}`)
    );
  } catch (e) {
    return false;
  }
};

/**
 * Log suspicious API activity for security monitoring
 */
export const logSuspiciousActivity = async (
  activityType: string,
  details: any,
  userId?: string
): Promise<void> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    const currentUserId = userId || session?.user?.id;
    
    await supabase.from('security_events').insert({
      user_id: currentUserId,
      event_type: 'suspicious_activity',
      activity_type: activityType,
      ip_address: 'client-ip', // Would be set server-side in production
      details: details
    });
    
    // Alert admins for high-severity issues
    if (details.severity === 'high') {
      // In production, this would trigger a real-time alert
      console.error('HIGH SEVERITY SECURITY EVENT:', activityType, details);
    }
  } catch (error) {
    console.error('Failed to log security event:', error);
  }
};

/**
 * Safe method to handle file uploads with security checks
 */
export const handleSecureFileUpload = async (
  file: File,
  options: {
    maxSizeMB?: number;
    allowedTypes?: string[];
    bucketName: string;
    folderPath?: string;
  }
): Promise<string | null> => {
  try {
    // Default options
    const maxSizeMB = options.maxSizeMB || 5; // 5MB default
    const allowedTypes = options.allowedTypes || [
      'image/jpeg', 
      'image/png', 
      'image/gif', 
      'application/pdf'
    ];
    
    // Validate file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      toast.error(`File too large. Maximum size is ${maxSizeMB}MB.`);
      return null;
    }
    
    // Validate file type
    if (!allowedTypes.includes(file.type)) {
      toast.error(`File type not allowed. Allowed types: ${allowedTypes.join(', ')}`);
      logSuspiciousActivity('invalid_file_upload', {
        fileType: file.type,
        fileName: file.name,
        fileSize: file.size,
        severity: 'medium'
      });
      return null;
    }
    
    // Apply rate limiting
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      const rateLimited = rateLimit(`file-upload:${session.user.id}`, {
        windowMs: 60000, // 1 minute window
        maxRequests: 10,  // 10 uploads per minute
        message: 'Too many upload attempts. Please try again later.',
      });
      
      if (!rateLimited) return null;
    }
    
    // Create a safe filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = options.folderPath 
      ? `${options.folderPath}/${fileName}`
      : fileName;
    
    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(options.bucketName)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload file');
      return null;
    }
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(options.bucketName)
      .getPublicUrl(data.path);
    
    return publicUrl;
  } catch (error) {
    console.error('File upload error:', error);
    toast.error('An error occurred during file upload');
    return null;
  }
};

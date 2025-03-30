
import { z } from "zod";

// Social Media Schema
const socialMediaSchema = z.object({
  facebook: z.string().optional(),
  instagram: z.string().optional(),
  twitter: z.string().optional(),
});

// Owner Schema
const ownerSchema = z.object({
  name: z.string().min(1, "Owner name is required"),
  role: z.string().min(1, "Role is required"),
  position: z.string().min(1, "Position is required"),
  experience: z.string().min(1, "Experience is required"),
  qualifications: z.string().optional(),
  bio: z.string().optional(),
  image_url: z.string().nullable().optional(),
});

// Staff Schema
const staffSchema = z.object({
  name: z.string().min(1, "Staff name is required"),
  position: z.string().min(1, "Position is required"),
  experience: z.string().optional(),
  bio: z.string().optional(),
  image_url: z.string().nullable().optional(),
});

// Membership Plan Schema
const membershipPlanSchema = z.object({
  name: z.string().min(1, "Plan name is required"),
  price: z.number().min(0, "Price must be a positive number"),
  description: z.string().optional(),
  features: z.array(z.string()).optional().default([]),
});

// Main Business Form Schema
export const businessFormSchema = z.object({
  // Step 1: Basic Information
  name: z.string().min(1, "Business name is required"),
  category: z.string().min(1, "Category is required"),
  otherCategory: z.string().optional(),
  description: z.string().min(10, "Description must be at least 10 characters"),
  appointment_price: z.string().optional().or(z.literal("")),
  consultation_price: z.string().optional().or(z.literal("")),
  website: z.string().url().optional().or(z.literal("")),
  social_media: socialMediaSchema.optional().default({}),
  
  // Step 2: Owners & Staff
  owners: z.array(ownerSchema).min(1, "At least one owner is required"),
  staff_details: z.array(staffSchema).optional().default([]),
  
  // Step 3: Location & Contact
  location: z.string().min(1, "Location is required"),
  contact: z.string().min(10, "Valid contact number is required"),
  whatsapp: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  
  // Step 4: Business Hours
  is_24_7: z.boolean().default(false),
  hours: z.string().min(1, "Business hours are required"),
  
  // Step 5: Images, Membership & Submit
  image: z.string().nullable().optional(),
  agree_terms: z.boolean().refine(val => val === true, {
    message: "You must agree to the terms and conditions",
  }),
  membership_plans: z.array(membershipPlanSchema).optional().default([]),
});

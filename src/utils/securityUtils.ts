
import { supabase } from "@/integrations/supabase/client";
import { UserRoleApi } from "./supabase/securityTypes";

/**
 * Checks if a user has a specific role
 */
export const checkUserRole = async (userId: string, role: string): Promise<boolean> => {
  if (!userId) return false;
  
  try {
    const { data, error } = await UserRoleApi.getUserRoles(userId);
    
    if (error) {
      console.error("Error checking user role:", error);
      return false;
    }
    
    return data ? data.some(r => r.role === role) : false;
  } catch (error) {
    console.error("Exception in checkUserRole:", error);
    return false;
  }
};

/**
 * Add a role to a user
 */
export const addUserRole = async (
  userId: string,
  role: 'admin' | 'business_owner' | 'customer'
): Promise<boolean> => {
  try {
    const { error } = await UserRoleApi.addRole(userId, role);
    
    if (error) {
      console.error("Error adding user role:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Exception in addUserRole:", error);
    return false;
  }
};

/**
 * Remove a role from a user
 */
export const removeUserRole = async (userId: string, role: string): Promise<boolean> => {
  try {
    const { error } = await UserRoleApi.removeRole(userId, role);
    
    if (error) {
      console.error("Error removing user role:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Exception in removeUserRole:", error);
    return false;
  }
};

/**
 * Get all roles for a user
 */
export const getUserRoles = async (userId: string): Promise<string[]> => {
  try {
    const { data, error } = await UserRoleApi.getUserRoles(userId);
    
    if (error) {
      console.error("Error getting user roles:", error);
      return [];
    }
    
    return data ? data.map(r => r.role) : [];
  } catch (error) {
    console.error("Exception in getUserRoles:", error);
    return [];
  }
};

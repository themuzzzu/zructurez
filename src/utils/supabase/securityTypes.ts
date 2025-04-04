
import { supabase } from "@/integrations/supabase/client";
import { SecurityEvent, UserRole, AdminAuditLog } from "@/types/security";

// Type-safe helper functions for the security tables
export const SecurityEventApi = {
  async logEvent(event: Omit<SecurityEvent, 'id' | 'created_at'>): Promise<{ data: SecurityEvent | null, error: any }> {
    const { data, error } = await supabase
      .from('security_events')
      .insert(event)
      .select('*')
      .single();
    
    return { data: data as SecurityEvent | null, error };
  },
  
  async getUserEvents(userId: string): Promise<{ data: SecurityEvent[] | null, error: any }> {
    const { data, error } = await supabase
      .from('security_events')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    return { data: data as SecurityEvent[] | null, error };
  }
};

export const UserRoleApi = {
  async getUserRoles(userId: string): Promise<{ data: UserRole[] | null, error: any }> {
    const { data, error } = await supabase
      .from('user_roles')
      .select('*')
      .eq('user_id', userId);
    
    return { data: data as UserRole[] | null, error };
  },
  
  async addRole(userId: string, role: 'admin' | 'business_owner' | 'customer'): Promise<{ data: UserRole | null, error: any }> {
    const { data, error } = await supabase
      .from('user_roles')
      .insert({ user_id: userId, role })
      .select('*')
      .single();
    
    return { data: data as UserRole | null, error };
  },
  
  async removeRole(userId: string, role: string): Promise<{ error: any }> {
    const { error } = await supabase
      .from('user_roles')
      .delete()
      .eq('user_id', userId)
      .eq('role', role);
    
    return { error };
  }
};

export const AdminAuditApi = {
  async logAction(log: Omit<AdminAuditLog, 'id' | 'created_at'>): Promise<{ data: AdminAuditLog | null, error: any }> {
    const { data, error } = await supabase
      .from('admin_audit_logs')
      .insert(log)
      .select('*')
      .single();
    
    return { data: data as AdminAuditLog | null, error };
  },
  
  async getAuditLogs(): Promise<{ data: AdminAuditLog[] | null, error: any }> {
    const { data, error } = await supabase
      .from('admin_audit_logs')
      .select('*')
      .order('created_at', { ascending: false });
    
    return { data: data as AdminAuditLog[] | null, error };
  }
};

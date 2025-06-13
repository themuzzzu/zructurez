
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface UserRole {
  id: string;
  user_id: string;
  role_name: string;
  granted_by: string;
  granted_at: string;
  expires_at?: string;
  is_active: boolean;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  resource: string;
  action: string;
}

export interface AdminLog {
  id: string;
  admin_id: string;
  action: string;
  resource_type: string;
  resource_id?: string;
  old_values?: any;
  new_values?: any;
  ip_address?: string;
  user_agent?: string;
  timestamp: string;
}

export interface ContentModeration {
  id: string;
  content_type: 'post' | 'product' | 'service' | 'business' | 'comment';
  content_id: string;
  reported_by?: string;
  moderator_id?: string;
  status: 'pending' | 'approved' | 'rejected' | 'escalated';
  reason?: string;
  moderator_notes?: string;
  auto_flagged: boolean;
  severity_level: number;
  created_at: string;
  reviewed_at?: string;
  resolved_at?: string;
}

export interface SystemMetric {
  id: string;
  metric_name: string;
  metric_value: number;
  metric_type: 'counter' | 'gauge' | 'histogram';
  tags: Record<string, any>;
  timestamp: string;
}

export interface FinancialTransaction {
  id: string;
  user_id: string;
  transaction_type: 'ad_payment' | 'subscription' | 'commission' | 'refund';
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  reference_id?: string;
  payment_method?: string;
  stripe_payment_intent_id?: string;
  notes?: string;
  created_at: string;
  processed_at?: string;
}

// User Management
export const getUserRoles = async (): Promise<UserRole[]> => {
  const { data, error } = await supabase
    .from('user_roles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching user roles:', error);
    return [];
  }

  return data || [];
};

export const assignUserRole = async (
  userId: string,
  roleName: string,
  expiresAt?: string
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('user_roles')
      .insert({
        user_id: userId,
        role_name: roleName,
        granted_by: (await supabase.auth.getUser()).data.user?.id,
        expires_at: expiresAt
      });

    if (error) throw error;

    await logAdminAction('assign_role', 'user_roles', userId, {}, { role: roleName });
    toast.success('Role assigned successfully');
    return true;
  } catch (error) {
    console.error('Error assigning role:', error);
    toast.error('Failed to assign role');
    return false;
  }
};

export const revokeUserRole = async (roleId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('user_roles')
      .update({ is_active: false })
      .eq('id', roleId);

    if (error) throw error;

    await logAdminAction('revoke_role', 'user_roles', roleId);
    toast.success('Role revoked successfully');
    return true;
  } catch (error) {
    console.error('Error revoking role:', error);
    toast.error('Failed to revoke role');
    return false;
  }
};

// Content Moderation
export const getPendingContent = async (): Promise<ContentModeration[]> => {
  const { data, error } = await supabase
    .from('content_moderation')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching pending content:', error);
    return [];
  }

  return data || [];
};

export const moderateContent = async (
  moderationId: string,
  status: 'approved' | 'rejected' | 'escalated',
  notes?: string
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('content_moderation')
      .update({
        status,
        moderator_notes: notes,
        moderator_id: (await supabase.auth.getUser()).data.user?.id,
        reviewed_at: new Date().toISOString(),
        resolved_at: status !== 'escalated' ? new Date().toISOString() : null
      })
      .eq('id', moderationId);

    if (error) throw error;

    await logAdminAction('moderate_content', 'content_moderation', moderationId, {}, { status, notes });
    toast.success('Content moderated successfully');
    return true;
  } catch (error) {
    console.error('Error moderating content:', error);
    toast.error('Failed to moderate content');
    return false;
  }
};

// System Metrics
export const getSystemMetrics = async (
  metricNames?: string[],
  timeRange?: { start: string; end: string }
): Promise<SystemMetric[]> => {
  let query = supabase
    .from('system_metrics')
    .select('*')
    .order('timestamp', { ascending: false });

  if (metricNames && metricNames.length > 0) {
    query = query.in('metric_name', metricNames);
  }

  if (timeRange) {
    query = query
      .gte('timestamp', timeRange.start)
      .lte('timestamp', timeRange.end);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching system metrics:', error);
    return [];
  }

  return data || [];
};

export const recordMetric = async (
  name: string,
  value: number,
  type: 'counter' | 'gauge' | 'histogram',
  tags: Record<string, any> = {}
): Promise<void> => {
  try {
    const { error } = await supabase
      .from('system_metrics')
      .insert({
        metric_name: name,
        metric_value: value,
        metric_type: type,
        tags
      });

    if (error) throw error;
  } catch (error) {
    console.error('Error recording metric:', error);
  }
};

// Financial Management
export const getFinancialTransactions = async (
  filters?: {
    userId?: string;
    transactionType?: string;
    status?: string;
    dateRange?: { start: string; end: string };
  }
): Promise<FinancialTransaction[]> => {
  let query = supabase
    .from('financial_transactions')
    .select('*')
    .order('created_at', { ascending: false });

  if (filters?.userId) {
    query = query.eq('user_id', filters.userId);
  }

  if (filters?.transactionType) {
    query = query.eq('transaction_type', filters.transactionType);
  }

  if (filters?.status) {
    query = query.eq('status', filters.status);
  }

  if (filters?.dateRange) {
    query = query
      .gte('created_at', filters.dateRange.start)
      .lte('created_at', filters.dateRange.end);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching financial transactions:', error);
    return [];
  }

  return data || [];
};

export const getRevenueAnalytics = async (timeRange: { start: string; end: string }) => {
  const { data, error } = await supabase
    .from('financial_transactions')
    .select('transaction_type, amount, currency, created_at')
    .eq('status', 'completed')
    .gte('created_at', timeRange.start)
    .lte('created_at', timeRange.end);

  if (error) {
    console.error('Error fetching revenue analytics:', error);
    return {
      totalRevenue: 0,
      revenueByType: {},
      dailyRevenue: []
    };
  }

  const totalRevenue = data?.reduce((sum, t) => sum + t.amount, 0) || 0;
  
  const revenueByType = data?.reduce((acc, t) => {
    acc[t.transaction_type] = (acc[t.transaction_type] || 0) + t.amount;
    return acc;
  }, {} as Record<string, number>) || {};

  const dailyRevenue = data?.reduce((acc, t) => {
    const date = new Date(t.created_at).toISOString().split('T')[0];
    acc[date] = (acc[date] || 0) + t.amount;
    return acc;
  }, {} as Record<string, number>) || {};

  return {
    totalRevenue,
    revenueByType,
    dailyRevenue: Object.entries(dailyRevenue).map(([date, amount]) => ({ date, amount }))
  };
};

// Admin Logging
export const logAdminAction = async (
  action: string,
  resourceType: string,
  resourceId?: string,
  oldValues?: any,
  newValues?: any
): Promise<void> => {
  try {
    const { error } = await supabase
      .from('admin_logs')
      .insert({
        admin_id: (await supabase.auth.getUser()).data.user?.id,
        action,
        resource_type: resourceType,
        resource_id: resourceId,
        old_values: oldValues,
        new_values: newValues,
        ip_address: null, // Would be set on server-side
        user_agent: navigator.userAgent
      });

    if (error) throw error;
  } catch (error) {
    console.error('Error logging admin action:', error);
  }
};

export const getAdminLogs = async (
  filters?: {
    adminId?: string;
    action?: string;
    resourceType?: string;
    dateRange?: { start: string; end: string };
  }
): Promise<AdminLog[]> => {
  let query = supabase
    .from('admin_logs')
    .select('*')
    .order('timestamp', { ascending: false });

  if (filters?.adminId) {
    query = query.eq('admin_id', filters.adminId);
  }

  if (filters?.action) {
    query = query.eq('action', filters.action);
  }

  if (filters?.resourceType) {
    query = query.eq('resource_type', filters.resourceType);
  }

  if (filters?.dateRange) {
    query = query
      .gte('timestamp', filters.dateRange.start)
      .lte('timestamp', filters.dateRange.end);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching admin logs:', error);
    return [];
  }

  return data || [];
};

// Role and Permission Checking
export const checkUserPermission = async (
  userId: string,
  permissionName: string
): Promise<boolean> => {
  try {
    const { data: userRoles } = await supabase
      .from('user_roles')
      .select(`
        role_name,
        role_permissions!inner(
          permissions!inner(name)
        )
      `)
      .eq('user_id', userId)
      .eq('is_active', true)
      .eq('role_permissions.permissions.name', permissionName);

    return (userRoles?.length || 0) > 0;
  } catch (error) {
    console.error('Error checking user permission:', error);
    return false;
  }
};

export const isUserAdmin = async (userId?: string): Promise<boolean> => {
  if (!userId) {
    const { data: { user } } = await supabase.auth.getUser();
    userId = user?.id;
  }

  if (!userId) return false;

  try {
    const { data: userRoles } = await supabase
      .from('user_roles')
      .select('role_name')
      .eq('user_id', userId)
      .eq('role_name', 'admin')
      .eq('is_active', true);

    return (userRoles?.length || 0) > 0;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};

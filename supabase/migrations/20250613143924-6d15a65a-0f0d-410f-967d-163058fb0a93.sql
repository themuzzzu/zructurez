
-- Drop existing tables if they exist to start fresh
DROP TABLE IF EXISTS role_permissions CASCADE;
DROP TABLE IF EXISTS user_roles CASCADE;
DROP TABLE IF EXISTS permissions CASCADE;
DROP TABLE IF EXISTS admin_logs CASCADE;
DROP TABLE IF EXISTS content_moderation CASCADE;
DROP TABLE IF EXISTS system_metrics CASCADE;
DROP TABLE IF EXISTS financial_transactions CASCADE;

-- Create permissions table first
CREATE TABLE permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  resource VARCHAR(50) NOT NULL,
  action VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user roles table
CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role_name VARCHAR(50) NOT NULL,
  granted_by UUID REFERENCES auth.users(id),
  granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create role permissions mapping table
CREATE TABLE role_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_name VARCHAR(50) NOT NULL,
  permission_id UUID REFERENCES permissions(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(role_name, permission_id)
);

-- Create admin logs table for audit trail
CREATE TABLE admin_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES auth.users(id),
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(50) NOT NULL,
  resource_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create content moderation table
CREATE TABLE content_moderation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type VARCHAR(50) NOT NULL,
  content_id UUID NOT NULL,
  reported_by UUID REFERENCES auth.users(id),
  moderator_id UUID REFERENCES auth.users(id),
  status VARCHAR(20) DEFAULT 'pending',
  reason VARCHAR(100),
  moderator_notes TEXT,
  auto_flagged BOOLEAN DEFAULT false,
  severity_level INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Create system metrics table
CREATE TABLE system_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_name VARCHAR(100) NOT NULL,
  metric_value NUMERIC NOT NULL,
  metric_type VARCHAR(50) NOT NULL,
  tags JSONB DEFAULT '{}',
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create financial transactions table
CREATE TABLE financial_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  transaction_type VARCHAR(50) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  status VARCHAR(20) DEFAULT 'pending',
  reference_id UUID,
  payment_method VARCHAR(50),
  stripe_payment_intent_id VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  processed_at TIMESTAMP WITH TIME ZONE
);

-- Insert default permissions
INSERT INTO permissions (name, description, resource, action) VALUES
('manage_users', 'Manage user accounts', 'users', 'manage'),
('moderate_content', 'Moderate user content', 'content', 'moderate'),
('manage_ads', 'Manage advertisements', 'ads', 'manage'),
('view_analytics', 'View system analytics', 'analytics', 'view'),
('manage_finances', 'Manage financial data', 'finances', 'manage'),
('system_admin', 'Full system administration', 'system', 'admin');

-- Insert default role permissions
INSERT INTO role_permissions (role_name, permission_id) 
SELECT 'admin', id FROM permissions;

INSERT INTO role_permissions (role_name, permission_id) 
SELECT 'moderator', id FROM permissions WHERE name IN ('moderate_content', 'view_analytics');

-- Create indexes for performance
CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX idx_user_roles_role_name ON user_roles(role_name);
CREATE INDEX idx_admin_logs_admin_id ON admin_logs(admin_id);
CREATE INDEX idx_admin_logs_timestamp ON admin_logs(timestamp);
CREATE INDEX idx_content_moderation_status ON content_moderation(status);
CREATE INDEX idx_content_moderation_content ON content_moderation(content_type, content_id);
CREATE INDEX idx_system_metrics_name_timestamp ON system_metrics(metric_name, timestamp);
CREATE INDEX idx_financial_transactions_user_id ON financial_transactions(user_id);
CREATE INDEX idx_financial_transactions_type ON financial_transactions(transaction_type);

-- Enable RLS on all tables
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_moderation ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_transactions ENABLE ROW LEVEL SECURITY;

-- Simple RLS policies that don't rely on complex joins
CREATE POLICY "user_roles_select" ON user_roles FOR SELECT TO authenticated USING (true);
CREATE POLICY "user_roles_insert" ON user_roles FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "user_roles_update" ON user_roles FOR UPDATE TO authenticated USING (true);
CREATE POLICY "user_roles_delete" ON user_roles FOR DELETE TO authenticated USING (true);

CREATE POLICY "permissions_select" ON permissions FOR SELECT TO authenticated USING (true);

CREATE POLICY "role_permissions_select" ON role_permissions FOR SELECT TO authenticated USING (true);

CREATE POLICY "admin_logs_select" ON admin_logs FOR SELECT TO authenticated USING (true);
CREATE POLICY "admin_logs_insert" ON admin_logs FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "content_moderation_select" ON content_moderation FOR SELECT TO authenticated USING (true);
CREATE POLICY "content_moderation_insert" ON content_moderation FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "content_moderation_update" ON content_moderation FOR UPDATE TO authenticated USING (true);

CREATE POLICY "system_metrics_select" ON system_metrics FOR SELECT TO authenticated USING (true);
CREATE POLICY "system_metrics_insert" ON system_metrics FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "financial_transactions_select" ON financial_transactions FOR SELECT TO authenticated USING (true);
CREATE POLICY "financial_transactions_insert" ON financial_transactions FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "financial_transactions_update" ON financial_transactions FOR UPDATE TO authenticated USING (true);

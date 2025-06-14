
-- Fixed Enhanced Admin Dashboard SQL Migration
-- This migration fixes the partitioning issue and improves upon the existing admin system

-- Drop existing tables to rebuild with improvements
DROP TABLE IF EXISTS role_permissions CASCADE;
DROP TABLE IF EXISTS user_roles CASCADE;
DROP TABLE IF EXISTS permissions CASCADE;
DROP TABLE IF EXISTS admin_logs CASCADE;
DROP TABLE IF EXISTS content_moderation CASCADE;
DROP TABLE IF EXISTS system_metrics CASCADE;
DROP TABLE IF EXISTS financial_transactions CASCADE;
DROP TABLE IF EXISTS security_events CASCADE;
DROP TABLE IF EXISTS admin_sessions CASCADE;
DROP TABLE IF EXISTS audit_trail CASCADE;
DROP TABLE IF EXISTS rate_limits CASCADE;

-- Drop enum types if they exist
DROP TYPE IF EXISTS user_role_enum CASCADE;
DROP TYPE IF EXISTS permission_action_enum CASCADE;
DROP TYPE IF EXISTS content_status_enum CASCADE;
DROP TYPE IF EXISTS transaction_status_enum CASCADE;
DROP TYPE IF EXISTS transaction_type_enum CASCADE;
DROP TYPE IF EXISTS severity_enum CASCADE;
DROP TYPE IF EXISTS metric_type_enum CASCADE;

-- Create enum types for better data integrity and performance
CREATE TYPE user_role_enum AS ENUM ('admin', 'moderator', 'business_owner', 'premium_user', 'user');
CREATE TYPE permission_action_enum AS ENUM ('create', 'read', 'update', 'delete', 'manage', 'moderate', 'view', 'admin');
CREATE TYPE content_status_enum AS ENUM ('pending', 'approved', 'rejected', 'escalated', 'auto_approved', 'auto_rejected');
CREATE TYPE transaction_status_enum AS ENUM ('pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded');
CREATE TYPE transaction_type_enum AS ENUM ('ad_payment', 'subscription', 'commission', 'refund', 'withdrawal', 'deposit');
CREATE TYPE severity_enum AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE metric_type_enum AS ENUM ('counter', 'gauge', 'histogram', 'rate');

-- Enhanced permissions table with better structure
CREATE TABLE permissions (
  id UUID DEFAULT gen_random_uuid(),
  name VARCHAR(100) UNIQUE NOT NULL CHECK (name ~ '^[a-z_]+$'),
  description TEXT NOT NULL CHECK (length(description) >= 10),
  resource VARCHAR(50) NOT NULL CHECK (resource ~ '^[a-z_]+$'),
  action permission_action_enum NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Enhanced user roles with better constraints and audit trail
CREATE TABLE user_roles (
  id UUID DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role_name user_role_enum NOT NULL,
  granted_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE CHECK (expires_at IS NULL OR expires_at > granted_at),
  is_active BOOLEAN DEFAULT true,
  reason TEXT CHECK (reason IS NULL OR length(reason) >= 3),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Role permissions mapping with cascade handling
CREATE TABLE role_permissions (
  id UUID DEFAULT gen_random_uuid(),
  role_name user_role_enum NOT NULL,
  permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id),
  UNIQUE(role_name, permission_id)
);

-- Rate limiting table for API security
CREATE TABLE rate_limits (
  id UUID DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  ip_address INET,
  endpoint VARCHAR(255) NOT NULL,
  request_count INTEGER DEFAULT 1,
  window_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  window_duration INTERVAL DEFAULT INTERVAL '1 hour',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Enhanced admin sessions with security features
CREATE TABLE admin_sessions (
  id UUID DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_token TEXT NOT NULL UNIQUE,
  ip_address INET NOT NULL,
  user_agent TEXT,
  fingerprint TEXT,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  login_method VARCHAR(50) DEFAULT 'password',
  two_factor_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Comprehensive audit trail table
CREATE TABLE audit_trail (
  id UUID DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  table_name VARCHAR(100),
  record_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  session_id UUID REFERENCES admin_sessions(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Enhanced security events with better categorization
CREATE TABLE security_events (
  id UUID DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  event_type VARCHAR(100) NOT NULL,
  severity severity_enum NOT NULL,
  description TEXT NOT NULL,
  ip_address INET,
  user_agent TEXT,
  metadata JSONB DEFAULT '{}',
  resolved BOOLEAN DEFAULT false,
  resolved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  resolved_at TIMESTAMP WITH TIME ZONE,
  auto_resolved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Improved admin logs with performance tracking
CREATE TABLE admin_logs (
  id UUID DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(50) NOT NULL,
  resource_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  session_id UUID REFERENCES admin_sessions(id) ON DELETE SET NULL,
  success BOOLEAN DEFAULT true,
  error_message TEXT,
  execution_time_ms INTEGER CHECK (execution_time_ms IS NULL OR execution_time_ms >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Enhanced content moderation with AI integration
CREATE TABLE content_moderation (
  id UUID DEFAULT gen_random_uuid(),
  content_type VARCHAR(50) NOT NULL,
  content_id UUID NOT NULL,
  reported_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  moderator_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status content_status_enum DEFAULT 'pending',
  reason VARCHAR(200),
  moderator_notes TEXT,
  auto_flagged BOOLEAN DEFAULT false,
  severity_level INTEGER DEFAULT 1 CHECK (severity_level BETWEEN 1 AND 10),
  confidence_score DECIMAL(3,2) CHECK (confidence_score IS NULL OR confidence_score BETWEEN 0 AND 1),
  ai_analysis JSONB DEFAULT '{}',
  priority INTEGER DEFAULT 1 CHECK (priority BETWEEN 1 AND 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  resolved_at TIMESTAMP WITH TIME ZONE,
  PRIMARY KEY (id)
);

-- Fixed system metrics table - using composite primary key including partition column
CREATE TABLE system_metrics (
  id UUID DEFAULT gen_random_uuid(),
  metric_name VARCHAR(100) NOT NULL,
  metric_value NUMERIC NOT NULL CHECK (metric_value >= 0),
  metric_type metric_type_enum NOT NULL,
  tags JSONB DEFAULT '{}',
  aggregation_period VARCHAR(20) DEFAULT 'instant',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id, created_at)
) PARTITION BY RANGE (created_at);

-- Create partitions for system metrics (monthly partitions)
CREATE TABLE system_metrics_y2024m06 PARTITION OF system_metrics
  FOR VALUES FROM ('2024-06-01') TO ('2024-07-01');
CREATE TABLE system_metrics_y2024m07 PARTITION OF system_metrics
  FOR VALUES FROM ('2024-07-01') TO ('2024-08-01');
CREATE TABLE system_metrics_y2024m08 PARTITION OF system_metrics
  FOR VALUES FROM ('2024-08-01') TO ('2024-09-01');

-- Enhanced financial transactions with encryption and audit
CREATE TABLE financial_transactions (
  id UUID DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  transaction_type transaction_type_enum NOT NULL,
  amount DECIMAL(15,4) NOT NULL CHECK (amount > 0),
  currency CHAR(3) DEFAULT 'USD' CHECK (currency ~ '^[A-Z]{3}$'),
  status transaction_status_enum DEFAULT 'pending',
  reference_id UUID,
  external_transaction_id VARCHAR(255) UNIQUE,
  payment_method VARCHAR(50),
  stripe_payment_intent_id VARCHAR(255),
  encrypted_payment_data TEXT,
  notes TEXT,
  metadata JSONB DEFAULT '{}',
  processed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  fee_amount DECIMAL(15,4) DEFAULT 0 CHECK (fee_amount >= 0),
  net_amount DECIMAL(15,4) GENERATED ALWAYS AS (amount - fee_amount) STORED,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  processed_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  PRIMARY KEY (id)
);

-- Create comprehensive indexes for optimal performance
CREATE INDEX idx_user_roles_user_active ON user_roles(user_id, is_active) WHERE is_active = true;
CREATE INDEX idx_user_roles_expires ON user_roles(expires_at) WHERE expires_at IS NOT NULL;
CREATE UNIQUE INDEX idx_user_roles_active_unique ON user_roles(user_id, role_name) WHERE is_active = true;

CREATE INDEX idx_rate_limits_user_endpoint ON rate_limits(user_id, endpoint, window_start);
CREATE INDEX idx_rate_limits_ip_endpoint ON rate_limits(ip_address, endpoint, window_start);

CREATE INDEX idx_admin_sessions_user_active ON admin_sessions(user_id, is_active) WHERE is_active = true;
CREATE INDEX idx_admin_sessions_expires ON admin_sessions(expires_at);
CREATE INDEX idx_admin_sessions_token ON admin_sessions(session_token);

CREATE INDEX idx_audit_trail_user_time ON audit_trail(user_id, created_at);
CREATE INDEX idx_audit_trail_table_record ON audit_trail(table_name, record_id);

CREATE INDEX idx_security_events_severity_unresolved ON security_events(severity, resolved, created_at) WHERE resolved = false;
CREATE INDEX idx_security_events_type_time ON security_events(event_type, created_at);

CREATE INDEX idx_admin_logs_admin_time ON admin_logs(admin_id, created_at);
CREATE INDEX idx_admin_logs_resource ON admin_logs(resource_type, resource_id);
CREATE INDEX idx_admin_logs_performance ON admin_logs(execution_time_ms) WHERE execution_time_ms > 1000;

CREATE INDEX idx_content_moderation_status_priority ON content_moderation(status, priority, created_at);
CREATE INDEX idx_content_moderation_content ON content_moderation(content_type, content_id);
CREATE INDEX idx_content_moderation_severity ON content_moderation(severity_level, created_at);

CREATE INDEX idx_system_metrics_name_time ON system_metrics(metric_name, created_at);
CREATE INDEX idx_system_metrics_tags ON system_metrics USING gin(tags);

CREATE INDEX idx_financial_transactions_user_status ON financial_transactions(user_id, status);
CREATE INDEX idx_financial_transactions_type_time ON financial_transactions(transaction_type, created_at);
CREATE INDEX idx_financial_transactions_amount_range ON financial_transactions(amount, created_at) WHERE amount > 1000;

-- Enhanced RLS policies
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_trail ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_moderation ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_transactions ENABLE ROW LEVEL SECURITY;

-- Efficient RLS policies using security definer functions
CREATE OR REPLACE FUNCTION auth.user_has_role(required_role text)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role_name::text = required_role 
    AND is_active = true 
    AND (expires_at IS NULL OR expires_at > NOW())
  );
$$;

CREATE OR REPLACE FUNCTION auth.user_has_permission(permission_name text)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN role_permissions rp ON ur.role_name = rp.role_name
    JOIN permissions p ON rp.permission_id = p.id
    WHERE ur.user_id = auth.uid()
    AND ur.is_active = true
    AND (ur.expires_at IS NULL OR ur.expires_at > NOW())
    AND p.name = permission_name
    AND p.is_active = true
  );
$$;

-- Apply RLS policies using the helper functions
CREATE POLICY "admin_user_roles" ON user_roles FOR ALL USING (auth.user_has_permission('manage_users'));
CREATE POLICY "view_own_roles" ON user_roles FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "view_permissions" ON permissions FOR SELECT USING (true);
CREATE POLICY "manage_permissions" ON permissions FOR ALL USING (auth.user_has_role('admin'));

CREATE POLICY "view_role_permissions" ON role_permissions FOR SELECT USING (true);
CREATE POLICY "manage_role_permissions" ON role_permissions FOR ALL USING (auth.user_has_role('admin'));

CREATE POLICY "manage_own_sessions" ON admin_sessions FOR ALL USING (user_id = auth.uid());
CREATE POLICY "admin_view_sessions" ON admin_sessions FOR SELECT USING (auth.user_has_role('admin'));

CREATE POLICY "view_audit_trail" ON audit_trail FOR SELECT USING (auth.user_has_permission('audit_logs'));
CREATE POLICY "insert_audit_trail" ON audit_trail FOR INSERT WITH CHECK (true);

CREATE POLICY "security_team_events" ON security_events FOR ALL USING (auth.user_has_permission('security_monitor'));
CREATE POLICY "view_own_security_events" ON security_events FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "admin_logs_read" ON admin_logs FOR SELECT USING (auth.user_has_permission('audit_logs'));
CREATE POLICY "admin_logs_insert" ON admin_logs FOR INSERT WITH CHECK (admin_id = auth.uid());

CREATE POLICY "moderator_content" ON content_moderation FOR ALL USING (auth.user_has_permission('moderate_content'));
CREATE POLICY "report_content" ON content_moderation FOR INSERT WITH CHECK (reported_by = auth.uid());

CREATE POLICY "analytics_metrics" ON system_metrics FOR SELECT USING (auth.user_has_permission('view_analytics'));
CREATE POLICY "insert_metrics" ON system_metrics FOR INSERT WITH CHECK (true);

CREATE POLICY "finance_team_transactions" ON financial_transactions FOR ALL USING (auth.user_has_permission('manage_finances'));
CREATE POLICY "view_own_transactions" ON financial_transactions FOR SELECT USING (user_id = auth.uid());

-- Enhanced security and utility functions
CREATE OR REPLACE FUNCTION log_admin_action(
  p_action text,
  p_resource_type text,
  p_resource_id uuid DEFAULT NULL,
  p_old_values jsonb DEFAULT NULL,
  p_new_values jsonb DEFAULT NULL
) RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  log_id uuid;
  start_time timestamp;
  execution_time integer;
BEGIN
  start_time := clock_timestamp();
  
  INSERT INTO admin_logs (
    admin_id, action, resource_type, resource_id,
    old_values, new_values, ip_address
  ) VALUES (
    auth.uid(), p_action, p_resource_type, p_resource_id,
    p_old_values, p_new_values, inet_client_addr()
  ) RETURNING id INTO log_id;
  
  execution_time := EXTRACT(EPOCH FROM (clock_timestamp() - start_time)) * 1000;
  
  UPDATE admin_logs 
  SET execution_time_ms = execution_time 
  WHERE id = log_id;
  
  RETURN log_id;
END;
$$;

CREATE OR REPLACE FUNCTION check_rate_limit(
  p_endpoint text,
  p_limit integer DEFAULT 100,
  p_window interval DEFAULT interval '1 hour'
) RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_count integer;
BEGIN
  -- Clean old entries
  DELETE FROM rate_limits 
  WHERE window_start < (NOW() - p_window);
  
  -- Get current count
  SELECT COALESCE(SUM(request_count), 0) INTO current_count
  FROM rate_limits
  WHERE (user_id = auth.uid() OR ip_address = inet_client_addr())
  AND endpoint = p_endpoint
  AND window_start >= (NOW() - p_window);
  
  -- Check if limit exceeded
  IF current_count >= p_limit THEN
    RETURN false;
  END IF;
  
  -- Update or insert rate limit record
  INSERT INTO rate_limits (user_id, ip_address, endpoint, request_count, window_start)
  VALUES (auth.uid(), inet_client_addr(), p_endpoint, 1, NOW())
  ON CONFLICT (user_id, endpoint) WHERE window_start >= (NOW() - p_window)
  DO UPDATE SET request_count = rate_limits.request_count + 1;
  
  RETURN true;
END;
$$;

-- Automated cleanup functions
CREATE OR REPLACE FUNCTION cleanup_old_data()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  cleaned_count integer := 0;
BEGIN
  -- Clean expired sessions
  UPDATE admin_sessions SET is_active = false 
  WHERE expires_at < NOW() AND is_active = true;
  GET DIAGNOSTICS cleaned_count = ROW_COUNT;
  
  -- Clean old audit trail (keep 1 year)
  DELETE FROM audit_trail WHERE created_at < NOW() - interval '1 year';
  
  -- Clean old metrics (keep 3 months)
  DELETE FROM system_metrics WHERE created_at < NOW() - interval '3 months';
  
  -- Clean resolved security events (keep 6 months)
  DELETE FROM security_events 
  WHERE resolved = true AND resolved_at < NOW() - interval '6 months';
  
  RETURN cleaned_count;
END;
$$;

-- Insert enhanced permissions
INSERT INTO permissions (name, description, resource, action) VALUES
('manage_users', 'Full user account management including creation, deletion, and role assignment', 'users', 'manage'),
('view_users', 'View user account information and basic details', 'users', 'view'),
('moderate_content', 'Review, approve, reject, and escalate user-generated content', 'content', 'moderate'),
('manage_content', 'Full content management including deletion and editing', 'content', 'manage'),
('manage_ads', 'Create, edit, delete, and configure advertisements', 'ads', 'manage'),
('approve_ads', 'Approve or reject advertisement submissions', 'ads', 'create'),
('view_analytics', 'Access system analytics and performance metrics', 'analytics', 'view'),
('manage_analytics', 'Configure analytics settings and export reports', 'analytics', 'manage'),
('manage_finances', 'View and manage financial transactions and reports', 'finances', 'manage'),
('view_finances', 'View financial reports and transaction history', 'finances', 'view'),
('system_admin', 'Full system administration including configuration changes', 'system', 'admin'),
('audit_logs', 'View and analyze system audit logs', 'logs', 'view'),
('security_monitor', 'Monitor security events and respond to threats', 'security', 'view'),
('business_verify', 'Verify and approve business registrations', 'business', 'manage');

-- Assign permissions to roles
INSERT INTO role_permissions (role_name, permission_id) 
SELECT 'admin', id FROM permissions;

INSERT INTO role_permissions (role_name, permission_id) 
SELECT 'moderator', id FROM permissions 
WHERE name IN ('moderate_content', 'view_analytics', 'view_users', 'audit_logs');

INSERT INTO role_permissions (role_name, permission_id) 
SELECT 'business_owner', id FROM permissions 
WHERE name IN ('view_analytics', 'business_verify');

-- Create automated triggers
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_user_roles_timestamp
  BEFORE UPDATE ON user_roles
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- Security audit trigger
CREATE OR REPLACE FUNCTION audit_security_changes()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO security_events (user_id, event_type, severity, description, metadata)
    VALUES (
      NEW.user_id,
      'role_assigned',
      'medium',
      'User role assigned: ' || NEW.role_name,
      jsonb_build_object('role', NEW.role_name, 'granted_by', NEW.granted_by)
    );
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' AND OLD.is_active = true AND NEW.is_active = false THEN
    INSERT INTO security_events (user_id, event_type, severity, description, metadata)
    VALUES (
      NEW.user_id,
      'role_revoked',
      'high',
      'User role revoked: ' || NEW.role_name,
      jsonb_build_object('role', NEW.role_name, 'revoked_by', auth.uid())
    );
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$;

CREATE TRIGGER audit_user_roles_changes
  AFTER INSERT OR UPDATE ON user_roles
  FOR EACH ROW EXECUTE FUNCTION audit_security_changes();

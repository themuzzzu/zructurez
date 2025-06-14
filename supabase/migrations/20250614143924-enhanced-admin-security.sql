
-- Enhanced Admin Dashboard SQL Migration with Security Improvements
-- Drop existing tables if they exist to start fresh
DROP TABLE IF EXISTS role_permissions CASCADE;
DROP TABLE IF EXISTS user_roles CASCADE;
DROP TABLE IF EXISTS permissions CASCADE;
DROP TABLE IF EXISTS admin_logs CASCADE;
DROP TABLE IF EXISTS content_moderation CASCADE;
DROP TABLE IF EXISTS system_metrics CASCADE;
DROP TABLE IF EXISTS financial_transactions CASCADE;
DROP TABLE IF EXISTS security_events CASCADE;
DROP TABLE IF EXISTS admin_sessions CASCADE;

-- Create permissions table with enhanced validation
CREATE TABLE permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) UNIQUE NOT NULL CHECK (name ~ '^[a-z_]+$'),
  description TEXT NOT NULL CHECK (length(description) >= 10),
  resource VARCHAR(50) NOT NULL CHECK (resource ~ '^[a-z_]+$'),
  action VARCHAR(50) NOT NULL CHECK (action ~ '^[a-z_]+$'),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user roles table with enhanced security
CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role_name VARCHAR(50) NOT NULL CHECK (role_name IN ('admin', 'moderator', 'business_owner', 'premium_user', 'user')),
  granted_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE CHECK (expires_at IS NULL OR expires_at > granted_at),
  is_active BOOLEAN DEFAULT true,
  reason TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create partial unique index for user roles (prevents duplicate active roles)
CREATE UNIQUE INDEX idx_user_roles_active_unique 
ON user_roles(user_id, role_name) 
WHERE is_active = true;

-- Create role permissions mapping table
CREATE TABLE role_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_name VARCHAR(50) NOT NULL CHECK (role_name IN ('admin', 'moderator', 'business_owner', 'premium_user', 'user')),
  permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(role_name, permission_id)
);

-- Create admin sessions table for session management
CREATE TABLE admin_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_token TEXT NOT NULL UNIQUE,
  ip_address INET,
  user_agent TEXT,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create security events table for comprehensive logging
CREATE TABLE security_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  event_type VARCHAR(100) NOT NULL CHECK (event_type ~ '^[a-z_]+$'),
  severity VARCHAR(20) NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  description TEXT NOT NULL,
  ip_address INET,
  user_agent TEXT,
  metadata JSONB DEFAULT '{}',
  resolved BOOLEAN DEFAULT false,
  resolved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enhanced admin logs table with better structure
CREATE TABLE admin_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  action VARCHAR(100) NOT NULL CHECK (action ~ '^[a-z_]+$'),
  resource_type VARCHAR(50) NOT NULL CHECK (resource_type ~ '^[a-z_]+$'),
  resource_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  session_id UUID REFERENCES admin_sessions(id) ON DELETE SET NULL,
  success BOOLEAN DEFAULT true,
  error_message TEXT,
  execution_time_ms INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enhanced content moderation table
CREATE TABLE content_moderation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type VARCHAR(50) NOT NULL CHECK (content_type IN ('post', 'product', 'service', 'business', 'comment', 'review')),
  content_id UUID NOT NULL,
  reported_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  moderator_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'escalated', 'auto_approved', 'auto_rejected')),
  reason VARCHAR(100) CHECK (length(reason) >= 3),
  moderator_notes TEXT,
  auto_flagged BOOLEAN DEFAULT false,
  severity_level INTEGER DEFAULT 1 CHECK (severity_level BETWEEN 1 AND 10),
  confidence_score DECIMAL(3,2) CHECK (confidence_score BETWEEN 0 AND 1),
  ai_analysis JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  resolved_at TIMESTAMP WITH TIME ZONE,
  
  -- Ensure proper workflow
  CHECK (
    (status = 'pending' AND reviewed_at IS NULL AND resolved_at IS NULL) OR
    (status IN ('approved', 'rejected', 'escalated') AND reviewed_at IS NOT NULL) OR
    (status IN ('approved', 'rejected') AND resolved_at IS NOT NULL)
  )
);

-- Enhanced system metrics table
CREATE TABLE system_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_name VARCHAR(100) NOT NULL CHECK (metric_name ~ '^[a-z0-9_\.]+$'),
  metric_value NUMERIC NOT NULL CHECK (metric_value >= 0),
  metric_type VARCHAR(50) NOT NULL CHECK (metric_type IN ('counter', 'gauge', 'histogram', 'rate')),
  tags JSONB DEFAULT '{}',
  aggregation_period VARCHAR(20) DEFAULT 'instant' CHECK (aggregation_period IN ('instant', 'minute', 'hour', 'day')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enhanced financial transactions table with encryption
CREATE TABLE financial_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  transaction_type VARCHAR(50) NOT NULL CHECK (transaction_type IN ('ad_payment', 'subscription', 'commission', 'refund', 'withdrawal', 'deposit')),
  amount DECIMAL(12,2) NOT NULL CHECK (amount > 0),
  currency VARCHAR(3) DEFAULT 'USD' CHECK (currency ~ '^[A-Z]{3}$'),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded')),
  reference_id UUID,
  external_transaction_id VARCHAR(255),
  payment_method VARCHAR(50) CHECK (payment_method ~ '^[a-z_]+$'),
  stripe_payment_intent_id VARCHAR(255),
  encrypted_payment_data TEXT,
  notes TEXT,
  metadata JSONB DEFAULT '{}',
  processed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  processed_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  
  -- Ensure proper status workflow
  CHECK (
    (status = 'pending' AND processed_at IS NULL) OR
    (status IN ('completed', 'failed', 'cancelled', 'refunded') AND processed_at IS NOT NULL)
  )
);

-- Insert enhanced permissions with proper validation
INSERT INTO permissions (name, description, resource, action) VALUES
('manage_users', 'Full user account management including creation, deletion, and role assignment', 'users', 'manage'),
('view_users', 'View user account information and basic details', 'users', 'view'),
('moderate_content', 'Review, approve, reject, and escalate user-generated content', 'content', 'moderate'),
('manage_content', 'Full content management including deletion and editing', 'content', 'manage'),
('manage_ads', 'Create, edit, delete, and configure advertisements', 'ads', 'manage'),
('approve_ads', 'Approve or reject advertisement submissions', 'ads', 'approve'),
('view_analytics', 'Access system analytics and performance metrics', 'analytics', 'view'),
('manage_analytics', 'Configure analytics settings and export reports', 'analytics', 'manage'),
('manage_finances', 'View and manage financial transactions and reports', 'finances', 'manage'),
('view_finances', 'View financial reports and transaction history', 'finances', 'view'),
('system_admin', 'Full system administration including configuration changes', 'system', 'admin'),
('audit_logs', 'View and analyze system audit logs', 'logs', 'view'),
('security_monitor', 'Monitor security events and respond to threats', 'security', 'monitor'),
('business_verify', 'Verify and approve business registrations', 'business', 'verify');

-- Insert role permissions with proper hierarchy
INSERT INTO role_permissions (role_name, permission_id) 
SELECT 'admin', id FROM permissions;

INSERT INTO role_permissions (role_name, permission_id) 
SELECT 'moderator', id FROM permissions 
WHERE name IN ('moderate_content', 'view_analytics', 'view_users', 'audit_logs');

INSERT INTO role_permissions (role_name, permission_id) 
SELECT 'business_owner', id FROM permissions 
WHERE name IN ('view_analytics');

-- Create comprehensive indexes for performance and security
CREATE INDEX idx_user_roles_user_active ON user_roles(user_id, is_active);
CREATE INDEX idx_user_roles_role_active ON user_roles(role_name, is_active);
CREATE INDEX idx_user_roles_expires ON user_roles(expires_at) WHERE expires_at IS NOT NULL;

CREATE INDEX idx_admin_sessions_user_active ON admin_sessions(user_id, is_active);
CREATE INDEX idx_admin_sessions_expires ON admin_sessions(expires_at);
CREATE INDEX idx_admin_sessions_token ON admin_sessions(session_token);

CREATE INDEX idx_admin_logs_admin_time ON admin_logs(admin_id, created_at);
CREATE INDEX idx_admin_logs_resource ON admin_logs(resource_type, resource_id);
CREATE INDEX idx_admin_logs_action ON admin_logs(action, created_at);

CREATE INDEX idx_security_events_user_time ON security_events(user_id, created_at);
CREATE INDEX idx_security_events_type_severity ON security_events(event_type, severity);
CREATE INDEX idx_security_events_unresolved ON security_events(resolved, created_at) WHERE resolved = false;

CREATE INDEX idx_content_moderation_status ON content_moderation(status, created_at);
CREATE INDEX idx_content_moderation_content ON content_moderation(content_type, content_id);
CREATE INDEX idx_content_moderation_moderator ON content_moderation(moderator_id, created_at);
CREATE INDEX idx_content_moderation_severity ON content_moderation(severity_level, created_at);

CREATE INDEX idx_system_metrics_name_time ON system_metrics(metric_name, created_at);
CREATE INDEX idx_system_metrics_type_time ON system_metrics(metric_type, created_at);

CREATE INDEX idx_financial_transactions_user_status ON financial_transactions(user_id, status);
CREATE INDEX idx_financial_transactions_type_time ON financial_transactions(transaction_type, created_at);
CREATE INDEX idx_financial_transactions_amount ON financial_transactions(amount, created_at);
CREATE INDEX idx_financial_transactions_reference ON financial_transactions(reference_id);

-- Enable RLS on all tables
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_moderation ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_transactions ENABLE ROW LEVEL SECURITY;

-- Enhanced RLS policies with proper role-based access control
-- User Roles policies
CREATE POLICY "Admins can manage all user roles" ON user_roles
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur 
      JOIN role_permissions rp ON ur.role_name = rp.role_name
      JOIN permissions p ON rp.permission_id = p.id
      WHERE ur.user_id = auth.uid() AND ur.is_active = true 
      AND p.name = 'manage_users'
    )
  );

CREATE POLICY "Users can view their own roles" ON user_roles
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- Permissions policies (read-only for most users)
CREATE POLICY "Authenticated users can view permissions" ON permissions
  FOR SELECT TO authenticated
  USING (true);

-- Role permissions policies
CREATE POLICY "Authenticated users can view role permissions" ON role_permissions
  FOR SELECT TO authenticated
  USING (true);

-- Admin sessions policies
CREATE POLICY "Users can manage their own sessions" ON admin_sessions
  FOR ALL TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all sessions" ON admin_sessions
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur 
      WHERE ur.user_id = auth.uid() AND ur.role_name = 'admin' AND ur.is_active = true
    )
  );

-- Admin logs policies
CREATE POLICY "Admins can view admin logs" ON admin_logs
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur 
      JOIN role_permissions rp ON ur.role_name = rp.role_name
      JOIN permissions p ON rp.permission_id = p.id
      WHERE ur.user_id = auth.uid() AND ur.is_active = true 
      AND p.name = 'audit_logs'
    )
  );

CREATE POLICY "System can insert admin logs" ON admin_logs
  FOR INSERT TO authenticated
  WITH CHECK (admin_id = auth.uid());

-- Security events policies
CREATE POLICY "Security team can manage security events" ON security_events
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur 
      JOIN role_permissions rp ON ur.role_name = rp.role_name
      JOIN permissions p ON rp.permission_id = p.id
      WHERE ur.user_id = auth.uid() AND ur.is_active = true 
      AND p.name = 'security_monitor'
    )
  );

CREATE POLICY "Users can view their own security events" ON security_events
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- Content moderation policies
CREATE POLICY "Moderators can manage content moderation" ON content_moderation
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur 
      JOIN role_permissions rp ON ur.role_name = rp.role_name
      JOIN permissions p ON rp.permission_id = p.id
      WHERE ur.user_id = auth.uid() AND ur.is_active = true 
      AND p.name IN ('moderate_content', 'manage_content')
    )
  );

CREATE POLICY "Users can report content" ON content_moderation
  FOR INSERT TO authenticated
  WITH CHECK (reported_by = auth.uid());

-- System metrics policies
CREATE POLICY "Analytics viewers can see metrics" ON system_metrics
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur 
      JOIN role_permissions rp ON ur.role_name = rp.role_name
      JOIN permissions p ON rp.permission_id = p.id
      WHERE ur.user_id = auth.uid() AND ur.is_active = true 
      AND p.name IN ('view_analytics', 'manage_analytics')
    )
  );

CREATE POLICY "System can insert metrics" ON system_metrics
  FOR INSERT TO authenticated
  WITH CHECK (true);

-- Financial transactions policies
CREATE POLICY "Finance team can manage transactions" ON financial_transactions
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur 
      JOIN role_permissions rp ON ur.role_name = rp.role_name
      JOIN permissions p ON rp.permission_id = p.id
      WHERE ur.user_id = auth.uid() AND ur.is_active = true 
      AND p.name = 'manage_finances'
    )
  );

CREATE POLICY "Users can view their own transactions" ON financial_transactions
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "System can insert transactions" ON financial_transactions
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Create security functions
CREATE OR REPLACE FUNCTION log_security_event(
  p_user_id UUID,
  p_event_type TEXT,
  p_severity TEXT,
  p_description TEXT,
  p_metadata JSONB DEFAULT '{}'
) RETURNS UUID AS $$
DECLARE
  event_id UUID;
BEGIN
  INSERT INTO security_events (user_id, event_type, severity, description, metadata)
  VALUES (p_user_id, p_event_type, p_severity, p_description, p_metadata)
  RETURNING id INTO event_id;
  
  RETURN event_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to check user permissions
CREATE OR REPLACE FUNCTION user_has_permission(
  p_user_id UUID,
  p_permission_name TEXT
) RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM user_roles ur 
    JOIN role_permissions rp ON ur.role_name = rp.role_name
    JOIN permissions p ON rp.permission_id = p.id
    WHERE ur.user_id = p_user_id 
    AND ur.is_active = true 
    AND (ur.expires_at IS NULL OR ur.expires_at > NOW())
    AND p.name = p_permission_name
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to clean expired sessions
CREATE OR REPLACE FUNCTION cleanup_expired_sessions() RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  UPDATE admin_sessions 
  SET is_active = false 
  WHERE expires_at < NOW() AND is_active = true;
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_permissions_updated_at BEFORE UPDATE ON permissions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_roles_updated_at BEFORE UPDATE ON user_roles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_role_permissions_updated_at BEFORE UPDATE ON role_permissions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create audit trigger for sensitive operations
CREATE OR REPLACE FUNCTION audit_user_role_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM log_security_event(
      NEW.user_id,
      'role_assigned',
      'medium',
      'User role assigned: ' || NEW.role_name,
      jsonb_build_object('role', NEW.role_name, 'granted_by', NEW.granted_by)
    );
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.is_active = true AND NEW.is_active = false THEN
      PERFORM log_security_event(
        NEW.user_id,
        'role_revoked',
        'medium',
        'User role revoked: ' || NEW.role_name,
        jsonb_build_object('role', NEW.role_name)
      );
    END IF;
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER audit_user_roles_trigger
  AFTER INSERT OR UPDATE ON user_roles
  FOR EACH ROW EXECUTE FUNCTION audit_user_role_changes();

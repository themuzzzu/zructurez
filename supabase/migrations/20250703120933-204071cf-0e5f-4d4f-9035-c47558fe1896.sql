
-- Disable email confirmation requirement
UPDATE auth.config 
SET email_confirm_change_enabled = false;

-- Also disable email change confirmation 
UPDATE auth.config 
SET email_change_confirm_status = 0;

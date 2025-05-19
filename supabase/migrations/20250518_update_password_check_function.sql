
-- Create or replace the function to check hashed passwords
CREATE OR REPLACE FUNCTION public.check_poll_password_hash(poll_id UUID, password_attempt TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  correct_password TEXT;
  is_poll_private BOOLEAN;
BEGIN
  -- Get password and private status for the poll
  SELECT password, is_private INTO correct_password, is_poll_private
  FROM public.polls
  WHERE id = poll_id;
  
  -- If poll is not private, always return true
  IF NOT is_poll_private THEN
    RETURN true;
  END IF;
  
  -- If poll is private, check password (both are now hashed)
  RETURN password_attempt = correct_password;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

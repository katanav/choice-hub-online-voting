
-- We need a temporary function to hash passwords the same way our app does
CREATE OR REPLACE FUNCTION temp_hash_password(input_text TEXT)
RETURNS TEXT AS $$
BEGIN
  -- Using SHA-256 for hashing (matches our app implementation)
  RETURN encode(digest(input_text, 'sha256'), 'hex');
END;
$$ LANGUAGE plpgsql;

-- Update existing poll passwords to be hashed
UPDATE public.polls 
SET password = temp_hash_password(password)
WHERE password IS NOT NULL AND is_private = true;

-- Drop the temporary function
DROP FUNCTION temp_hash_password;

-- ENUM: code_challenge_method
-- Schema: auth
-- Description: PKCE methods

CREATE TYPE auth.code_challenge_method AS ENUM ('s256', 'plain');

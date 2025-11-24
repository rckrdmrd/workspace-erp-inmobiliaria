-- =====================================================
-- Table: auth.users
-- Description: Tabla de usuarios del sistema con autenticación y roles
-- Created: 2025-10-27
--
-- 📚 Documentación:
-- Requerimiento: docs/01-requerimientos/01-autenticacion-autorizacion/RF-AUTH-001-roles.md
-- Requerimiento: docs/01-requerimientos/01-autenticacion-autorizacion/RF-AUTH-002-estados-cuenta.md
-- Especificación: docs/02-especificaciones-tecnicas/01-autenticacion-autorizacion/ET-AUTH-001-rbac.md
-- Especificación: docs/02-especificaciones-tecnicas/01-autenticacion-autorizacion/ET-AUTH-002-estados-cuenta.md
-- =====================================================

SET search_path TO auth, public;

DROP TABLE IF EXISTS auth.users CASCADE;

CREATE TABLE auth.users (
    -- Core Supabase-compatible columns
    instance_id uuid,
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    aud varchar(255) DEFAULT 'authenticated',
    role varchar(255),
    email text NOT NULL,
    encrypted_password text,
    email_confirmed_at timestamp with time zone,
    invited_at timestamp with time zone,
    confirmation_token varchar(255),
    confirmation_sent_at timestamp with time zone,
    recovery_token varchar(255),
    recovery_sent_at timestamp with time zone,
    email_change_token_new varchar(255),
    email_change varchar(255),
    email_change_sent_at timestamp with time zone,
    last_sign_in_at timestamp with time zone,
    raw_app_meta_data jsonb,
    raw_user_meta_data jsonb DEFAULT '{}'::jsonb,
    is_super_admin boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT gamilit.now_mexico(),
    updated_at timestamp with time zone DEFAULT gamilit.now_mexico(),
    phone varchar(15),
    phone_confirmed_at timestamp with time zone,
    phone_change varchar(15),
    phone_change_token varchar(255),
    phone_change_sent_at timestamp with time zone,
    confirmed_at timestamp with time zone,
    email_change_token_current varchar(255),
    email_change_confirm_status smallint DEFAULT 0,
    banned_until timestamp with time zone,
    reauthentication_token varchar(255),
    reauthentication_sent_at timestamp with time zone,
    is_sso_user boolean DEFAULT false,
    deleted_at timestamp with time zone,
    -- GAMILIT custom columns
    gamilit_role auth_management.gamilit_role DEFAULT 'student'::auth_management.gamilit_role,

    -- User account status (FE-051 Admin Portal)
    status VARCHAR(50) NOT NULL DEFAULT 'active'
);

ALTER TABLE auth.users OWNER TO gamilit_user;

-- =====================================================
-- Constraints
-- =====================================================

-- Primary Key
ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);

-- Unique Constraints
ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_email_key UNIQUE (email);

-- Status constraint (FE-051 Admin Portal)
ALTER TABLE auth.users
    ADD CONSTRAINT users_status_check
    CHECK (status IN ('active', 'inactive', 'suspended', 'deleted'));

-- =====================================================
-- Indexes
-- =====================================================

CREATE INDEX idx_auth_users_email ON auth.users USING btree (email);
CREATE INDEX idx_auth_users_role ON auth.users USING btree (role);
CREATE INDEX idx_auth_users_gamilit_role ON auth.users USING btree (gamilit_role);

-- =====================================================
-- Comments
-- =====================================================

COMMENT ON TABLE auth.users IS 'Tabla de usuarios del sistema con autenticación y roles';
COMMENT ON COLUMN auth.users.id IS 'Identificador único del usuario (UUID)';
COMMENT ON COLUMN auth.users.email IS 'Correo electrónico único del usuario';
COMMENT ON COLUMN auth.users.encrypted_password IS 'Contraseña encriptada del usuario';
COMMENT ON COLUMN auth.users.role IS 'Rol del usuario en el sistema (student, instructor, admin, etc.)';
COMMENT ON COLUMN auth.users.email_confirmed_at IS 'Fecha y hora de confirmación del email';
COMMENT ON COLUMN auth.users.last_sign_in_at IS 'Fecha y hora del último inicio de sesión';
COMMENT ON COLUMN auth.users.raw_user_meta_data IS 'Metadatos adicionales del usuario en formato JSON';
COMMENT ON COLUMN auth.users.deleted_at IS 'Fecha y hora de eliminación lógica (soft delete)';
COMMENT ON COLUMN auth.users.created_at IS 'Fecha y hora de creación del registro';
COMMENT ON COLUMN auth.users.updated_at IS 'Fecha y hora de última actualización del registro';

-- Status column (FE-051 Admin Portal)
COMMENT ON COLUMN auth.users.status IS 'User account status. Values: active (normal user, can login), inactive (temporarily deactivated), suspended (administratively suspended), deleted (soft deleted for audit trail)';

-- =====================================================
-- Grants
-- =====================================================

GRANT ALL ON TABLE auth.users TO gamilit_user;

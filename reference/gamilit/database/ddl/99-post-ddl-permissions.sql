-- =====================================================
-- POST-DDL: Grant Permissions to gamilit_user
-- =====================================================
-- Description: Otorga todos los permisos necesarios a gamilit_user
-- Execution: DEBE ejecutarse DESPUÉS de crear todas las tablas DDL
-- Created: 2025-11-02
-- Agent: ATLAS-DATABASE
-- =====================================================

-- Grant USAGE on all schemas
GRANT USAGE ON SCHEMA
    auth,
    auth_management,
    system_configuration,
    gamification_system,
    educational_content,
    content_management,
    social_features,
    progress_tracking,
    audit_logging,
    gamilit,
    public
TO gamilit_user;

-- Grant ALL PRIVILEGES on tables for each schema
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA auth TO gamilit_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA auth_management TO gamilit_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA system_configuration TO gamilit_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA gamification_system TO gamilit_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA educational_content TO gamilit_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA content_management TO gamilit_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA social_features TO gamilit_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA progress_tracking TO gamilit_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA audit_logging TO gamilit_user;

-- Grant ALL PRIVILEGES on sequences for each schema
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA auth TO gamilit_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA auth_management TO gamilit_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA system_configuration TO gamilit_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA gamification_system TO gamilit_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA educational_content TO gamilit_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA content_management TO gamilit_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA social_features TO gamilit_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA progress_tracking TO gamilit_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA audit_logging TO gamilit_user;

-- Grant EXECUTE on all functions
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA gamilit TO gamilit_user;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA auth TO gamilit_user;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO gamilit_user;

-- Set default privileges for future objects
-- Tables
ALTER DEFAULT PRIVILEGES IN SCHEMA auth GRANT ALL ON TABLES TO gamilit_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA auth_management GRANT ALL ON TABLES TO gamilit_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA system_configuration GRANT ALL ON TABLES TO gamilit_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA gamification_system GRANT ALL ON TABLES TO gamilit_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA educational_content GRANT ALL ON TABLES TO gamilit_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA content_management GRANT ALL ON TABLES TO gamilit_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA social_features GRANT ALL ON TABLES TO gamilit_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA progress_tracking GRANT ALL ON TABLES TO gamilit_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA audit_logging GRANT ALL ON TABLES TO gamilit_user;

-- Sequences
ALTER DEFAULT PRIVILEGES IN SCHEMA auth GRANT ALL ON SEQUENCES TO gamilit_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA auth_management GRANT ALL ON SEQUENCES TO gamilit_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA system_configuration GRANT ALL ON SEQUENCES TO gamilit_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA gamification_system GRANT ALL ON SEQUENCES TO gamilit_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA educational_content GRANT ALL ON SEQUENCES TO gamilit_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA content_management GRANT ALL ON SEQUENCES TO gamilit_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA social_features GRANT ALL ON SEQUENCES TO gamilit_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA progress_tracking GRANT ALL ON SEQUENCES TO gamilit_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA audit_logging GRANT ALL ON SEQUENCES TO gamilit_user;

-- Functions
ALTER DEFAULT PRIVILEGES IN SCHEMA gamilit GRANT EXECUTE ON FUNCTIONS TO gamilit_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA auth GRANT EXECUTE ON FUNCTIONS TO gamilit_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT EXECUTE ON FUNCTIONS TO gamilit_user;

-- Verification
SELECT 'Permisos otorgados exitosamente a gamilit_user' as status;

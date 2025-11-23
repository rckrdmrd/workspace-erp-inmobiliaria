#!/bin/bash

###############################################################################
# P0-000: Pre-Migration Backup Script
#
# Creates a backup of gamification_system.user_stats before running
# the MayaRank migration (P0-001).
#
# Usage:
#   chmod +x P0-000-pre-migration-backup.sh
#   ./P0-000-pre-migration-backup.sh
#
# Environment variables:
#   DB_HOST       - PostgreSQL host (default: localhost)
#   DB_PORT       - PostgreSQL port (default: 5432)
#   DB_NAME       - Database name (default: gamilit_platform)
#   DB_USER       - Database user (default: gamilit_user)
#   DB_PASSWORD   - Database password (required)
###############################################################################

set -e  # Exit on error
set -u  # Exit on undefined variable

# Configuration
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
DB_NAME="${DB_NAME:-gamilit_platform}"
DB_USER="${DB_USER:-gamilit_user}"

# Validate required variables
if [ -z "${DB_PASSWORD:-}" ]; then
    echo "ERROR: DB_PASSWORD environment variable is required"
    echo "Usage: DB_PASSWORD='your_password' ./P0-000-pre-migration-backup.sh"
    exit 1
fi

# Backup directory
BACKUP_DIR="./backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/user_stats_backup_${TIMESTAMP}.sql"

# Create backup directory if it doesn't exist
mkdir -p "${BACKUP_DIR}"

echo "========================================"
echo "PRE-MIGRATION BACKUP"
echo "========================================"
echo "Database: ${DB_NAME}"
echo "Host: ${DB_HOST}:${DB_PORT}"
echo "User: ${DB_USER}"
echo "Backup file: ${BACKUP_FILE}"
echo "========================================"
echo ""

# Export password for pg_dump
export PGPASSWORD="${DB_PASSWORD}"

# Create backup of user_stats table
echo "Creating backup of gamification_system.user_stats..."
pg_dump \
    -h "${DB_HOST}" \
    -p "${DB_PORT}" \
    -U "${DB_USER}" \
    -d "${DB_NAME}" \
    --table=gamification_system.user_stats \
    --data-only \
    --column-inserts \
    > "${BACKUP_FILE}"

if [ $? -eq 0 ]; then
    echo "✓ Backup created successfully: ${BACKUP_FILE}"
    echo ""

    # Show backup file size
    BACKUP_SIZE=$(du -h "${BACKUP_FILE}" | cut -f1)
    echo "Backup size: ${BACKUP_SIZE}"

    # Count records in backup
    RECORD_COUNT=$(grep -c "INSERT INTO" "${BACKUP_FILE}" || true)
    echo "Records backed up: ${RECORD_COUNT}"

    echo ""
    echo "========================================"
    echo "BACKUP COMPLETED SUCCESSFULLY"
    echo "========================================"
    echo "You can now proceed with the migration:"
    echo "  psql -h ${DB_HOST} -p ${DB_PORT} -U ${DB_USER} -d ${DB_NAME} -f P0-001-migrate-maya-rank-values.sql"
    echo ""
else
    echo "✗ Backup failed!"
    exit 1
fi

# Cleanup
unset PGPASSWORD

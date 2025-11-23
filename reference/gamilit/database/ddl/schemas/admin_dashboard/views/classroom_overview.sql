-- =============================================================================
-- VIEW: admin_dashboard.classroom_overview
-- =============================================================================
-- Purpose: Provides comprehensive overview of classroom statistics and status
-- Priority: P2 - Analytics view for classroom management
-- Responsibility: SA-DB-031
-- Created: 2025-11-02
-- Updated: 2025-11-11 - Migrado de public a admin_dashboard
-- =============================================================================

CREATE OR REPLACE VIEW admin_dashboard.classroom_overview AS
SELECT
    c.id AS classroom_id,
    c.name AS classroom_name,
    c.description AS classroom_description,
    t.id AS teacher_id,
    t.display_name AS teacher_name,
    COUNT(DISTINCT u.id) AS total_students,
    COUNT(DISTINCT CASE WHEN u.status = 'ACTIVE' THEN u.id END) AS active_students,
    COUNT(DISTINCT CASE WHEN u.status = 'INACTIVE' THEN u.id END) AS inactive_students,
    COUNT(DISTINCT a.id) AS total_assignments,
    COUNT(DISTINCT CASE WHEN a.due_date > NOW() THEN a.id END) AS pending_assignments,
    COUNT(DISTINCT CASE WHEN a.due_date <= NOW() AND a.due_date > NOW() - INTERVAL '7 days' THEN a.id END) AS upcoming_deadline_assignments,
    COUNT(DISTINCT ex.id) AS total_exercises,
    ROUND(AVG(CASE WHEN up.progress_percent IS NOT NULL THEN up.progress_percent ELSE 0 END), 2) AS avg_class_progress_percent,
    MAX(c.updated_at) AS last_updated,
    c.created_at AS classroom_created_at,
    CASE
        WHEN COUNT(DISTINCT u.id) = 0 THEN 'EMPTY'
        WHEN COUNT(DISTINCT CASE WHEN u.status = 'ACTIVE' THEN u.id END) > 0 THEN 'ACTIVE'
        ELSE 'INACTIVE'
    END AS classroom_status
FROM
    social_features.classrooms c
    LEFT JOIN auth_management.profiles t ON c.teacher_id = t.id
    LEFT JOIN social_features.classroom_members cm ON c.id = cm.classroom_id
    LEFT JOIN auth_management.profiles u ON cm.student_id = u.id
    LEFT JOIN educational_content.assignments a ON a.classroom_id = c.id
    LEFT JOIN educational_content.exercises ex ON ex.module_id IN (
        SELECT id FROM educational_content.modules
    )
    LEFT JOIN progress_tracking.user_progress up ON u.id = up.user_id
WHERE
    c.is_deleted = FALSE
GROUP BY
    c.id, c.name, c.description, c.created_at, c.updated_at, t.id, t.display_name;

-- Documentation comment
COMMENT ON VIEW admin_dashboard.classroom_overview IS
'Provides a comprehensive overview of classroom statistics including student count, assignments, and progress.
Columns:
  - classroom_id: Unique identifier of the classroom
  - classroom_name: Name of the classroom
  - classroom_description: Description of the classroom
  - teacher_id: ID of the teacher managing the classroom
  - teacher_name: Display name of the teacher
  - total_students: Total number of students enrolled
  - active_students: Number of currently active students
  - inactive_students: Number of inactive students
  - total_assignments: Total number of assignments in the classroom
  - pending_assignments: Number of assignments with future due dates
  - upcoming_deadline_assignments: Assignments due in the next 7 days
  - total_exercises: Total number of exercises
  - avg_class_progress_percent: Average progress of the classroom
  - last_updated: Most recent update timestamp
  - classroom_created_at: When the classroom was created
  - classroom_status: Current status (EMPTY, ACTIVE, INACTIVE)
Usage:
  SELECT * FROM classroom_overview WHERE classroom_status = ''ACTIVE'';
  SELECT classroom_name, total_students, avg_class_progress_percent
  FROM classroom_overview
  ORDER BY avg_class_progress_percent DESC;
  SELECT * FROM classroom_overview WHERE pending_assignments > 0;';

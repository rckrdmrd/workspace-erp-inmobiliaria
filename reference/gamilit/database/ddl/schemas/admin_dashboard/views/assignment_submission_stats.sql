-- =============================================================================
-- VIEW: admin_dashboard.assignment_submission_stats
-- =============================================================================
-- Purpose: Provides comprehensive statistics on assignment submissions
-- Priority: P2 - Analytics view for assignment tracking
-- Responsibility: SA-DB-031
-- Created: 2025-11-02
-- Updated: 2025-11-08 - Corregidas referencias de schemas y tablas
-- Updated: 2025-11-11 - Migrado de public a admin_dashboard
-- =============================================================================

CREATE OR REPLACE VIEW admin_dashboard.assignment_submission_stats AS
SELECT
    a.id AS assignment_id,
    a.title AS assignment_title,
    a.assignment_type,
    a.total_points AS assignment_max_points,
    c.id AS classroom_id,
    c.name AS classroom_name,
    COUNT(DISTINCT asub.id) AS total_submissions,
    COUNT(DISTINCT CASE WHEN asub.status = 'submitted' THEN asub.id END) AS completed_submissions,
    COUNT(DISTINCT CASE WHEN asub.status = 'in_progress' THEN asub.id END) AS in_progress_submissions,
    COUNT(DISTINCT CASE WHEN asub.status = 'not_started' THEN asub.id END) AS not_started_submissions,
    COUNT(DISTINCT CASE WHEN asub.status = 'graded' THEN asub.id END) AS graded_submissions,
    ROUND(
        COUNT(DISTINCT CASE WHEN asub.status IN ('submitted', 'graded') THEN asub.id END)::NUMERIC /
        NULLIF(COUNT(DISTINCT cm.student_id), 0) * 100,
        2
    ) AS submission_rate_percent,
    ROUND(AVG(CASE WHEN asub.score IS NOT NULL THEN asub.score ELSE NULL END), 2) AS avg_score,
    MAX(CASE WHEN asub.score IS NOT NULL THEN asub.score ELSE NULL END) AS max_score_achieved,
    MIN(CASE WHEN asub.score IS NOT NULL THEN asub.score ELSE NULL END) AS min_score_achieved,
    a.created_at AS assignment_created_at,
    a.due_date AS assignment_due_date,
    ac.deadline_override AS classroom_deadline_override,
    COUNT(DISTINCT cm.student_id) AS total_students_in_classroom
FROM
    educational_content.assignments a
    INNER JOIN social_features.assignment_classrooms ac ON a.id = ac.assignment_id
    INNER JOIN social_features.classrooms c ON ac.classroom_id = c.id
    LEFT JOIN social_features.classroom_members cm ON c.id = cm.classroom_id
    LEFT JOIN educational_content.assignment_submissions asub
        ON a.id = asub.assignment_id AND cm.student_id = asub.student_id
WHERE
    a.is_published = TRUE
GROUP BY
    a.id, a.title, a.assignment_type, a.total_points,
    c.id, c.name,
    a.created_at, a.due_date, ac.deadline_override;

-- Documentation comment
COMMENT ON VIEW admin_dashboard.assignment_submission_stats IS
'Aggregates assignment submission statistics including submission rates, grades, and completion status.

CORRECTED (2025-11-08):
- Fixed schema references (social_features.classrooms, educational_content.assignment_submissions)
- Removed non-existent tables (exercise_grades, gamilit.users)
- Fixed M2M relationships through assignment_classrooms and classroom_members

Columns:
  - assignment_id: Unique identifier of the assignment
  - assignment_title: Title of the assignment
  - assignment_type: Type (practice, quiz, exam, homework)
  - assignment_max_points: Maximum points for the assignment
  - classroom_id: ID of the classroom
  - classroom_name: Name of the classroom
  - total_submissions: Total number of submissions (all statuses)
  - completed_submissions: Number of submitted assignments (status=submitted)
  - in_progress_submissions: Number of in-progress assignments
  - not_started_submissions: Number of not started assignments
  - graded_submissions: Number of graded submissions
  - submission_rate_percent: Percentage of students who submitted (submitted + graded)
  - avg_score: Average score of graded submissions
  - max_score_achieved: Highest score received
  - min_score_achieved: Lowest score received
  - assignment_created_at: When the assignment was created
  - assignment_due_date: Global due date for the assignment
  - classroom_deadline_override: Classroom-specific deadline override (if any)
  - total_students_in_classroom: Total number of students in the classroom

Usage:
  -- Get stats for a specific classroom
  SELECT * FROM assignment_submission_stats
  WHERE classroom_id = ''<classroom_id>'';

  -- Find assignments with low submission rates
  SELECT assignment_id, assignment_title, submission_rate_percent, classroom_name
  FROM assignment_submission_stats
  WHERE submission_rate_percent < 75
  ORDER BY submission_rate_percent ASC;

  -- Compare performance across classrooms for same assignment
  SELECT assignment_title, classroom_name, avg_score, total_students_in_classroom
  FROM assignment_submission_stats
  WHERE assignment_id = ''<assignment_id>''
  ORDER BY avg_score DESC;';

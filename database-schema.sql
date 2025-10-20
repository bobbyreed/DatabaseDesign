-- Database Design Course - Attendance Management System
-- PostgreSQL Schema for Neon Database

-- Students table
CREATE TABLE IF NOT EXISTS students (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    full_name VARCHAR(200) NOT NULL,
    card_data TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(first_name, last_name)
);

-- Indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_students_name ON students(last_name, first_name);
CREATE INDEX IF NOT EXISTS idx_students_full_name ON students(full_name);
CREATE INDEX IF NOT EXISTS idx_students_card_data ON students(card_data) WHERE card_data IS NOT NULL;

-- Attendance table
CREATE TABLE IF NOT EXISTS attendance (
    id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    attendance_date DATE NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_late BOOLEAN DEFAULT false,
    UNIQUE(student_id, attendance_date)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_attendance_student ON attendance(student_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(attendance_date);
CREATE INDEX IF NOT EXISTS idx_attendance_student_date ON attendance(student_id, attendance_date);
CREATE INDEX IF NOT EXISTS idx_attendance_is_late ON attendance(is_late);

-- Comments for documentation
COMMENT ON TABLE students IS 'Student roster for the course';
COMMENT ON COLUMN students.card_data IS 'Raw magnetic stripe card data for card swipe registration';
COMMENT ON TABLE attendance IS 'Daily attendance records';
COMMENT ON COLUMN attendance.is_late IS 'Whether student arrived late to class';

-- Sample queries for reference

-- Get all students alphabetically
-- SELECT * FROM students ORDER BY last_name, first_name;

-- Get attendance for a specific date
-- SELECT s.*, a.timestamp, a.is_late
-- FROM students s
-- LEFT JOIN attendance a ON s.id = a.student_id AND a.attendance_date = '2025-01-13'
-- ORDER BY s.last_name, s.first_name;

-- Get attendance overview for all students across all dates
-- SELECT
--     s.id,
--     s.full_name,
--     a.attendance_date,
--     a.is_late
-- FROM students s
-- LEFT JOIN attendance a ON s.id = a.student_id
-- ORDER BY s.last_name, s.first_name, a.attendance_date;

-- Get attendance statistics
-- SELECT
--     s.full_name,
--     COUNT(a.id) as classes_attended,
--     SUM(CASE WHEN a.is_late THEN 1 ELSE 0 END) as times_late
-- FROM students s
-- LEFT JOIN attendance a ON s.id = a.student_id
-- GROUP BY s.id, s.full_name
-- ORDER BY s.last_name, s.first_name;

-- Clear all data (for new semester)
-- DELETE FROM attendance;
-- DELETE FROM students;
-- ALTER SEQUENCE students_id_seq RESTART WITH 1;
-- ALTER SEQUENCE attendance_id_seq RESTART WITH 1;

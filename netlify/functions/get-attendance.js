/**
 * Get Attendance
 * GET /get-attendance?date=YYYY-MM-DD
 * Fetch attendance for a specific date
 */

const { getDB, successResponse, errorResponse, handleOptions } = require('./db-config');

exports.handler = async (event, context) => {
    // Handle preflight
    if (event.httpMethod === 'OPTIONS') {
        return handleOptions();
    }

    // Only accept GET
    if (event.httpMethod !== 'GET') {
        return errorResponse(new Error('Method not allowed'), 405);
    }

    try {
        const sql = getDB();
        const date = event.queryStringParameters?.date;

        if (!date) {
            return errorResponse(new Error('Date parameter is required'), 400);
        }

        // Get all students with their attendance status for this date
        const attendance = await sql`
            SELECT
                s.id,
                s.first_name,
                s.last_name,
                s.full_name,
                a.id as attendance_id,
                a.timestamp,
                a.is_late,
                CASE
                    WHEN a.id IS NOT NULL THEN true
                    ELSE false
                END as present
            FROM students s
            LEFT JOIN attendance a ON s.id = a.student_id AND a.attendance_date = ${date}
            ORDER BY s.last_name, s.first_name
        `;

        return successResponse({
            date,
            attendance,
            stats: {
                total: attendance.length,
                present: attendance.filter(a => a.present).length,
                absent: attendance.filter(a => !a.present).length
            }
        });

    } catch (error) {
        return errorResponse(error);
    }
};

/**
 * Get Attendance History
 * GET /get-attendance-history
 * Fetch all dates with attendance records
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

        // Get all unique dates with attendance records
        const dates = await sql`
            SELECT DISTINCT
                attendance_date as date,
                COUNT(DISTINCT student_id) as students_present,
                SUM(CASE WHEN is_late THEN 1 ELSE 0 END) as students_late
            FROM attendance
            GROUP BY attendance_date
            ORDER BY attendance_date DESC
        `;

        return successResponse({
            dates,
            count: dates.length
        });

    } catch (error) {
        return errorResponse(error);
    }
};

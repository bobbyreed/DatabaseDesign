/**
 * Mark Attendance
 * POST /mark-attendance - Mark student present/late
 * DELETE /mark-attendance - Mark student absent
 */

const { getDB, successResponse, errorResponse, handleOptions } = require('./db-config');

exports.handler = async (event, context) => {
    // Handle preflight
    if (event.httpMethod === 'OPTIONS') {
        return handleOptions();
    }

    try {
        const sql = getDB();
        const { firstName, lastName, date, isLate } = JSON.parse(event.body);

        if (!firstName || !lastName || !date) {
            return errorResponse(new Error('First name, last name, and date are required'), 400);
        }

        // Find student
        const student = await sql`
            SELECT id, full_name
            FROM students
            WHERE first_name = ${firstName} AND last_name = ${lastName}
        `;

        if (student.length === 0) {
            return errorResponse(new Error(`Student ${firstName} ${lastName} not found`), 404);
        }

        const studentId = student[0].id;

        if (event.httpMethod === 'POST') {
            // Mark present/late
            const result = await sql`
                INSERT INTO attendance (student_id, attendance_date, is_late)
                VALUES (${studentId}, ${date}, ${isLate || false})
                ON CONFLICT (student_id, attendance_date)
                DO UPDATE SET
                    is_late = ${isLate || false},
                    timestamp = CURRENT_TIMESTAMP
                RETURNING id, student_id, attendance_date, is_late, timestamp
            `;

            return successResponse({
                message: `${student[0].full_name} marked ${isLate ? 'late' : 'present'} for ${date}`,
                attendance: result[0]
            });

        } else if (event.httpMethod === 'DELETE') {
            // Mark absent (delete record)
            const result = await sql`
                DELETE FROM attendance
                WHERE student_id = ${studentId} AND attendance_date = ${date}
                RETURNING id
            `;

            return successResponse({
                message: `${student[0].full_name} marked absent for ${date}`,
                deleted: result.length > 0
            });

        } else {
            return errorResponse(new Error('Method not allowed'), 405);
        }

    } catch (error) {
        return errorResponse(error);
    }
};

/**
 * Get Students
 * GET /get-students
 * Fetch all registered students
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

        // Fetch all students, ordered alphabetically
        const students = await sql`
            SELECT
                id,
                first_name,
                last_name,
                full_name,
                created_at
            FROM students
            ORDER BY last_name, first_name
        `;

        return successResponse({
            students,
            count: students.length
        });

    } catch (error) {
        return errorResponse(error);
    }
};

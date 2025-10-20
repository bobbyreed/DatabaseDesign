/**
 * Delete Student
 * DELETE /delete-student
 * Remove a student from the database
 */

const { getDB, successResponse, errorResponse, handleOptions } = require('./db-config');

exports.handler = async (event, context) => {
    // Handle preflight
    if (event.httpMethod === 'OPTIONS') {
        return handleOptions();
    }

    // Only accept DELETE
    if (event.httpMethod !== 'DELETE') {
        return errorResponse(new Error('Method not allowed'), 405);
    }

    try {
        const sql = getDB();
        const { studentId } = JSON.parse(event.body);

        if (!studentId) {
            return errorResponse(new Error('Student ID is required'), 400);
        }

        // Delete student (cascades to attendance records)
        const result = await sql`
            DELETE FROM students
            WHERE id = ${studentId}
            RETURNING id, full_name
        `;

        if (result.length === 0) {
            return errorResponse(new Error('Student not found'), 404);
        }

        return successResponse({
            message: `Student ${result[0].full_name} deleted successfully`,
            deletedStudent: result[0]
        });

    } catch (error) {
        return errorResponse(error);
    }
};

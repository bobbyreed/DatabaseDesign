/**
 * Register Student
 * POST /register-student
 * Add a new student to the database
 */

const { getDB, successResponse, errorResponse, handleOptions } = require('./db-config');

exports.handler = async (event, context) => {
    // Handle preflight
    if (event.httpMethod === 'OPTIONS') {
        return handleOptions();
    }

    // Only accept POST
    if (event.httpMethod !== 'POST') {
        return errorResponse(new Error('Method not allowed'), 405);
    }

    try {
        const sql = getDB();
        const { firstName, lastName, fullName, rawCardData } = JSON.parse(event.body);

        // Validate required fields
        if (!firstName || !lastName) {
            return errorResponse(new Error('First name and last name are required'), 400);
        }

        const finalFullName = fullName || `${firstName} ${lastName}`;

        // Check if student already exists
        const existing = await sql`
            SELECT id, full_name
            FROM students
            WHERE first_name = ${firstName} AND last_name = ${lastName}
        `;

        if (existing.length > 0) {
            return errorResponse(new Error(`Student ${finalFullName} is already registered`), 409);
        }

        // Insert new student
        const result = await sql`
            INSERT INTO students (first_name, last_name, full_name, card_data)
            VALUES (${firstName}, ${lastName}, ${finalFullName}, ${rawCardData || null})
            RETURNING id, first_name, last_name, full_name, created_at
        `;

        return successResponse({
            message: 'Student registered successfully',
            student: result[0]
        });

    } catch (error) {
        return errorResponse(error);
    }
};

/**
 * Get Attendance Overview
 * GET /get-attendance-overview
 * Fetch attendance grid data for all students across all class dates
 */

const { getDB, successResponse, errorResponse, handleOptions } = require('./db-config');

// TODO: Update these dates with your actual class schedule
const CLASS_DATES = [
    '2025-01-13', // Class 1
    '2025-01-15', // Class 2
    '2025-01-20', // Class 3
    '2025-01-22', // Class 4
    '2025-01-27', // Class 5
    '2025-01-29', // Class 6
    '2025-02-03', // Class 7
    '2025-02-05', // Class 8
    '2025-02-10', // Class 9
    '2025-02-12', // Class 10
    '2025-02-17', // Class 11
    '2025-02-19', // Class 12
    '2025-02-24', // Class 13
    '2025-02-26', // Class 14
    '2025-03-03'  // Class 15
];

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

        // Get all students
        const students = await sql`
            SELECT id, first_name, last_name, full_name
            FROM students
            ORDER BY last_name, first_name
        `;

        // Get all attendance records
        const attendanceRecords = await sql`
            SELECT student_id, attendance_date, is_late
            FROM attendance
        `;

        // Build attendance map for quick lookup
        const attendanceMap = {};
        attendanceRecords.forEach(record => {
            const key = `${record.student_id}_${record.attendance_date}`;
            attendanceMap[key] = record.is_late;
        });

        // Build overview data for each student
        const overview = students.map(student => {
            const attendanceArray = CLASS_DATES.map(date => {
                const key = `${student.id}_${date}`;
                if (attendanceMap.hasOwnProperty(key)) {
                    return {
                        date,
                        status: attendanceMap[key] ? 'late' : 'present'
                    };
                }
                return {
                    date,
                    status: 'absent'
                };
            });

            // Calculate statistics
            const present = attendanceArray.filter(a => a.status === 'present').length;
            const late = attendanceArray.filter(a => a.status === 'late').length;
            const absent = attendanceArray.filter(a => a.status === 'absent').length;
            const totalClasses = CLASS_DATES.length;
            const attendanceRate = totalClasses > 0
                ? ((present + late) / totalClasses * 100).toFixed(1)
                : '0.0';

            return {
                studentId: student.id,
                firstName: student.first_name,
                lastName: student.last_name,
                fullName: student.full_name,
                attendance: attendanceArray,
                stats: {
                    present,
                    late,
                    absent,
                    totalClasses,
                    attendanceRate: parseFloat(attendanceRate)
                }
            };
        });

        return successResponse({
            classDates: CLASS_DATES,
            overview,
            totalStudents: students.length
        });

    } catch (error) {
        return errorResponse(error);
    }
};

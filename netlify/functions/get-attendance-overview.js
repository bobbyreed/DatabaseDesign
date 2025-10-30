/**
 * Get Attendance Overview
 * GET /get-attendance-overview
 * Fetch attendance grid data for all students across all class dates
 */

const { getDB, successResponse, errorResponse, handleOptions } = require('./db-config');

const CLASS_DATES = [
    '2025-10-22', // Class 1
    '2025-10-27', // Class 2
    '2025-10-29', // Class 3
    '2025-11-03', // Class 4
    '2025-11-05', // Class 5
    '2025-11-10', // Class 6
    '2025-11-12', // Class 7
    '2025-11-17', // Class 8
    '2025-11-19', // Class 9
    '2025-11-24', // Class 10
    '2025-11-26', // Class 11 (No Class)
    '2025-12-01', // Class 12
    '2025-12-03', // Class 13
    '2025-12-08', // Class 14
    '2025-12-10'  // Class 15
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

        // Get all attendance records with timestamps
        const attendanceRecords = await sql`
            SELECT student_id, attendance_date, is_late, timestamp
            FROM attendance
        `;

        // Build attendance map for quick lookup
        const attendanceMap = {};
        attendanceRecords.forEach(record => {
            const key = `${record.student_id}_${record.attendance_date}`;
            attendanceMap[key] = {
                isLate: record.is_late,
                timestamp: record.timestamp
            };
        });

        // Build overview data for each student
        const overview = students.map(student => {
            const attendanceArray = CLASS_DATES.map((date, index) => {
                const key = `${student.id}_${date}`;
                const classNumber = index + 1;

                if (attendanceMap.hasOwnProperty(key)) {
                    const record = attendanceMap[key];
                    return {
                        date,
                        classNumber,
                        status: record.isLate ? 'late' : 'present',
                        timestamp: record.timestamp
                    };
                }
                return {
                    date,
                    classNumber,
                    status: 'absent',
                    timestamp: null
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
            students: overview,
            totalStudents: students.length,
            totalClasses: CLASS_DATES.length
        });

    } catch (error) {
        return errorResponse(error);
    }
};

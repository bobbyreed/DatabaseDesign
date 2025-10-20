# Database Design Course - Attendance System Setup

The card swipe attendance system has been integrated into your Database Design course website. Follow these steps to complete the setup.

## ✅ What's Been Done

- ✓ Removed old Gist-based authentication system
- ✓ Cleaned up index.html (removed auth UI)
- ✓ Created classroom authentication system (`js/classroom-auth.js`)
- ✓ Created database schema (`database-schema.sql`)
- ✓ Created 8 serverless functions for student/attendance management
- ✓ Created 3 HTML pages (register-students, attendance, attendance-overview)
- ✓ Updated all course references to CSCI 5603 - Database Design
- ✓ Created package.json with @neondatabase/serverless dependency

## 🔧 Setup Steps You Need to Complete

### 1. Get Your Instructor Card Data

**Option A: Using Browser Console**
1. Open your browser's developer console (F12)
2. Create a test input:
   ```javascript
   const input = document.createElement('input');
   input.type = 'text';
   input.style = 'position:fixed;top:50%;left:50%;z-index:9999;font-size:20px;';
   document.body.appendChild(input);
   input.focus();
   ```
3. Swipe your instructor ID card
4. The card data will appear in the input field
5. Look for the pattern: `%B...^LASTNAME/FIRSTNAME^...?`
6. Extract just the `LASTNAME/FIRSTNAME` part

**Option B: Card Data from Docs**
According to ATTENDANCE_SYSTEM_PROMPT.md, your card pattern is: `REED/BOBBY`

### 2. Update Classroom Authentication

Edit `js/classroom-auth.js` line 10:

```javascript
// BEFORE:
const INSTRUCTOR_CARD_PATTERN = 'LASTNAME/FIRSTNAME'; // TODO: Update with actual card data

// AFTER:
const INSTRUCTOR_CARD_PATTERN = 'REED/BOBBY';
```

### 3. Setup Neon Database

1. Go to https://console.neon.tech and sign in/sign up
2. Create a new project (name it "DatabaseDesign" or similar)
3. Copy your connection string - it should look like:
   ```
   postgresql://username:password@host.neon.tech/database?sslmode=require
   ```

### 4. Run Database Schema

1. In your Neon console, go to the SQL Editor
2. Copy the contents of `database-schema.sql`
3. Paste and execute in the SQL Editor
4. Verify tables were created:
   ```sql
   SELECT * FROM students;
   SELECT * FROM attendance;
   ```

### 5. Configure Netlify Environment Variable

1. Go to your Netlify site dashboard
2. Navigate to: **Site Settings** → **Environment Variables**
3. Add a new variable:
   - **Key**: `DATABASE_URL`
   - **Value**: Your Neon connection string (from step 3)
   - **Scopes**: Check both "Same value for all deploy contexts" or set per context

**Important**: Use ONLY the connection string, NOT the `psql` command wrapper.

### 6. Update Class Dates

Edit `netlify/functions/get-attendance-overview.js` lines 12-26:

Update the `CLASS_DATES` array with your actual class schedule. For an 8-week course with 2 classes per week (16 total):

```javascript
const CLASS_DATES = [
    '2025-01-13', // Week 1, Class 1
    '2025-01-15', // Week 1, Class 2
    '2025-01-20', // Week 2, Class 1
    '2025-01-22', // Week 2, Class 2
    '2025-01-27', // Week 3, Class 1
    '2025-01-29', // Week 3, Class 2
    '2025-02-03', // Week 4, Class 1
    '2025-02-05', // Week 4, Class 2
    '2025-02-10', // Week 5, Class 1
    '2025-02-12', // Week 5, Class 2
    '2025-02-17', // Week 6, Class 1
    '2025-02-19', // Week 6, Class 2
    '2025-02-24', // Week 7, Class 1
    '2025-02-26', // Week 7, Class 2
    '2025-03-03', // Week 8, Class 1
    '2025-03-05'  // Week 8, Class 2
];
```

### 7. Install Dependencies

```bash
npm install
```

This will install `@neondatabase/serverless` which is required for the database functions.

### 8. Test Locally (Optional)

If you have Netlify CLI installed:

```bash
netlify dev
```

This will run the site locally with serverless functions.

### 9. Deploy to Netlify

```bash
git add .
git commit -m "Integrate attendance management system"
git push
```

Netlify will automatically deploy your changes.

## 📋 Post-Deployment Testing Checklist

### Test Student Registration (pages/register-students.html)
1. ✓ Card swipe authentication works
2. ✓ Can register students via card swipe
3. ✓ Can register students manually
4. ✓ Duplicate detection prevents re-registration
5. ✓ CSV export works
6. ✓ Can delete students

### Test Attendance Tracking (pages/attendance.html)
1. ✓ Card swipe authentication works
2. ✓ Can mark students present via card swipe
3. ✓ Can manually toggle attendance
4. ✓ Date selector works
5. ✓ Can mark students late
6. ✓ CSV export works
7. ✓ "Mark All Present" works
8. ✓ "Reset Day" works

### Test Attendance Overview (pages/attendance-overview.html)
1. ✓ Card swipe authentication works
2. ✓ Grid displays all students
3. ✓ Color coding is correct (green=present, yellow=late, gray=absent)
4. ✓ Hover tooltips show details
5. ✓ Statistics are accurate

## 🎭 Mock Data for Testing

After registering the first time, you can add mock students from the browser console:

```javascript
addMockStudents()
```

This will register 22 mock students for testing purposes.

## 🚀 Quick Start Guide for Students

Students don't need to do anything special. On the first day:

1. Instructor goes to **pages/register-students.html**
2. Authenticates with card swipe
3. Each student swipes their ID card to register
4. Students without cards can be manually entered

For daily attendance:

1. Instructor goes to **pages/attendance.html**
2. Authenticates with card swipe
3. Each student swipes their ID card as they arrive
4. Late arrivals can be marked as "late" manually

## 📊 Viewing Attendance

The instructor can view the attendance overview at **pages/attendance-overview.html** to see:
- Visual grid of all students × all class periods
- Color-coded attendance status
- Individual and class statistics
- Attendance rates

## 🔒 Security Notes

- Instructor card swipe uses sessionStorage (8-hour timeout)
- All attendance pages require instructor authentication
- Database credentials are stored in Netlify environment variables (never in code)
- All API requests use CORS headers for security

## ❓ Troubleshooting

**Issue**: "DATABASE_URL not configured"
- **Solution**: Add DATABASE_URL to Netlify environment variables

**Issue**: Card swipe not working
- **Solution**: Verify INSTRUCTOR_CARD_PATTERN matches your card exactly

**Issue**: Functions return 500 errors
- **Solution**: Check Netlify function logs for detailed error messages

**Issue**: Attendance overview shows all gray boxes
- **Solution**: Verify CLASS_DATES array contains past/present dates, not all future

**Issue**: Students not appearing
- **Solution**: Make sure database schema was executed successfully

## 📁 File Structure

```
DatabaseDesign/
├── index.html (cleaned, no auth)
├── database-schema.sql
├── package.json
├── SETUP_INSTRUCTIONS.md (this file)
├── js/
│   └── classroom-auth.js (update INSTRUCTOR_CARD_PATTERN here)
├── pages/
│   ├── register-students.html
│   ├── attendance.html
│   └── attendance-overview.html
└── netlify/functions/
    ├── db-config.js
    ├── register-student.js
    ├── get-students.js
    ├── delete-student.js
    ├── mark-attendance.js
    ├── get-attendance.js
    ├── get-attendance-history.js
    └── get-attendance-overview.js (update CLASS_DATES here)
```

## 🎯 Next Steps

1. Update `INSTRUCTOR_CARD_PATTERN` in `js/classroom-auth.js`
2. Create Neon database and run schema
3. Add `DATABASE_URL` to Netlify
4. Update `CLASS_DATES` in `netlify/functions/get-attendance-overview.js`
5. Run `npm install`
6. Commit and push to deploy
7. Test all three attendance pages
8. Add mock students for testing
9. Ready for first class!

---

**Need Help?** Check the original documentation:
- `ATTENDANCE_SYSTEM_SETUP.md` - Detailed technical documentation
- `ATTENDANCE_SYSTEM_PROMPT.md` - Implementation prompt template

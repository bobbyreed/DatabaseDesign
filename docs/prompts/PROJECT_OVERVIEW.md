# Database Design Course - Project Overview

**Course**: CSCI 5603 - Database Design
**Type**: Graduate-level, 8-week intensive
**Semester**: Spring 2025

## Project Purpose

This repository contains the complete course website for a graduate-level Database Design course, including:
- Interactive HTML lecture presentations
- Student attendance management system
- Course materials and assignments
- Live database integration for attendance tracking

## Technology Stack

### Frontend
- **HTML5/CSS3**: Presentation slides and pages
- **JavaScript**: Interactive slide controls, theme switching, attendance tracking
- **Custom Presentation Framework**: `/js/presentation.js` with keyboard navigation and timer features

### Backend & Database
- **PostgreSQL**: Primary database system (via Neon serverless)
- **Netlify**: Hosting platform with serverless functions
- **@neondatabase/serverless**: PostgreSQL connection library

### Styling
- **Custom CSS**: `/styles/database-theme.css` and `/styles/presentation.css`
- **Font**: Courier Prime & IBM Plex Mono for analog coding aesthetic
- **Theme Support**: Light/dark mode with localStorage persistence

## Project Structure

```
DatabaseDesign/
├── index.html                 # Course homepage with lecture list
├── pages/
│   ├── lectures/             # Lecture HTML slides (14 lectures)
│   │   ├── 1CourseOverview.html
│   │   ├── 2DBDesignIntro.html
│   │   ├── 3DBArch.html
│   │   └── ... (11 more lectures)
│   ├── attendance.html       # Student attendance page
│   ├── attendance-overview.html
│   ├── register-students.html
│   └── lectureTemplate.html
├── js/
│   └── presentation.js       # Shared presentation logic
├── styles/
│   ├── database-theme.css    # Global theme variables
│   └── presentation.css      # Slide styling
├── images/
│   └── favicon.png
├── netlify/
│   └── functions/            # Serverless API endpoints
├── docs/
│   └── prompts/             # Development documentation
└── database-schema.sql       # Production database schema
```

## Course Content Overview

### Week 1
- **Lecture 1**: Course Overview and Introduction
- **Lecture 2**: Database Design Introduction
  - File-based systems vs. DBMS
  - **Hands-on**: Building `movie_rental_db` (Movies, Members, Rentals, Studios)

### Week 2
- **Lecture 3**: Database Architecture
  - ANSI-SPARC three-level architecture
  - Three-tier application architecture
  - Centralized vs. distributed databases
  - **Homework**: Multi-schema implementation with movie_rental_db

- **Lecture 4**: The Relational Model
  - Relations, tuples, domains
  - Relational integrity constraints

### Week 3
- **Lecture 5**: Relational Algebra
  - Selection, projection, join operations

- **Lecture 6**: Relational Calculus
  - Tuple and domain calculus

### Week 4
- **Lecture 7**: SQL Fundamentals (Part 1)
- **Lecture 8**: SQL Fundamentals (Part 2)

### Week 5
- **Lecture 9**: Advanced SQL (Part 3)
- **Lecture 10**: Data Definitions

### Week 6
- **Lecture 11a**: Data Definitions & Views
- **Lecture 11b**: Document Databases & MongoDB Atlas Setup
  - Document DB fundamentals (JSON/BSON, embedding vs referencing)
  - MongoDB vs PostgreSQL comparison
  - **Hands-on**: MongoDB Atlas cloud database setup
  - Get connection string for MERN stack development

### Week 7
- **Lecture 12**: MongoDB CRUD & MERN Stack Deployment
  - NoSQL vs SQL comparison
  - MongoDB CRUD operations and aggregation
  - **Hands-on**: Deploy Express.js backend to Render (30 min)
  - **Hands-on**: Deploy React frontend to Netlify (20 min)
  - Test full-stack MERN application

- **Lecture 13**: Understanding the MERN Stack
  - Data flow tracing: React → Express → MongoDB → back
  - CORS configuration and security
  - Environment variables in production
  - Debugging deployed applications
  - Review questions and troubleshooting

### Week 8
- **Lecture 14**: Final Presentations

## Database Schemas

### movie_rental_db (Lecture 2)

The primary hands-on database used throughout the course for exercises and homework.

#### Movies Table
```sql
CREATE TABLE Movies (
    movie_id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    director VARCHAR(100),
    release_year INTEGER,
    available BOOLEAN DEFAULT TRUE,
    genre VARCHAR(50),
    rating VARCHAR(10)
);
```

#### Members Table
```sql
CREATE TABLE Members (
    member_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    join_date DATE DEFAULT CURRENT_DATE
);
```

#### Rentals Table
```sql
CREATE TABLE Rentals (
    rental_id SERIAL PRIMARY KEY,
    movie_id INTEGER REFERENCES Movies(movie_id),
    member_id INTEGER REFERENCES Members(member_id),
    rental_date DATE NOT NULL,
    return_date DATE
);
```

#### Studios Table (Extension)
```sql
CREATE TABLE Studios (
    studio_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    country VARCHAR(50),
    founded_year INTEGER
);

ALTER TABLE Movies
ADD COLUMN studio_id INTEGER REFERENCES Studios(studio_id);
```

### Attendance Database (Production)

Used for the live course attendance tracking system.

#### students Table
```sql
CREATE TABLE students (
    student_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    card_number VARCHAR(50) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### attendance Table
```sql
CREATE TABLE attendance (
    attendance_id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES students(student_id),
    lecture_number INTEGER NOT NULL,
    attended BOOLEAN DEFAULT TRUE,
    attendance_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Key Features

### Presentation System
- **Keyboard Navigation**: Arrow keys, Home, End
- **Timer Display**: For in-class exercises
- **Slide Counter**: Current/total slides
- **Theme Toggle**: Light/dark mode switcher
- **Fullscreen Mode**: Press 'F' key
- **Smooth Transitions**: CSS-based slide animations

### Attendance Management
- **Student Registration**: Card-based registration system
- **Live Attendance**: Real-time attendance marking
- **Attendance Overview**: Lecture-by-lecture tracking
- **Database Integration**: PostgreSQL backend via Neon

### Code Examples
All lectures include:
- Syntax-highlighted SQL code
- Interactive exercises with solutions
- Real-world case studies
- Hands-on DataGrip tutorials

## Development Setup

### Prerequisites
- Node.js (for Netlify CLI)
- PostgreSQL (for database exercises)
- DataGrip or similar database IDE
- Modern web browser (Chrome, Firefox, Edge)

### Local Development
```bash
# Clone repository
git clone <repository-url>

# Install dependencies
npm install

# Run local dev server
npm run dev

# Access at http://localhost:8888
```

### Database Setup
Students create their own local databases following lecture instructions:
```sql
CREATE DATABASE movie_rental_db;
\c movie_rental_db
-- Follow along with Lecture 2 to create tables
```

## Course Pedagogy

### Learning Approach
- **Theory + Practice**: Each lecture combines conceptual understanding with hands-on SQL
- **Progressive Complexity**: Builds from file systems to distributed databases
- **Real-World Examples**: E-commerce, banking, healthcare systems
- **Student Autonomy**: Students create their own data reflecting personal interests

### Assessment Methods
- Weekly hands-on assignments (SQL + screenshots)
- In-class exercises and debates
- Attendance tracking
- Final project presentation

### Unique Features
- **Analog Aesthetic**: Courier Prime font for retro computing feel
- **Personal Data**: Students use their own favorite movies, not generic examples
- **Architecture Focus**: Multi-schema implementations from Week 2
- **Performance Analysis**: EXPLAIN ANALYZE for query optimization

## File Naming Conventions

### Lecture Files
- Format: `{Number}{CamelCaseTitle}.html`
- Example: `3DBArch.html`, `2DBDesignIntro.html`

### Student Submissions
- Format: `LastName_FirstName_Week{N}_{Topic}.sql`
- Example: `Smith_John_Week2_MovieRental.sql`

### Screenshots
- Folder: `Week{N}_Screenshots/`
- Files: `{number}_{description}.png`

## Best Practices for Future Updates

### Adding New Lectures
1. Copy `pages/lectureTemplate.html`
2. Update title, lecture number, and content
3. Add entry to `index.html` lectures array
4. Include timer buttons for exercises
5. Follow existing slide structure (title, objectives, content, summary)

### Modifying Database Examples
- **Always use movie_rental_db** for consistency
- Update both lecture content AND homework if changing schemas
- Test all SQL examples in PostgreSQL before committing
- Maintain referential integrity in examples

### Accessibility
- All slides use semantic HTML
- Color contrast meets WCAG AA standards
- Keyboard navigation fully supported
- Screen reader friendly structure

## Support & Resources

### Student Resources
- Office hours schedule in index.html
- GitHub repository for homework submissions
- D2L for assignment submission links

### Technical Support
- Netlify deployment: Automatic via git push
- Database issues: Check Neon dashboard
- Attendance system: Contact course admin

## Long-Term Goals & Course Improvements

### Goal 1: Streamline Course Flow & Increase Hands-On Practice

**Current Challenge**: Too much time spent on relational calculus theory; insufficient hands-on practice with tools.

**Proposed Changes for Future Semesters**:

#### Week-by-Week Restructure
- **Week 1**: Course intro + File systems vs DBMS
  - Start `movie_rental_db` (Movies, Members, Rentals, Studios)
  - Hands-on with DataGrip and CLI PostgreSQL
  - **Key Change**: Less relational calculus, more tool proficiency

- **Weeks 2-3**: Student Personal Database Project (Phase 1)
  - Students design and build their own local database
  - Focus on schema design, normalization, relationships
  - Weekly progress check-ins
  - **Benefit**: Earlier engagement with personal data

- **Week 4**: Transition to Cloud (Neon PostgreSQL)
  - Migrate personal database to Neon
  - Learn REST API basics with curl and Postman
  - Test database endpoints
  - **Messaging**: "Your local DB goes live!"

- **Week 5**: Frontend Integration
  - Deploy Netlify frontend connected to Neon database
  - Simple CRUD interface for their data
  - **Student Project Phase 2**: Working web application

- **Weeks 6-7**: MERN Stack (MongoDB + Full Stack)
  - Document databases and NoSQL concepts
  - Build second project using MERN stack
  - **Current lectures 11b-13 serve this well**

- **Week 8**: Presentations + Final Exam
  - Students present both projects (Neon + MERN)
  - Reflect on relational vs document databases

#### Key Benefits
- ✅ More hands-on time with DataGrip, PostgreSQL CLI, curl, Postman
- ✅ Two complete projects instead of scattered exercises
- ✅ Clearer progression: local → cloud → full-stack
- ✅ Better preparation for real-world development
- ✅ Less abstract theory, more applied learning

### Goal 2: Develop Unique Visual Identity

**Question**: What visual style says "database"?

**Proposed Exploration**:
- **Unit 1 (Local DB)**: Terminal/CLI aesthetic
  - Monospace fonts (current Courier Prime works well)
  - Dark mode with syntax highlighting
  - Retro computing feel

- **Unit 2 (Neon/Cloud)**: Modern cloud aesthetic
  - Lighter, cleaner design
  - Blue/cyan color palette (cloud imagery)
  - API request/response visualizations

- **Unit 3 (NoSQL/MERN)**: Document/JSON aesthetic
  - Green accents (MongoDB branding)
  - Tree structures for nested documents
  - Component-based visual hierarchy

**Considerations**:
- Maintain accessibility across all styles
- Consistent navigation/controls
- Theme toggle for each unit style
- Visual cues that match the database paradigm being taught

## Recent Updates

### January 2025 - MERN Stack Content Redistribution
- **Lecture 11b**: Added hands-on MongoDB Atlas setup (Phase 1 from Lecture 13)
- **Lecture 12**: Added hands-on Express backend and React frontend deployment (Phase 2 & 3 from Lecture 13)
- **Lecture 13**: Refocused on understanding deployed applications (data flow, CORS, debugging)
- **Benefit**: More logical progression across three lectures instead of one overwhelming session

### Pending Cleanup Tasks
- Remove duplicate deployment slides from Lecture 13 (slides 8-25 are now in Lectures 11b-12)
- Consider adding more troubleshooting scenarios to Lecture 13

## License

MIT License - See LICENSE file for details

---

**Last Updated**: January 2025
**Maintainer**: Course Instructor
**Repository**: /home/bobby/repos/DatabaseDesign

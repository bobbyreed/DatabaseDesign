# Lecture 7, 8, 9 Revision Notes: Project-Focused SQL Instruction

**Created:** 2025-11-12
**Purpose:** Guide revision of SQL lectures (7, 8, 9) to connect to students' semester projects and Netlify frontends

---

## Core Pedagogical Strategy

### The Problem We're Solving
- **Original Issue**: Lectures 7-9 teach SQL using disconnected example schemas (DreamHome, Student/Course)
- **Student Reality**: Students are building their own semester project databases + have live Netlify frontends from Lecture 6
- **Disconnect**: SQL feels abstract and unrelated to their actual work

### The Solution: Three-Part Learning Pattern

```
1. LEARN with movie_rental_db (consistent teaching examples)
2. PRACTICE with their project (adapt concepts to their schema)
3. DEPLOY to Netlify (immediate tangible results)
```

---

## Database Schemas in Use

### 1. movie_rental_db (Teaching Database)
**Use for:** Primary examples, demonstrations, instructor walkthroughs

**Schema:**
- `Movies` (movie_id, title, genre, release_year, studio_id)
- `Members` (member_id, name, email, join_date)
- `Rentals` (rental_id, movie_id, member_id, rental_date, return_date)
- `Studios` (studio_id, name, location)

**Why:** Consistent, familiar from earlier lectures, relatable domain

### 2. Student Project Databases (Variable Schemas)
**Use for:** Exercises, homework, in-class practice

**Examples from Lecture 4:**
- Small business inventory tracking
- Club membership management
- Personal recipe collection
- Event planning coordination
- Home library management

**Characteristics:**
- At least 3 tables (per project requirements)
- Real data students care about
- Already deployed to Neon with Netlify API (from Lecture 6)

---

## Integration with Lecture 6 (Frontend/Netlify)

### What Students Built in Lecture 6
- Migrated their database to Neon (serverless PostgreSQL)
- Created 6 Netlify API functions:
  - 3 GET endpoints (list all, get by ID, search)
  - 1 POST (create)
  - 1 PUT (update)
  - 1 DELETE
- Built HTML frontend with JavaScript that calls these APIs
- Live deployment on Netlify

### How Lectures 7-9 Connect
**Key Connection Point:** The SQL queries students learn become the queries inside their Netlify API functions

**Example Flow:**
```javascript
// Lecture 6: Simple query in Netlify function
const result = await pool.query('SELECT * FROM recipes');

// Lecture 7: Enhanced with WHERE, ORDER BY
const result = await pool.query(
  'SELECT * FROM recipes WHERE cuisine = $1 ORDER BY prep_time ASC',
  [cuisine]
);

// Lecture 8: Adding JOINs for related data
const result = await pool.query(`
  SELECT r.name, r.prep_time, c.category_name
  FROM recipes r
  JOIN categories c ON r.category_id = c.category_id
  WHERE r.cuisine = $1
  ORDER BY r.prep_time ASC
`, [cuisine]);

// Lecture 9: Advanced with subqueries, CTEs
const result = await pool.query(`
  WITH popular_recipes AS (
    SELECT recipe_id, COUNT(*) as rating_count
    FROM ratings
    GROUP BY recipe_id
    HAVING COUNT(*) > 5
  )
  SELECT r.name, pr.rating_count, AVG(rt.score) as avg_rating
  FROM recipes r
  JOIN popular_recipes pr ON r.recipe_id = pr.recipe_id
  JOIN ratings rt ON r.recipe_id = rt.recipe_id
  WHERE r.cuisine = $1
  GROUP BY r.name, pr.rating_count
  ORDER BY avg_rating DESC
`, [cuisine]);
```

### Integration Strategy Per Lecture

**Lecture 7 (SQL Basics):**
- Add "SQL Powers Your Netlify API" section
- Show how WHERE, ORDER BY, LIKE enhance their existing GET endpoints
- Homework: Students add 2-3 new filtered/sorted API endpoints

**Lecture 8 (Advanced SQL - JOINs, Subqueries):**
- Show multi-table queries → new API endpoints with related data
- Students create endpoints that join their project tables
- Frontend displays richer, related information

**Lecture 9 (Views, Indexes, Optimization):**
- Performance analysis of their live API
- Create views for complex queries
- Add indexes to slow queries
- EXPLAIN analysis on their actual data

---

## "Bridge to Your Project" Pattern

### Template Structure
After each movie_rental_db example, include a "Bridge to Your Project" callout:

```html
<div class="bridge-box">
  <h4>🌉 Bridge to Your Project</h4>
  <p><strong>Adapt this concept:</strong></p>
  <ul>
    <li><strong>If you have [scenario A]:</strong> [adaptation guidance]</li>
    <li><strong>If you have [scenario B]:</strong> [adaptation guidance]</li>
  </ul>
  <p><strong>Example schemas:</strong></p>
  <ul>
    <li><strong>Recipe database:</strong> <code>SELECT * FROM recipes WHERE cuisine = 'Italian' ORDER BY prep_time ASC</code></li>
    <li><strong>Inventory database:</strong> <code>SELECT * FROM products WHERE category = 'Electronics' ORDER BY price DESC</code></li>
    <li><strong>Library database:</strong> <code>SELECT * FROM books WHERE genre = 'Science Fiction' ORDER BY publication_year DESC</code></li>
  </ul>
</div>
```

### CSS Styling (add to lecture styles)
```css
.bridge-box {
  background-color: #f0f8ff;
  border-left: 4px solid #4a90e2;
  padding: 15px;
  margin: 20px 0;
  font-family: 'Courier Prime', monospace;
}

.bridge-box h4 {
  margin-top: 0;
  color: #4a90e2;
}
```

---

## SQL Concepts Roadmap (Lectures 7, 8, 9)

### Lecture 7: SQL Fundamentals
**Current Concepts (Keep):**
- SELECT, FROM, WHERE, ORDER BY
- DISTINCT, AS (aliases)
- Comparison operators (=, <>, <, <=, >, >=)
- Pattern matching (LIKE with %, _)
- Aggregate functions (COUNT, SUM, AVG, MIN, MAX)
- GROUP BY, HAVING
- Basic DML (INSERT, UPDATE, DELETE)

**New Emphasis:**
- Connect to Netlify API endpoints
- Filtering/sorting for frontend display
- Aggregate queries for dashboard stats

**Homework (New):**
- Write 5+ queries for their project using WHERE, ORDER BY, GROUP BY
- Implement 2-3 new Netlify API endpoints
- Update frontend to display results
- Extension: EXPLAIN analysis + optimization

### Lecture 8: Advanced SQL (To Be Revised)
**Expected Current Concepts:**
- JOIN types (INNER, LEFT, RIGHT, FULL OUTER)
- Multi-table queries
- Subqueries (WHERE, FROM, SELECT)
- Set operations (UNION, INTERSECT, EXCEPT)
- CASE expressions

**Revision Approach:**
- Examples: JOIN movie_rental_db tables (Movies ⟗ Studios, Rentals ⟗ Movies ⟗ Members)
- Bridge: "How do YOUR tables relate? Which JOINs make sense?"
- Netlify Integration: API endpoints returning related data
- Homework: Students implement JOIN-based APIs for their project

**Suggested New Sections:**
- "Designing API Endpoints with JOINs" (practical REST patterns)
- "Subqueries vs JOINs: When to Use Each"
- "Frontend Implications: Nested vs Flat Data"

### Lecture 9: Views, Indexes, Performance (To Be Revised)
**Expected Current Concepts:**
- CREATE VIEW, ALTER VIEW, DROP VIEW
- Indexes (CREATE INDEX, types of indexes)
- Query optimization
- EXPLAIN and EXPLAIN ANALYZE
- Transaction management (BEGIN, COMMIT, ROLLBACK)

**Revision Approach:**
- Use student Netlify APIs for performance analysis
- Create views for complex/repeated queries in their project
- Index their actual slow queries
- EXPLAIN analysis on real student data

**Suggested New Sections:**
- "Optimizing Your Live API" (using their Netlify deployment)
- "When Views Help Your Frontend" (simplifying complex queries)
- "Indexing Strategy for Your Project" (analyze their specific access patterns)
- "Transaction Safety in API Endpoints" (CRUD operation safety)

**Homework:**
- EXPLAIN analysis on 3+ of their queries
- Create 1-2 views for complex queries used in multiple endpoints
- Add indexes to improve slow queries
- Measure before/after performance
- Update API documentation with query performance notes

---

## Exercise Templates (Database-Agnostic)

### Template 1: Basic Filtering
```
Exercise: Filtered List Endpoint

1. Identify a table in your project where users need to filter results
2. Write a query with WHERE clause for at least 2 filter conditions
3. Add ORDER BY to sort results logically
4. Implement as a new GET endpoint in Netlify (e.g., /api/items-by-category)
5. Update your frontend to call this endpoint and display results

Example (Recipe DB):
GET /api/recipes-by-cuisine?cuisine=Italian&maxTime=30
Query: SELECT * FROM recipes WHERE cuisine = $1 AND prep_time <= $2 ORDER BY prep_time ASC
```

### Template 2: Aggregate Dashboard
```
Exercise: Statistics Endpoint

1. Identify metrics that would be useful on a dashboard for your project
2. Write queries using COUNT, AVG, SUM, MIN, MAX
3. Consider GROUP BY for category breakdowns
4. Implement as GET endpoint returning JSON statistics
5. Create simple dashboard display on your frontend

Example (Inventory DB):
GET /api/inventory-stats
Query:
  SELECT category,
         COUNT(*) as item_count,
         SUM(quantity) as total_quantity,
         AVG(price) as avg_price
  FROM products
  GROUP BY category
  ORDER BY total_quantity DESC
```

### Template 3: Search Functionality
```
Exercise: Search Endpoint with LIKE

1. Identify text fields users might want to search
2. Write query with LIKE and wildcards (%, _)
3. Consider ILIKE for case-insensitive search (PostgreSQL)
4. Implement as GET /api/search?q=searchterm
5. Add search box to your frontend

Example (Library DB):
GET /api/search-books?q=science
Query: SELECT * FROM books WHERE title ILIKE $1 OR author ILIKE $1 ORDER BY publication_year DESC
Parameter: '%science%'
```

---

## Code Examples to Add

### 1. Connecting SQL to Netlify Functions

**Show in Lecture 7:**
```javascript
// Basic Netlify function structure (review from Lecture 6)
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

exports.handler = async (event, context) => {
  // Lecture 7: Adding WHERE and ORDER BY
  const { category, sortBy } = event.queryStringParameters || {};

  let query = 'SELECT * FROM items WHERE 1=1';
  const params = [];

  if (category) {
    params.push(category);
    query += ` AND category = $${params.length}`;
  }

  // Safe sorting (whitelist approach)
  const validSorts = ['name', 'price', 'date_added'];
  const sortColumn = validSorts.includes(sortBy) ? sortBy : 'date_added';
  query += ` ORDER BY ${sortColumn} DESC`;

  try {
    const result = await pool.query(query, params);
    return {
      statusCode: 200,
      body: JSON.stringify(result.rows)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
```

### 2. movie_rental_db Example Queries

**For Lecture 7 Examples:**
```sql
-- Basic SELECT with WHERE
SELECT title, genre, release_year
FROM Movies
WHERE genre = 'Science Fiction'
ORDER BY release_year DESC;

-- Aggregate: Total rentals per member
SELECT m.name, COUNT(r.rental_id) as total_rentals
FROM Members m
LEFT JOIN Rentals r ON m.member_id = r.member_id
GROUP BY m.member_id, m.name
ORDER BY total_rentals DESC;

-- Pattern matching: Find movies with "Star" in title
SELECT title, release_year
FROM Movies
WHERE title LIKE '%Star%'
ORDER BY release_year;

-- Having clause: Members with 5+ rentals
SELECT m.name, COUNT(r.rental_id) as rental_count
FROM Members m
JOIN Rentals r ON m.member_id = r.member_id
GROUP BY m.member_id, m.name
HAVING COUNT(r.rental_id) >= 5
ORDER BY rental_count DESC;

-- Aggregate stats for dashboard
SELECT
  COUNT(DISTINCT movie_id) as total_movies,
  COUNT(DISTINCT member_id) as total_members,
  COUNT(rental_id) as total_rentals,
  AVG(EXTRACT(DAY FROM (return_date - rental_date))) as avg_rental_days
FROM Rentals;
```

---

## Homework Assignment Structure

### Lecture 7 Homework (SQL Basics)

**Part 1: Query Writing (40%)**
Write 5+ SQL queries for your project database that demonstrate:
1. WHERE with multiple conditions + ORDER BY
2. LIKE pattern matching for search
3. Aggregate function (COUNT, SUM, AVG, MIN, or MAX)
4. GROUP BY with at least 2 groups
5. GROUP BY + HAVING to filter aggregated results

Submit: SQL file with queries and sample output (screenshots or text)

**Part 2: API Implementation (40%)**
Implement 2-3 new Netlify API endpoints using your queries:
- At least one filtered list endpoint (uses WHERE, ORDER BY)
- At least one statistics/dashboard endpoint (uses aggregates, GROUP BY)

Submit: Links to deployed API endpoints + code in GitHub

**Part 3: Frontend Integration (20%)**
Update your HTML frontend to call and display results from your new endpoints

Submit: Link to live Netlify site demonstrating new functionality

**Extension (Optional Bonus):**
1. Run EXPLAIN on your most complex query
2. Analyze the execution plan
3. Suggest one optimization (index, query rewrite, etc.)
4. Implement the optimization and measure improvement

Submit: Markdown document with EXPLAIN output, analysis, and results

---

## Key Talking Points for Instruction

### Motivation (Start of Lecture 7)
> "In Lecture 6, you built a live frontend with API endpoints. But those queries were simple - SELECT * from a table. Today, we're going to learn SQL techniques that will make your APIs much more powerful: filtering, sorting, searching, and computing statistics. By the end of today, your project will have dashboard stats, search functionality, and smart filtering - all backed by SQL."

### Connection Points Throughout
- "This WHERE clause? It becomes query parameters in your API."
- "GROUP BY gives you the stats for dashboards and admin panels."
- "LIKE is how you build search features users actually want."
- "Every query we write today can power a new feature in your frontend."

### Practical Emphasis
- Always show movie_rental_db example first (learn)
- Then show 2-3 project adaptations (practice)
- Reference how it deploys to Netlify (deploy)
- Ask: "Who has a [type of table] in their project? How would you adapt this?"

---

## Styling/UI Additions Needed

### New CSS Classes for Lecture 7

```css
/* Bridge to Your Project boxes */
.bridge-box {
  background-color: #f0f8ff;
  border-left: 4px solid #4a90e2;
  padding: 15px;
  margin: 20px 0;
  font-family: 'Courier Prime', monospace;
}

.bridge-box h4 {
  margin-top: 0;
  color: #4a90e2;
}

/* Netlify integration callouts */
.netlify-callout {
  background-color: #e8f5e9;
  border-left: 4px solid #4caf50;
  padding: 15px;
  margin: 20px 0;
}

.netlify-callout h4 {
  margin-top: 0;
  color: #2e7d32;
}

/* Example code with project context */
.project-example {
  background-color: #fff3e0;
  border: 1px solid #ff9800;
  padding: 10px;
  margin: 10px 0;
  border-radius: 4px;
}

.project-example strong {
  color: #e65100;
}
```

---

## Notes for Lecture 8 & 9 Revisions

### Lecture 8 (Advanced SQL)
**Primary Changes Needed:**
- Replace examples with movie_rental_db JOINs (Movies ⟗ Studios, Rentals ⟗ Movies ⟗ Members)
- Add "Designing API Endpoints with JOINs" section
- Show how JOINs enable "related data" features (e.g., movie with studio info, rental history with movie titles)
- Exercises: Students implement JOIN-based APIs
- Homework: Create 3+ endpoints using different JOIN types, update frontend to display related data

**Key Concepts to Emphasize:**
- INNER JOIN vs LEFT JOIN (when do you need nullable results?)
- Multi-table JOINs for rich data (3+ tables)
- Subqueries in WHERE (filtering by related data)
- Subqueries in FROM (derived tables for complex analytics)

### Lecture 9 (Views, Indexes, Performance)
**Primary Changes Needed:**
- Use student Netlify deployments for real performance analysis
- Show VIEW creation for queries used in multiple endpoints
- Index student tables based on their actual access patterns
- EXPLAIN analysis on their live data
- Transaction management in API context (CRUD safety)

**Key Concepts to Emphasize:**
- When views simplify frontend development (complex queries → simple view)
- Indexing strategy (B-tree vs hash, single vs composite)
- Query optimization techniques (EXPLAIN → identify bottleneck → fix)
- Transactions in APIs (ensuring atomic operations)

---

## Success Criteria

By the end of Lectures 7, 8, 9, students should be able to:

1. **Write complex SQL queries** for their project using WHERE, JOINs, subqueries, aggregates, GROUP BY
2. **Implement API endpoints** that use these queries to power frontend features
3. **Optimize their database** with views and indexes based on actual usage patterns
4. **Analyze performance** using EXPLAIN and make data-driven improvements
5. **Connect concepts** between SQL theory, API implementation, and frontend features

**Measure:**
- Homework submissions show working APIs with complex queries
- Final project presentations (Dec 8) demonstrate rich, optimized database-backed features
- Students can articulate "I used [SQL concept] to implement [feature] in my project"

---

## Implementation Checklist

### For Lecture 7 Revision:
- [ ] Replace DreamHome examples with movie_rental_db
- [ ] Add "Bridge to Your Project" boxes after each concept
- [ ] Create "SQL Powers Your Netlify API" section
- [ ] Add Netlify function code examples
- [ ] Rewrite exercises as API enhancement tasks
- [ ] Create new homework (query writing + API implementation + frontend)
- [ ] Add CSS for bridge-box and netlify-callout
- [ ] Test all movie_rental_db queries for accuracy

### For Lecture 8 Revision (Future):
- [ ] Replace examples with movie_rental_db multi-table queries
- [ ] Add "Designing API Endpoints with JOINs" section
- [ ] Create JOIN-based exercise templates
- [ ] Update homework to focus on related-data APIs

### For Lecture 9 Revision (Future):
- [ ] Add "Optimizing Your Live API" section using student deployments
- [ ] Create view examples from Lecture 7-8 complex queries
- [ ] Show indexing strategy for common access patterns
- [ ] EXPLAIN analysis examples on movie_rental_db
- [ ] Transaction management in API context

---

## Questions/Decisions for Future Lectures

1. **Lecture 8**: Should we introduce GraphQL as an alternative to multiple REST endpoints with JOINs?
2. **Lecture 9**: Should we cover connection pooling and Neon's serverless scaling features?
3. **General**: Should we add a "common pitfalls" section (SQL injection, N+1 queries, missing indexes)?
4. **Assessment**: Should final presentations include a "SQL complexity" rubric item?

---

**End of Notes**
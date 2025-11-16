# Complete Student Checklist: Lectures 6-9
## Building a Full-Stack Database Application with Netlify & Neon

This checklist covers all tasks, exercises, and deliverables from Lectures 6-9. Use it to ensure you've completed everything needed to build and optimize your database-backed web application.

---

## 📚 LECTURE 6: Building a Frontend with Netlify & Neon

### Part 1: Setting Up Neon Database

- [ ] **Create Neon Account** (Lecture 6, Slide 6)
  - Visit [neon.tech](https://neon.tech)
  - Sign up with GitHub (recommended) or email
  - Verify your account

- [ ] **Create a New Project** (Lecture 6, Slide 6)
  - Click "Create Project"
  - Choose a project name (e.g., "movie-rental-db", "hotel-management-db")
  - Select a region closest to you
  - **SAVE your database credentials!** (connection string format: `postgresql://user:password@host/database`)

- [ ] **Upload Your Schema** (Lecture 6, Slide 7 - Activity: 10 minutes)
  - Open Neon SQL Editor tab in your project
  - Copy your CREATE TABLE statements from existing schema
  - Paste into Neon SQL Editor and execute
  - Verify tables: `SELECT * FROM information_schema.tables;`
  - Insert test records into your tables

- [ ] **Alternative: Connect with DataGrip** (Lecture 6, Slide 8 - Optional)
  - Copy connection string from Neon Dashboard
  - Open DataGrip → New Data Source → PostgreSQL
  - Parse connection string (Host, Port 5432, Database, User/Password)
  - Enable SSL (required for Neon)
  - Test connection and apply

---

### Part 2: Setting Up Netlify

- [ ] **Create Netlify Account** (Lecture 6, Slide 9)
  - Visit [netlify.com](https://netlify.com)
  - Sign up with GitHub (highly recommended for auto-deployment)

- [ ] **Install Netlify CLI** (Lecture 6, Slide 9)
  - Run: `npm install -g netlify-cli` (global)
  - OR: `npm install --save-dev netlify-cli` (local to project)
  - Login: `netlify login` (opens browser for authorization)

---

### Part 3: Project Setup

- [ ] **Create Project Directory** (Lecture 6, Slide 10)
  ```bash
  mkdir my-database-frontend
  cd my-database-frontend
  npm init -y
  ```

- [ ] **Install Neon Serverless Driver** (Lecture 6, Slide 10)
  ```bash
  npm install @neondatabase/serverless
  ```

- [ ] **Create Directory Structure** (Lecture 6, Slide 10)
  ```bash
  mkdir netlify
  mkdir netlify/functions
  mkdir public
  ```

- [ ] **Create Configuration Files** (Lecture 6, Slide 11)
  - Create `netlify.toml` in project root with build and dev settings
  - Set functions directory to "netlify/functions"
  - Set publish directory to "public"
  - Set dev port to 8888

- [ ] **Set Up Environment Variables** (Lecture 6, Slide 12)
  - **Local:** Create `.env` file with `DATABASE_URL=postgresql://...`
  - Add `.env` to `.gitignore` (NEVER commit credentials!)
  - **Production:** Add `DATABASE_URL` in Netlify Dashboard → Site Settings → Environment Variables

---

### Part 4: Create API Functions (CRUD Operations)

- [ ] **Create GET All Items Function** (Lecture 6, Slide 13)
  - Create file: `netlify/functions/get-items.mjs`
  - Import Neon driver: `import { neon } from '@neondatabase/serverless';`
  - Connect using `process.env.DATABASE_URL`
  - Query: `SELECT * FROM your_table_name`
  - Return JSON response with status 200

- [ ] **Create GET by ID Function** (Lecture 6, Slide 15)
  - Create file: `netlify/functions/get-item-by-id.mjs`
  - Parse query parameter: `url.searchParams.get('id')`
  - Use parameterized query: `SELECT * FROM your_table WHERE id = $1`
  - Return single item or 404 if not found

- [ ] **Create POST Function** (Lecture 6, Slide 16)
  - Create file: `netlify/functions/create-item.mjs`
  - Check method is POST
  - Parse request body: `await req.json()`
  - Validate required fields
  - Use parameterized INSERT with RETURNING clause
  - Return created item with status 201

- [ ] **Create PUT Function** (Lecture 6, Slide 16a)
  - Create file: `netlify/functions/update-item.mjs`
  - Check method is PUT
  - Get ID from query parameter
  - Parse request body for update values
  - Use parameterized UPDATE with RETURNING clause
  - Return updated item or 404 if not found

- [ ] **Create DELETE Function** (Lecture 6, Slide 16b)
  - Create file: `netlify/functions/delete-item.mjs`
  - Check method is DELETE
  - Get ID from query parameter
  - Use parameterized DELETE with RETURNING clause
  - Return success message or 404 if not found

---

### Part 5: Testing & Frontend

- [ ] **Test Functions Locally** (Lecture 6, Slide 17)
  - Start dev server: `netlify dev`
  - Access at `http://localhost:8888`
  - Test endpoints in browser for GET requests
  - Use curl/Postman/Insomnia for POST/PUT/DELETE

- [ ] **Test with curl** (Lecture 6, Slide 18)
  - GET: `curl http://localhost:8888/.netlify/functions/get-items`
  - GET by ID: `curl "http://localhost:8888/.netlify/functions/get-item-by-id?id=1"`
  - POST: `curl -X POST http://localhost:8888/.netlify/functions/create-item -H "Content-Type: application/json" -d '{"field1":"value1"}'`
  - PUT: `curl -X PUT "http://localhost:8888/.netlify/functions/update-item?id=1" -H "Content-Type: application/json" -d '{"field1":"new_value"}'`
  - DELETE: `curl -X DELETE "http://localhost:8888/.netlify/functions/delete-item?id=1"`

- [ ] **Complete Activity: Build Your API** (Lecture 6, Slide 19 - 20 minutes)
  - Create 3 functions minimum: List, Get by ID, Create
  - Use YOUR table and column names
  - Test each function with `netlify dev`
  - Use parameterized queries (prevent SQL injection)
  - Handle errors gracefully

- [ ] **Build Simple Frontend** (Lecture 6, Slide 20)
  - Create `public/index.html`
  - Add JavaScript to fetch from `/.netlify/functions/get-items`
  - Display results in HTML
  - Handle loading states and errors

- [ ] **Add CORS Headers** (Lecture 6, Slide 22)
  - Add to all function responses:
    - `'Access-Control-Allow-Origin': '*'` (or specific domain for production)
    - `'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE'`
    - `'Access-Control-Allow-Headers': 'Content-Type'`

---

### Part 6: Deployment

- [ ] **Deploy to Netlify** (Lecture 6, Slide 21)
  - **Option 1 (Recommended):** Push code to GitHub, then Netlify Dashboard → New Site → Import from Git
  - **Option 2:** Run `netlify deploy --prod`
  - Add `DATABASE_URL` environment variable in Netlify Dashboard
  - Get live URL: `https://your-site-name.netlify.app`

---

### Part 7: Advanced Features (Optional)

- [ ] **Implement Pagination** (Lecture 6, Slide 25)
  - Add page and limit query parameters
  - Calculate offset: `(page - 1) * limit`
  - Return items + pagination metadata (total pages, current page, etc.)

- [ ] **Complete Activity: Add Advanced Features** (Lecture 6, Slide 26 - 15 minutes)
  - Choose one to implement:
    - Search function (LIKE/ILIKE queries)
    - Update function (PUT endpoint)
    - Delete function (with confirmation)
    - Join query (if you have related tables)
    - Pagination

---

### Lecture 6 Homework Deliverables (Slide 30)

- [ ] **Migrate Database to Neon** - All tables and data uploaded
- [ ] **Create API Functions:**
  - At least 3 GET endpoints (list, get by ID, search/filter)
  - At least 1 POST endpoint (create)
  - At least 1 PUT endpoint (update)
  - At least 1 DELETE endpoint
- [ ] **Build Frontend** - HTML page displaying and interacting with data
- [ ] **Deploy to Netlify** - Live site with working API
- [ ] **Document** - README with API endpoints and usage instructions
- [ ] **Extra Credit** - Authentication or advanced filtering

**Submit:** GitHub repository link + Live Netlify URL

---

## 📚 LECTURE 7: SQL Part 1 - Data Manipulation

### Part 1: Understanding SQL Fundamentals

- [ ] **Review SQL History and Objectives** (Lecture 7, Slides 3-5)
  - Understand SQL's evolution from SEQUEL (1974) to modern SQL
  - Learn SQL's design philosophy: non-procedural, English-like, universal

---

### Part 2: Frontend Setup for All Tables

- [ ] **Update Main Page to Display All 3 Tables** (Lecture 7, Slide 6a - Goal)
  - Expand your Netlify function to fetch all 3 project tables
  - Use `Promise.all()` for parallel queries
  - Return structured JSON with all table data

- [ ] **Update index.html for Multiple Tables** (Lecture 7, Slide 6b)
  - Create 3 div containers with IDs (table1-container, table2-container, table3-container)
  - Write JavaScript to fetch and display all 3 tables
  - Create reusable `displayTable()` function
  - Add loading states and error handling

---

### Part 3: Basic SELECT Queries

- [ ] **Practice SELECT * Queries** (Lecture 7, Slide 8)
  - Query all rows and columns from each of your tables
  - Understand when to use `SELECT *` vs. specific columns

- [ ] **Use DISTINCT** (Lecture 7, Slide 9)
  - Get unique values from columns (categories, types, statuses)
  - Apply to dropdown/filter options in your UI

- [ ] **Select Specific Columns** (Lecture 7, Slide 10)
  - Practice selecting only needed columns
  - Use column aliases with `AS` keyword

- [ ] **Complete Activity: Write Your First Queries** (Lecture 7, Slide 11 - 15 minutes)
  - Write 5 basic SELECT queries for your database
  - Practice with DISTINCT, column selection, and aliases

---

### Part 4: Filtering with WHERE

- [ ] **Master WHERE Clause** (Lecture 7, Slides 12-14)
  - Filter using comparison operators (`=`, `<`, `>`, `<=`, `>=`, `<>`)
  - Use logical operators (`AND`, `OR`, `NOT`)
  - Practice `BETWEEN` for ranges
  - Use `IN` for multiple values
  - Handle `NULL` values with `IS NULL` / `IS NOT NULL`

- [ ] **Implement WHERE in API** (Lecture 7, Slide 17b)
  - Create filter endpoint accepting query parameters
  - Build dynamic WHERE clauses based on parameters
  - Use parameterized queries (prevent SQL injection)
  - Example: `GET /api/items?category=Electronics`

---

### Part 5: Sorting Results

- [ ] **Use ORDER BY** (Lecture 7, Slide 15)
  - Sort by single column: `ORDER BY price DESC`
  - Sort by multiple columns: `ORDER BY category, name ASC`
  - Understand ASC (ascending) vs DESC (descending)

- [ ] **Add Sorting to API** (Lecture 7, Slide 17c)
  - Accept sortBy and order query parameters
  - Whitelist valid sort columns (security!)
  - Implement safe dynamic sorting
  - Example: `GET /api/items?sortBy=price&order=DESC`

---

### Part 6: Aggregate Functions

- [ ] **Practice Aggregate Functions** (Lecture 7, Slide 16)
  - `COUNT(*)` - Count all rows
  - `COUNT(column)` - Count non-NULL values
  - `SUM(column)` - Total of numeric column
  - `AVG(column)` - Average value
  - `MIN(column)` - Minimum value
  - `MAX(column)` - Maximum value

- [ ] **Create Dashboard Stats Endpoint** (Lecture 7, Slide 17d)
  - Build `/api/stats` endpoint with aggregate metrics
  - Return counts, averages, min/max values
  - Example: total items, avg price, category count

---

### Part 7: Grouping Data

- [ ] **Use GROUP BY** (Lecture 7, Slide 16)
  - Group rows by category/type
  - Combine with aggregate functions
  - Example: `SELECT category, COUNT(*) FROM items GROUP BY category`

- [ ] **Filter Groups with HAVING** (Lecture 7, Slide 16)
  - Apply conditions to grouped results
  - Understand WHERE (filters rows) vs HAVING (filters groups)
  - Example: `HAVING COUNT(*) > 5`

- [ ] **Create Category Breakdown Endpoint** (Lecture 7, Slide 17e)
  - Build analytics endpoint using GROUP BY
  - Return item counts and averages per category
  - Sort by count or average
  - Perfect for charts and graphs!

---

### Part 8: Pattern Matching

- [ ] **Use LIKE for Search** (Lecture 7, Slide 16)
  - Wildcard `%` matches any characters
  - Wildcard `_` matches single character
  - Use `ILIKE` for case-insensitive search (PostgreSQL)
  - Examples:
    - `LIKE 'A%'` - Starts with A
    - `LIKE '%end'` - Ends with "end"
    - `LIKE '%middle%'` - Contains "middle"

- [ ] **Implement Search Endpoint** (Lecture 7, Slide 17f)
  - Create `/api/search?q=searchterm` endpoint
  - Use ILIKE for case-insensitive search
  - Search across multiple columns (name, description)
  - Add `%` wildcards: `const searchPattern = '%${q}%'`

---

### Part 9: Activities & Practice

- [ ] **Complete Activity: Plan Your API Enhancements** (Lecture 7, Slide 18 - 20 minutes)
  - Plan 3-5 new API endpoints using today's concepts
  - For each endpoint specify:
    - Endpoint URL (e.g., `GET /api/recipes-by-cuisine?cuisine=Italian`)
    - SQL Query that will power it
    - Purpose/feature it enables in frontend
  - Endpoint ideas:
    - Filter by category (WHERE)
    - Sortable list (ORDER BY)
    - Search by keyword (LIKE)
    - Dashboard metrics (aggregates)
    - Category breakdown (GROUP BY)

---

### Part 10: In-Class Exercises

- [ ] **Exercise 1A: Create Filter Endpoint** (Lecture 7, Slide 23 - 15 minutes)
  - Build new Netlify function that filters your data
  - Accept query parameter for category/type/status
  - Use WHERE clause with parameterized query
  - Test endpoint and verify results

- [ ] **Exercise 1B: Add Sorting** (Lecture 7, Slide 24 - 10 minutes)
  - Enhance filter endpoint with sorting
  - Accept sortBy parameter
  - Whitelist valid columns
  - Combine WHERE and ORDER BY

- [ ] **Exercise 2: Dashboard Stats** (Lecture 7, Slide 25 - 20 minutes)
  - Create `/api/stats` endpoint
  - Query aggregate statistics for your project
  - Include at least 3 different aggregate functions
  - Return as JSON object

- [ ] **Exercise 3: Search Function** (Lecture 7, Slide 26 - 15 minutes)
  - Build `/api/search` endpoint
  - Accept search query parameter
  - Use ILIKE to search 2+ columns
  - Return matching results

- [ ] **Exercise 4: Category Analytics** (Lecture 7, Slide 27 - 20 minutes)
  - Create endpoint for category breakdown
  - Use GROUP BY with aggregate functions
  - Add HAVING clause to filter results
  - Sort by count or average

---

### Best Practices from Lecture 7

- [ ] **Performance Considerations** (Lecture 7, Slide 20)
  - Select only needed columns (not SELECT *)
  - Filter early with WHERE
  - Index columns used in WHERE/ORDER BY
  - Use LIMIT for testing
  - Avoid leading wildcards in LIKE (`%text` slower than `text%`)

- [ ] **Common Pitfalls** (Lecture 7, Slide 19)
  - Don't forget GROUP BY when using aggregates
  - Maintain correct clause order: SELECT → FROM → WHERE → GROUP BY → HAVING → ORDER BY
  - Use parameterized queries to prevent SQL injection
  - Handle NULL values explicitly

---

## 📚 LECTURE 8: Advanced SQL - Subqueries, JOINs, and Set Operations

### Part 1: OUTER JOIN Operations

- [ ] **Understand LEFT OUTER JOIN** (Lecture 8, Slide 4)
  - Returns ALL rows from left table + matching rows from right
  - Unmatched right rows show as NULL
  - Use case: Show all categories even if some have no items
  - Syntax: `SELECT ... FROM table1 LEFT JOIN table2 ON condition`

- [ ] **Understand RIGHT OUTER JOIN** (Lecture 8, Slide 5)
  - Returns ALL rows from right table + matching rows from left
  - Can rewrite as LEFT JOIN by swapping tables
  - Use case: Show all items even if uncategorized

- [ ] **Understand FULL OUTER JOIN** (Lecture 8, Slide 6)
  - Returns ALL rows from both tables
  - Combines LEFT and RIGHT JOIN results
  - Note: Not supported in MySQL (simulate with UNION)
  - Use case: Data quality checks, find mismatches

---

### Part 2: Subqueries

- [ ] **Master Subquery Types** (Lecture 8, Slides 7-10)
  - **Scalar subquery:** Returns single value
  - **Row subquery:** Returns single row
  - **Table subquery:** Returns multiple rows/columns
  - **Correlated subquery:** References outer query (executed per row)

- [ ] **Use IN Operator** (Lecture 8, Slide 11)
  - Check if value exists in subquery results
  - Good for small result sets
  - Example: `WHERE category_id IN (SELECT id FROM categories WHERE active = true)`

- [ ] **Use ANY/SOME Operators** (Lecture 8, Slide 12)
  - Satisfy at least one value from subquery
  - SOME is synonym for ANY
  - Example: `WHERE price > ANY (SELECT price FROM items WHERE category = 'Budget')`

- [ ] **Use ALL Operator** (Lecture 8, Slide 13)
  - Satisfy all values from subquery
  - Example: `WHERE price > ALL (SELECT price FROM items WHERE category = 'Premium')`

- [ ] **Use EXISTS/NOT EXISTS** (Lecture 8, Slides 14-15)
  - Check if subquery returns any rows
  - Returns TRUE/FALSE
  - Faster than IN for large datasets
  - Example: `WHERE EXISTS (SELECT 1 FROM orders WHERE orders.product_id = products.id)`

---

### Part 3: Set Operations

- [ ] **Use UNION** (Lecture 8, Slide 16)
  - Combine results from multiple queries
  - Removes duplicates automatically
  - Queries must be union-compatible (same number/type of columns)

- [ ] **Use UNION ALL** (Lecture 8, Slide 17)
  - Includes duplicates
  - Faster than UNION (no duplicate removal)

- [ ] **Use INTERSECT** (Lecture 8, Slide 18)
  - Returns only rows in BOTH queries
  - Useful for finding common records

- [ ] **Use EXCEPT/MINUS** (Lecture 8, Slide 19)
  - Returns rows in first query but NOT in second
  - PostgreSQL uses EXCEPT, Oracle uses MINUS

---

### Part 4: Building JOIN-Based APIs

- [ ] **Create Your First JOIN API** (Lecture 8, Exercise 1 - 15 minutes)
  - Create new Netlify function joining 2 of your tables
  - Use LEFT JOIN to include all records from main table
  - Return enriched data (names, not just IDs)
  - Test endpoint in browser
  - Example endpoints: recipes-with-categories, movies-with-studios, products-with-suppliers

- [ ] **Update Frontend to Display JOIN Results** (Lecture 8, Slide 20)
  - Fetch JOIN endpoint data
  - Display related information beautifully
  - Use badges or formatting for related data
  - Show meaningful names instead of ID numbers

---

### Part 5: Activities & Exercises

- [ ] **Activity 1: JOIN Challenge** (Lecture 8, Activity 1 - 15 minutes)
  - Write queries for your project:
    1. Join 2 tables using INNER JOIN
    2. Join same tables using LEFT JOIN (observe differences)
    3. Find records in one table with NO matches in related table
    4. Find "orphaned" records (items without categories, orders without customers)

- [ ] **Activity 2: Subquery Master** (Lecture 8, Activity 2 - 20 minutes)
  - Write 5 subquery-based queries for your project:
    1. Items priced higher than overall average
    2. Records exceeding ALL values in specific category
    3. Categories where EVERY item meets condition
    4. Orphaned records (use EXISTS or NOT IN)
    5. Category with highest aggregate value
  - **Bonus:** Rewrite query #4 using both EXISTS and NOT IN approaches

- [ ] **Activity 3: Integration Challenge** (Lecture 8, Activity 3 - 25 minutes)
  - Create comprehensive analytics report showing:
    - All categories with their details
    - Count of related items per category
    - Average price/value/rating per category
    - Classification based on metrics (use CASE)
    - Comparison to overall averages
  - Requirements:
    - Use at least one OUTER JOIN
    - Include a subquery (correlated or scalar)
    - Use CASE statement for classification
    - Include GROUP BY with HAVING

---

### Part 6: Complex Multi-Table Queries

- [ ] **Exercise 1: Three-Table JOIN** (Lecture 8, Exercise 1 - 20 minutes)
  - Write query requiring THREE-TABLE INNER JOIN
  - Use table aliases for readability (e.g., r, ri, i)
  - Select meaningful columns from all three tables
  - Include WHERE filter to limit results
  - Examples:
    - Recipe DB: recipes → recipe_ingredients → ingredients (find ingredients in desserts)
    - Movie Rental: members → rentals → movies (show rentals for member)
    - E-commerce: orders → order_items → products → suppliers
    - Events: events → venues → organizers

- [ ] **Exercise 2: Aggregation & Grouping** (Lecture 8, Exercise 2 - 20 minutes)
  - Write 2+ queries with GROUP BY and HAVING
  - Use different aggregate functions
  - Filter aggregated results with HAVING
  - Use meaningful column aliases
  - Examples:
    - Count recipes per category (show only categories with >5 recipes)
    - Average rental price per studio (only studios with avg >$3)
    - Total sales per supplier (only suppliers with sales >$1000)

---

### Key Takeaways from Lecture 8

- [ ] **Master JOIN Types**
  - Know when to use INNER vs LEFT vs RIGHT vs FULL OUTER
  - Understand NULL handling in OUTER JOINs
  - Apply appropriate JOIN type for use case

- [ ] **Write Effective Subqueries**
  - Choose between scalar, row, table, and correlated subqueries
  - Understand performance implications
  - Know when to use subquery vs JOIN

- [ ] **Use Advanced Operators**
  - EXISTS/NOT EXISTS for existence checks (faster for large sets)
  - ANY/ALL for comparisons against multiple values
  - IN for small value lists

- [ ] **Build Rich APIs**
  - Create JOIN-based endpoints returning enriched data
  - Return meaningful information (names, descriptions) not just IDs
  - Choose between flat vs nested JSON structures
  - Improve user experience with complete data in single request

---

## 📚 LECTURE 9: Advanced SQL - Performance Optimization & Database Objects

### Part 1: Measuring API Performance

- [ ] **Learn to Measure Performance** (Lecture 9, Slide 3)
  - Open browser DevTools (F12) → Network tab
  - Reload page and observe API requests
  - Look at "Time" column for each request
  - Check TTFB (Time to First Byte) vs Content Download
  - Understand performance targets:
    - Under 100ms: Excellent
    - 100-300ms: Good
    - 300-500ms: Acceptable
    - Over 500ms: Needs optimization

- [ ] **Measure YOUR API Performance** (Lecture 9, Slide 4)
  - Test all your Netlify endpoints
  - Document baseline response times
  - Identify slow endpoints (>500ms)
  - Take screenshots for before/after comparison

---

### Part 2: Understanding EXPLAIN ANALYZE

- [ ] **Learn EXPLAIN Command** (Lecture 9, Slide 5)
  - Shows PostgreSQL's query execution plan
  - Reveals how database will execute query
  - Key terms:
    - **Seq Scan:** Sequential scan (slow for large tables)
    - **Index Scan:** Using index (fast)
    - **Cost:** Estimated resources needed
    - **Actual time:** Real execution time

- [ ] **Use EXPLAIN ANALYZE** (Lecture 9, Slide 6)
  - Runs query AND shows actual performance
  - Syntax: `EXPLAIN ANALYZE SELECT ...`
  - Look for red flags:
    - Sequential scans on large tables
    - High execution time
    - High cost estimates
  - Compare estimated vs actual rows

- [ ] **Practice EXPLAIN on Your Queries** (Lecture 9, Slide 7)
  - Run EXPLAIN ANALYZE on your complex queries
  - Identify bottlenecks
  - Look for columns without indexes
  - Document findings

---

### Part 3: Database Indexes

- [ ] **Understand Indexes** (Lecture 9, Slides 8-9)
  - Purpose: Allow database to find rows quickly
  - Like a book index - jump to page instead of reading all pages
  - Types: Single-column, composite, foreign key indexes
  - Trade-off: Speed up reads, slow down writes

- [ ] **Know When to Create Indexes** (Lecture 9, Slide 10)
  - Columns used in WHERE clauses
  - Columns used in JOIN ON conditions
  - Columns used in ORDER BY
  - Foreign key columns
  - Frequently searched columns

- [ ] **Create Strategic Indexes** (Lecture 9, Slide 11)
  - Syntax: `CREATE INDEX idx_name ON table_name(column_name);`
  - Composite index: `CREATE INDEX idx_name ON table(col1, col2);`
  - Naming convention: `idx_tablename_columnname`
  - Examples by project type:
    - **Hotel:** availability_status, room_type, booking dates
    - **Retail:** category_id, supplier_id, stock levels, sale_date
    - **Bakery:** product category, customer_id, order_date
    - **Club:** membership_status, event_date
    - **Parking:** availability_status, customer_id, time ranges

---

### Part 4: Database Views

- [ ] **Understand Views** (Lecture 9, Slide 12)
  - Virtual tables based on saved SELECT statements
  - Don't store data, just the query
  - Purpose: Simplify complex queries, reuse JOIN logic

- [ ] **Learn View Benefits** (Lecture 9, Slide 13)
  - Simplify API code (no repeated complex queries)
  - Code reuse across multiple endpoints
  - Security (hide sensitive columns)
  - Abstract complexity from frontend

- [ ] **Create Views** (Lecture 9, Slide 14)
  - Syntax: `CREATE VIEW view_name AS SELECT ...`
  - Replace: `CREATE OR REPLACE VIEW ...`
  - Query view like table: `SELECT * FROM view_name`

- [ ] **Understand View Limitations** (Lecture 9, Slide 15)
  - Can't update views with: GROUP BY, DISTINCT, joins, computed columns
  - Primarily for read-only operations
  - Can impact performance if overused

---

### Part 5: Database Triggers

- [ ] **Understand Triggers** (Lecture 9, Slide 16)
  - Automatic actions when events occur
  - Components:
    - **Event:** INSERT, UPDATE, DELETE
    - **Timing:** BEFORE, AFTER, INSTEAD OF
    - **Level:** Row or Statement
    - **Action:** SQL code to execute

- [ ] **Learn Trigger Use Cases** (Lecture 9, Slide 17)
  - Auto-update timestamps (updated_at)
  - Audit logging (track changes)
  - Inventory management (adjust stock on order)
  - Maintain calculated fields
  - Enforce complex business rules

- [ ] **Understand Trigger Trade-offs** (Lecture 9, Slide 18)
  - **Advantages:** Eliminate redundant code, improve integrity, centralized logic
  - **Disadvantages:** Performance overhead, debugging complexity, hidden logic, cascading effects

---

### Part 6: Stored Procedures & Functions

- [ ] **Learn Stored Procedures** (Lecture 9, Slide 19)
  - Precompiled SQL code stored in database
  - Syntax: `CREATE OR REPLACE PROCEDURE name(params) AS $$ ... $$ LANGUAGE plpgsql;`
  - Execute: `CALL procedure_name(params);`
  - Benefits: Performance, security, code reuse, reduced network traffic

- [ ] **Understand User-Defined Functions** (Lecture 9, Slide 20-21)
  - **Scalar Functions:** Return single value (e.g., calculate_discount)
  - **Table-Valued Functions:** Return table result set
  - Can be used in SELECT queries, calculations, filtering
  - Syntax: `CREATE OR REPLACE FUNCTION name(params) RETURNS type AS $$ ... $$ LANGUAGE plpgsql;`

---

### Part 7: Query Optimization Best Practices

- [ ] **Follow Optimization DO's** (Lecture 9, Slide 22)
  - ✅ Use indexes on WHERE, JOIN, ORDER BY columns
  - ✅ Specify exact columns needed (not SELECT *)
  - ✅ Filter early with WHERE clause
  - ✅ Use EXISTS over IN for large datasets
  - ✅ Analyze queries with EXPLAIN
  - ✅ Create views for complex repeated JOINs

- [ ] **Avoid Optimization DON'Ts** (Lecture 9, Slide 22)
  - ❌ Don't use SELECT * in production
  - ❌ Don't use unnecessary subqueries
  - ❌ Don't over-index (only index queried columns)
  - ❌ Don't use DISTINCT when not needed
  - ❌ Don't use functions in WHERE clauses
  - ❌ Don't forget indexes on foreign keys

---

### Part 8: In-Class Exercises

- [ ] **Exercise 1: Optimize YOUR Query** (Lecture 9, Slide 28 - 20 minutes)
  1. Choose a complex query from Lectures 7-8 from your project
  2. Run `EXPLAIN ANALYZE` to get baseline performance
  3. Identify bottleneck (look for Seq Scan, high cost, slow time)
  4. Create index on bottleneck column(s)
  5. Re-run `EXPLAIN ANALYZE` to compare before/after
  6. Document the improvement (e.g., "10x faster", "500ms → 50ms")
  - Focus on columns in: WHERE, JOIN ON, ORDER BY

- [ ] **Exercise 2: Create a View for YOUR Project** (Lecture 9, Slide 29 - 15 minutes)
  1. Choose complex query used in multiple API endpoints
  2. Create view with descriptive name (e.g., items_with_details, recipes_with_ingredients)
  3. Include at least one JOIN in the view
  4. Test the view: `SELECT * FROM your_view;`
  5. Update at least one API endpoint to use the new view
  - Required: At least one JOIN, descriptive naming, functional integration

---

### Part 9: Apply to Live Project

- [ ] **Optimize All Netlify APIs** (Lecture 9, Project Work)
  - Run EXPLAIN ANALYZE on all complex queries from Lectures 7-8
  - Create appropriate indexes for WHERE, JOIN, ORDER BY columns
  - Build views for repeated complex queries
  - Update API endpoints to use new views
  - Test performance improvements

- [ ] **Document Performance Gains** (Lecture 9, Deliverables)
  - Capture DevTools screenshots before optimization
  - Capture DevTools screenshots after optimization
  - Document response time improvements
  - Show EXPLAIN ANALYZE before/after results
  - Create comparison table of improvements

- [ ] **Implement Database Objects** (Lecture 9, Optional)
  - Create trigger for auto-updating timestamps (created_at, updated_at)
  - Implement audit logging trigger if applicable
  - Create stored procedures for complex business logic
  - Build user-defined functions for custom calculations

---

### Performance Targets & Expectations

- [ ] **Understand User Expectations** (Lecture 9, Slide 2)
  - Users expect pages under 3 seconds
  - 53% of mobile users abandon sites >3 seconds
  - Every 100ms delay = 1% decrease in conversions
  - Fast APIs = better user experience = more success

- [ ] **Achieve Optimization Goals** (Lecture 9, Examples)
  - Target 5-10x improvement with indexes
  - Example improvements from lecture:
    - Simple WHERE: 10x faster
    - JOIN queries: 5.7x faster
    - Aggregations: 4.3x faster
  - Aim for API responses under 300ms

---

### Final Project Deliverables

- [ ] **Complete Full-Stack Application** (All Lectures 6-9)
  - ✅ Neon PostgreSQL database with all tables
  - ✅ Complete CRUD API (GET, POST, PUT, DELETE)
  - ✅ Advanced filtering, sorting, search endpoints
  - ✅ JOIN-based endpoints for related data
  - ✅ Dashboard statistics endpoint
  - ✅ Category/group analytics endpoint
  - ✅ Optimized queries with indexes
  - ✅ Database views for complex queries
  - ✅ Frontend displaying all data beautifully
  - ✅ Live deployment on Netlify
  - ✅ Documentation with API endpoints

- [ ] **Performance Documentation**
  - Before/after DevTools screenshots
  - EXPLAIN ANALYZE results showing improvements
  - List of indexes created
  - List of views created
  - Response time comparisons

- [ ] **Code Quality**
  - Parameterized queries (prevent SQL injection)
  - Error handling in all endpoints
  - CORS headers configured
  - Environment variables properly secured
  - Clean, readable code with comments

---

## 🎯 Final Checklist Summary

### Essential Completions:
- ✅ All tables migrated to Neon
- ✅ Complete CRUD API implemented
- ✅ Advanced SQL queries (WHERE, ORDER BY, GROUP BY, JOINs, subqueries)
- ✅ Search, filter, sort functionality
- ✅ Dashboard analytics endpoints
- ✅ Performance optimization with indexes
- ✅ Views for complex queries
- ✅ Frontend displaying all features
- ✅ Live Netlify deployment
- ✅ Documentation and README

### Optional Enhancements:
- ⭐ Database triggers for timestamps
- ⭐ Stored procedures for business logic
- ⭐ User-defined functions
- ⭐ Advanced authentication
- ⭐ Pagination on all list endpoints
- ⭐ Advanced error handling and validation
- ⭐ Loading states and UI polish

---

## 📌 Quick Reference: Lecture Slide Numbers

- **Lecture 6:** 36 slides total
- **Lecture 7:** 40 slides total
- **Lecture 8:** Variable (extensive exercises)
- **Lecture 9:** Focus on optimization and database objects

**Navigation:** Each lecture has a home button in the timer display to return to course homepage. Use arrow keys or navigation buttons to move between slides.

---

## 💡 Tips for Success

1. **Work incrementally:** Complete each lecture's tasks before moving to the next
2. **Test frequently:** Use `netlify dev` to test locally before deploying
3. **Document everything:** Keep notes on what you've built and how it works
4. **Ask for help:** Don't get stuck - use office hours and classmate collaboration
5. **Measure improvements:** Always benchmark before and after optimization
6. **Think about YOUR domain:** Adapt generic examples to your specific database schema
7. **Keep security in mind:** Always use parameterized queries, never commit credentials

---

**Good luck building your full-stack database application!** 🚀

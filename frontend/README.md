# Mini Blog Post Creator

A simple full-stack blogging application where users can sign up, log in, and create, view, edit, and delete their own posts. Built with React, Node.js/Express, and Supabase (PostgreSQL), it features secure authentication with JWT and user-specific post management.

---

## Tech Stack

- **Frontend:** React  
- **Backend:** Node.js + Express  
- **Database:** Supabase (PostgreSQL)  
- **Authentication:** Supabase Auth (Email + Password)  
- **API Security:** JWT token validation on protected endpoints

---

## Database

- **Database Used:** Supabase (PostgreSQL)  
- **Reason:** Supabase provides a hosted Postgres database with built-in authentication support, making it easy to store users and posts securely. RLS is disabled, as access control is handled in the backend via JWT.

---

## Authentication

- **Method Used:** Supabase Auth (Email + Password)  
- **Flow:**
  - Users sign up with email and password → redirected to login page.  
  - Supabase sends a confirmation email; users must confirm before logging in.  
  - On login, a JWT token is issued and stored in `localStorage` (`sb-token`).  
  - All protected backend APIs require this JWT for access.  

---

## Running the Project Locally

### Backend
```bash
cd backend
npm install
```

Create `.env`:
```env
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your-anon-key
PORT=5000
```

Start backend:  
```bash
npm run dev
```
Runs at: http://localhost:5000  

### Frontend
```bash
cd frontend
npm install
npm start
```
Runs at: http://localhost:3000

---

## Database Schema

### Posts Table (`posts`)
| Column     | Type         | Notes |
|-----------|--------------|-------|
| id        | UUID / serial| Primary key |
| user_id   | UUID         | References logged-in user |
| title     | text         | Required, min 3 chars |
| content   | text         | Required, min 20 chars |
| tags      | text         | Optional, comma-separated |
| created_at| timestamp    | Auto-generated (UTC) |
| updated_at| timestamp    | Auto-updated on edit (UTC) |

> **Note:** User table is handled by Supabase Auth; no custom user table needed.  
> RLS is disabled; backend JWT validation ensures users can only access their own posts.

---

## JWT Validation

- JWT is obtained from Supabase Auth on login and stored in `localStorage` (`sb-token`).  
- All backend `/posts` routes require the JWT in the `Authorization: Bearer <token>` header.  
- Backend middleware verifies the token and attaches the authenticated user to the request.  
- Users can only access their own posts; attempts to access others’ posts are rejected with proper HTTP errors (401/403).

---

## Example API Requests

Use the following example user to test:

- Email: navyaanniejoy19@gmail.com  
- Password: navya123  

> Note: After signing up, Supabase sends a confirmation email. You must confirm the email before logging in.

### 1. Get all posts
```bash
curl -H "Authorization: Bearer <JWT_TOKEN>" http://localhost:5000/posts
```

### 2. Create a post
```bash
curl -X POST http://localhost:5000/posts \
-H "Authorization: Bearer <JWT_TOKEN>" \
-H "Content-Type: application/json" \
-d '{"title":"My First Post","content":"This is the content of my first post.","tags":"blog,example"}'
```

### 3. Update a post
```bash
curl -X PUT http://localhost:5000/posts/<POST_ID> \
-H "Authorization: Bearer <JWT_TOKEN>" \
-H "Content-Type: application/json" \
-d '{"title":"Updated Title","content":"Updated content","tags":"update"}'
```

### 4. Delete a post
```bash
curl -X DELETE http://localhost:5000/posts/<POST_ID> \
-H "Authorization: Bearer <JWT_TOKEN>"
```

> Tip: Replace `<JWT_TOKEN>` with the token obtained after logging in, and `<POST_ID>` with the ID of a post created by this user. All requests are scoped to the logged-in user.

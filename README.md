# Resume Builder API

Backend service for Resume Builder application built with Express and Supabase.

This API handles:
- Authentication (via Supabase)
- Resume CRUD
- Template selection & validation
- Section patching

## 📦 Installation

```bash
npm install
npm run dev
```

## Server Run on
http://localhost:5000

## Swagger
http://localhost:5000/api/docs

## 🧩 Template System

Templates in this project are layout identifiers only.

The backend does NOT render HTML templates.  
Instead, it stores a `template_id` on each resume record.

### How It Works

1. Frontend fetches available template IDs:
2. When a user selects a template:
3. Backend validates:
    - Template exists
    - Resume belongs to authenticated user
4. The updated `template_id` is saved in the database.
5. Frontend renders the correct template component based on `template_id`.

### Why This Design?

- Clear separation of concerns
- Backend handles validation & authorization
- Frontend handles rendering
- Scalable for SaaS model (free/pro templates)

## 📡 API Endpoints

### Templates

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/v1/templates | List available template IDs |

### Resume

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/v1/resumes | List user resumes |
| POST | /api/v1/resumes | Create resume |
| PATCH | /api/v1/resumes/:id/meta | Update title or template |
| DELETE | /api/v1/resumes/:id | Delete resume |


## 🛠 Tech Stack

- Node.js
- Express
- TypeScript
- Supabase (Auth + Database)
- OpenAPI 3 (Swagger)


## 🗄 Database Structure

### resumes table

| Column | Type |
|--------|------|
| id | uuid |
| user_id | uuid |
| title | text |
| template_id | text |
| data | jsonb |
| created_at | timestamptz |
| updated_at | timestamptz |

## 🔐 Security

- JWT authentication via Supabase
- Users can only access their own resumes
- Template IDs are validated server-side


## Template Architecture

Templates are frontend-rendered layout components.

The backend:
- Returns available template IDs
- Validates template selection
- Stores template_id on resume record

This design keeps rendering logic in the frontend and business rules in the backend.



# Xyric Backend (Express + TypeScript + PostgreSQL)

## Prerequisites

- Node.js 18+
- Docker (for PostgreSQL)

## Setup

1. Copy environment file:

```bash
copy .env.example .env
```

2. Start PostgreSQL:

```bash
docker compose up -d
```

3. Install dependencies:

```bash
npm install
```

4. Run database migration:

```bash
npm run migrate
```

5. Start dev server:

```bash
npm run dev
```

Server runs on `http://localhost:4000` by default.

## API

Base URL: `/api/items`

- GET `/` list with search and pagination
  - Query: `q`, `page`, `pageSize`, `status`, `category`
  - Response: `{ items: Item[], total, page, pageSize }`
- GET `/:id` get single item
- POST `/` create item
- PUT `/:id` update item (partial allowed)
- DELETE `/:id` delete item

### Item schema

```json
{
  "id": 1,
  "title": "string",
  "description": "string",
  "category": "string",
  "price": "12.34",
  "quantity": 0,
  "tags": ["tag1"],
  "status": "active",
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:00.000Z"
}
```

### Validation

- Uses Zod in controllers for body/query parsing and errors return 400.

### Health check

- GET `/health` → `{ status: "ok" }`

# Xyric Items Manager

A full-stack CRUD + search application built with **Node.js, TypeScript, Express, PostgreSQL, and React**.  
The app allows users to create, update, delete, search, and paginate through items.  

---

## 🚀 Tech Choices & Reasons

### Backend
- **Node.js + Express + TypeScript**  
  - Chosen for clarity, strong typing, and rapid development.  
  - Used `pg` instead of Prisma to explicitly demonstrate SQL query design (filters, pagination, full-text search).

- **PostgreSQL (via Docker Compose)**  
  - Reliable relational DB, perfect for structured data.  
  - Used **constraints** (`CHECK`, `NOT NULL`, defaults) to enforce data integrity.  
  - Added a **GIN full-text index** on `title + description` for efficient search.  
  - Included **pgAdmin in Docker** for database inspection.  

### Frontend
- **React + TypeScript**  
  - Provides strong typing + clear component structure.  
  - Built responsive components: search, pagination, modals for create/update.  
  - Debounced search (`useDebouncedValue`) for better UX.  
  - Toast notifications for user feedback.  

### UX Improvements
- Responsive table → card-like view on mobile with `data-label`.  
- Background scroll lock when modal is open.  
- Confirm dialog before delete.  

---

## ⚖️ What I’d Improve With More Time
- **Authentication & Authorization**: Add user login and role-based permissions.  
- **Better Search UX**:  
  - Highlight matched keywords in results.  
  - Combine full-text search relevance ranking with substring fallback.  
- **CI/CD**: GitHub Actions for test + lint + Docker build pipelines.  
- **Testing**: Unit tests for services, integration tests for API.
- **Cloud Deployment**: Deploy via Render/Heroku/AWS, and use managed Postgres.  
- **Advanced Filters**: Date range filters, multiple tags, sorting options.  

---

## 🛠️ How to Run Locally

1. Clone the repo:
   ```bash
   git clone https://github.com/MSamiTariq/xyric-FSD.git
   cd xyric-FSD

2. Start services (Postgres + pgAdmin):

   ```bash
   cd backend
   docker-compose up -d
   ```

3. Run backend migrations:

   ```bash
   npm install
   npx ts-node src/db/migrate.ts
   npm run dev
   ```

4. Start frontend:

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

5. Visit:

   * Frontend: `http://localhost:5173`
   * Backend API: `http://localhost:4000/api/items`
   * pgAdmin: `http://localhost:5050`


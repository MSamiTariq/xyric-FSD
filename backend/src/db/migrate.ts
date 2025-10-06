import pool from "./pool";

async function migrate() {
  const query = `
    CREATE TABLE IF NOT EXISTS items (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      category VARCHAR(100),
      price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
      quantity INT NOT NULL DEFAULT 0,
      tags TEXT[],
      status VARCHAR(50) DEFAULT 'active',
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );

    -- Index for faster search on title + description
    CREATE INDEX IF NOT EXISTS idx_items_search
    ON items USING GIN (to_tsvector('english', title || ' ' || description));
  `;

  try {
    await pool.query(query);
    console.log("✅ Migration complete");
  } catch (err) {
    console.error("❌ Migration failed:", err);
  } finally {
    await pool.end();
  }
}

migrate();

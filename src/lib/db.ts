// lib/db.ts
import { Pool } from 'pg'

// Cria um pool de conexões com o banco
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Pega do arquivo .env.local
})

export default pool

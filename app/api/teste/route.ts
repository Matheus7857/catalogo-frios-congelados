// app/api/teste/route.ts
import { NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function GET() {
  try {
    const result = await pool.query('SELECT NOW()')
    return NextResponse.json({ status: 'Conectado!', hora: result.rows[0].now })
  } catch (err) {
    console.error('erro /api/teste:', err)
    return NextResponse.json({ error: 'Erro ao conectar ao banco' }, { status: 500 })
  }
}

// Database configuration - NUNCA exponha credenciais no código!
// Use variáveis de ambiente para proteger dados sensíveis

/**
 * Configuração do banco de dados MySQL
 * 
 * IMPORTANTE:
 * - Essas variáveis são SERVER-SIDE ONLY (sem NEXT_PUBLIC_)
 * - NUNCA são expostas ao browser
 * - Use .env.local para desenvolvimento
 * - Configure no provedor (Vercel, etc.) para produção
 */
export const dbConfig = {
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '3306', 10),
  user: process.env.DATABASE_USER || 'root',
  password: process.env.DATABASE_PASSWORD || '',
  database: process.env.DATABASE_NAME || 'poke',
  
  // Configurações adicionais de segurança e performance
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
}

/**
 * Cria uma conexão com o banco de dados
 * 
 * @param {object} mysql - mysql2/promise module
 * @returns {Promise<Connection>}
 * 
 * @example
 * import mysql from 'mysql2/promise'
 * import { createDbConnection } from '@/lib/db-config'
 * 
 * const connection = await createDbConnection(mysql)
 * // use connection
 * await connection.end()
 */
export async function createDbConnection(mysql) {
  try {
    const connection = await mysql.createConnection(dbConfig)
    return connection
  } catch (error) {
    console.error('❌ Erro ao conectar ao banco de dados:', error)
    throw new Error('Falha na conexão com o banco de dados')
  }
}

/**
 * Pool de conexões (mais eficiente para múltiplas requisições)
 * Use isso em produção para melhor performance
 */
let pool = null

export function getDbPool(mysql) {
  if (!pool) {
    pool = mysql.createPool(dbConfig)
  }
  return pool
}

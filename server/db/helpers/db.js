const fs = require('fs')
const path = require('path')
const sqlite = require('better-sqlite3')
const { Pool } = require('pg')

const configuredDbType = (process.env.DB_TYPE || 'sqlite').toLowerCase()
const sqlitePath = process.env.SQLITE_PATH || path.resolve('data/tasks.db')
const databaseUrl = process.env.DATABASE_URL

let adapter = 'sqlite'
let sqliteInstance
let pool

function ensureSqliteDirectory() {
  fs.mkdirSync(path.dirname(sqlitePath), { recursive: true })
}

function getSqliteInstance() {
  if (!sqliteInstance) {
    ensureSqliteDirectory()
    sqliteInstance = new sqlite(sqlitePath)
  }
  return sqliteInstance
}

const isPostgresRequested = ['postgres', 'postgresql', 'pg'].includes(configuredDbType)
if (isPostgresRequested && databaseUrl) {
  adapter = 'postgresql'
  pool = new Pool({
    connectionString: databaseUrl,
    ssl: process.env.PGSSLMODE === 'require' ? { rejectUnauthorized: false } : undefined
  })

  pool.on('error', (err) => {
    console.error('Unexpected database error', err)
  })
} else if (isPostgresRequested) {
  console.warn('DATABASE_URL not provided. Falling back to SQLite.')
}

function getNamedBindings(sql, params = {}) {
  const matches = [...sql.matchAll(/@([a-zA-Z0-9_]+)/g)]
  const names = [...new Set(matches.map(([, name]) => name))]

  return {
    sql: sql.replace(/@([a-zA-Z0-9_]+)/g, (_, name) => `$${names.indexOf(name) + 1}`),
    values: names.map((name) => params[name])
  }
}

async function queryAll(sql, params = {}) {
  if (adapter === 'postgresql') {
    const { sql: text, values } = getNamedBindings(sql, params)
    const result = await pool.query(text, values)
    return result.rows
  }

  const db = getSqliteInstance()
  return db.prepare(sql).all(params)
}

async function queryOne(sql, params = {}) {
  if (adapter === 'postgresql') {
    const { sql: text, values } = getNamedBindings(sql, params)
    const result = await pool.query(text, values)
    return result.rows[0] || null
  }

  const db = getSqliteInstance()
  return db.prepare(sql).get(params)
}

async function run(sql, params = {}) {
  if (adapter === 'postgresql') {
    const { sql: text, values } = getNamedBindings(sql, params)
    const result = await pool.query(text, values)
    return { changes: result.rowCount }
  }

  const db = getSqliteInstance()
  return db.prepare(sql).run(params)
}

module.exports = {
  adapter,
  queryAll,
  queryOne,
  run
}

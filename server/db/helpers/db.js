const sqlite = require('better-sqlite3');
const path = require('path');
const isDevelopment = process.env.NODE_ENV !== 'production'
const dbPath = process.env.DB_PATH || (
  isDevelopment
    ? path.resolve('public/db/tasks.db') // if in dev mode
    : path.join(process.resourcesPath, 'db/tasks.db') // the resources path if in production build
);

const db = new sqlite(dbPath);

function queryAll(sql, params) {
  return db.prepare(sql).all(params);
}

function queryOne(sql, params) {
    return db.prepare(sql).get(params);
  }

function run(sql, params) {
  return db.prepare(sql).run(params);
}

module.exports = {
queryAll,
  queryOne,
  run
}
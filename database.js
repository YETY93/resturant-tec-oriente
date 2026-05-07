const { DatabaseSync } = require('node:sqlite');
const db = new DatabaseSync('./restaurante.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS tables (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    number INTEGER UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT 1
  )
`);

module.exports = db;
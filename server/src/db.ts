import { DatabaseSync } from 'node:sqlite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = process.env.DATA_DIR ?? path.join(__dirname, '../../data');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const db = new DatabaseSync(path.join(DATA_DIR, 'trafficman.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS shares (
    token      TEXT PRIMARY KEY,
    payload    TEXT NOT NULL,
    created_at INTEGER NOT NULL DEFAULT (unixepoch()),
    expires_at INTEGER NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_shares_expires ON shares(expires_at);
`);

// Prune expired rows on startup
db.prepare('DELETE FROM shares WHERE expires_at < unixepoch()').run();

export default db;

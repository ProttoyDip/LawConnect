const fs = require('fs/promises');
const path = require('path');
const { pool } = require('../config/db');

async function ensureMigrationsTable() {
  const query = `
    CREATE TABLE IF NOT EXISTS migrations (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL UNIQUE,
      run_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  await pool.execute(query);
}

async function getExecutedMigrations() {
  const [rows] = await pool.execute('SELECT name FROM migrations');
  return new Set(rows.map((row) => row.name));
}

async function getSqlMigrationFiles() {
  const migrationsDir = path.resolve(__dirname);
  const files = await fs.readdir(migrationsDir);

  return files
    .filter((file) => file.endsWith('.sql'))
    .sort((a, b) => a.localeCompare(b));
}

async function runMigrations() {
  try {
    await ensureMigrationsTable();

    const executed = await getExecutedMigrations();
    const migrationFiles = await getSqlMigrationFiles();

    for (const file of migrationFiles) {
      if (executed.has(file)) {
        console.log(`Skipped... ${file}`);
        continue;
      }

      console.log(`Running migration... ${file}`);
      const fullPath = path.join(__dirname, file);
      const sql = await fs.readFile(fullPath, 'utf8');

      const connection = await pool.getConnection();
      try {
        await connection.beginTransaction();
        await connection.query(sql);
        await connection.execute('INSERT INTO migrations (name) VALUES (?)', [file]);
        await connection.commit();
      } catch (error) {
        await connection.rollback();
        throw error;
      } finally {
        connection.release();
      }

      console.log(`Done ${file}`);
    }

    console.log('Done');
  } catch (error) {
    console.error('Migration failed:', error.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

runMigrations();

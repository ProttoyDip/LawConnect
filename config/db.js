const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const { URL } = require('url');

dotenv.config();

function firstDefined(...values) {
  for (const value of values) {
    if (value !== undefined && value !== null && String(value).trim() !== '') {
      return value;
    }
  }

  return undefined;
}

function parseConnectionUrl(connectionUrl) {
  if (!connectionUrl) {
    return null;
  }

  try {
    const parsed = new URL(connectionUrl);

    return {
      host: parsed.hostname || undefined,
      port: parsed.port ? Number(parsed.port) : undefined,
      user: parsed.username || undefined,
      password: parsed.password || undefined,
      database: parsed.pathname ? decodeURIComponent(parsed.pathname.replace(/^\//, '')) || undefined : undefined,
      ssl: parsed.searchParams.get('ssl'),
    };
  } catch {
    return null;
  }
}

const connectionUrlConfig =
  parseConnectionUrl(process.env.DATABASE_URL) || parseConnectionUrl(process.env.MYSQL_URL) || {};

const host = firstDefined(
  process.env.DB_HOST,
  process.env.MYSQLHOST,
  process.env.MYSQL_HOST,
  connectionUrlConfig.host
);
const port = Number(
  firstDefined(process.env.DB_PORT, process.env.MYSQLPORT, process.env.MYSQL_PORT, connectionUrlConfig.port) || 3306
);
const user = firstDefined(
  process.env.DB_USER,
  process.env.DB_USERNAME,
  process.env.MYSQLUSER,
  process.env.MYSQL_USER,
  connectionUrlConfig.user
);
const password = firstDefined(
  process.env.DB_PASSWORD,
  process.env.MYSQLPASSWORD,
  process.env.MYSQL_PASSWORD,
  connectionUrlConfig.password
);
const database = firstDefined(
  process.env.DB_NAME,
  process.env.DB_DATABASE,
  process.env.MYSQLDATABASE,
  process.env.MYSQL_DATABASE,
  connectionUrlConfig.database,
  'railway'
);
const requiresSsl = String(
  firstDefined(process.env.DB_SSL, process.env.MYSQL_SSL, connectionUrlConfig.ssl, 'false')
).toLowerCase() === 'true';

const requiredVars = [
  ['host', host],
  ['port', Number.isFinite(port) ? port : undefined],
  ['user', user],
  ['password', password],
  ['database', database],
];

const missingVars = requiredVars.filter(([, value]) => !value).map(([key]) => key);

if (missingVars.length > 0) {
  throw new Error(`Missing required database config values: ${missingVars.join(', ')}`);
}

const pool = mysql.createPool({
  host,
  port,
  user,
  password,
  database,
  ssl: requiresSsl ? { rejectUnauthorized: false } : undefined,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

async function checkDatabaseConnection() {
  let connection;
  try {
    connection = await pool.getConnection();
    await connection.query('SELECT 1');
    console.log(`Database connection established (${user}@${host}:${port}/${database}).`);
  } catch (error) {
    console.error(`Failed to connect to database (${user}@${host}:${port}/${database}):`, error.message);
    throw error;
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

module.exports = {
  pool,
  checkDatabaseConnection,
};

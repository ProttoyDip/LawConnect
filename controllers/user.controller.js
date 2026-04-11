const { pool } = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const DEFAULT_ROLE = 'citizen';
const FIXED_ADMIN_NAME = 'Super Administrator';

function getJwtSecret() {
  return process.env.JWT_SECRET || 'lawconnect-dev-secret-change-in-production';
}

function getFixedAdminEmail() {
  return (process.env.ADMIN_EMAIL || 'prottoy.cse.20230104108@aust.edu').trim();
}

function getFixedAdminPassword() {
  return process.env.ADMIN_PASSWORD || 'admin123';
}

function isFixedAdminEmail(email) {
  return Boolean(email) && email.toLowerCase() === getFixedAdminEmail().toLowerCase();
}

function getUserRoleByEmail(email) {
  return isFixedAdminEmail(email) ? 'super_admin' : DEFAULT_ROLE;
}

async function ensureFixedSuperAdminAccount() {
  const hashedPassword = await bcrypt.hash(getFixedAdminPassword(), 12);

  await pool.execute(
    `
      INSERT INTO users (name, email, password)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE
        name = VALUES(name),
        password = VALUES(password)
    `,
    [FIXED_ADMIN_NAME, getFixedAdminEmail(), hashedPassword]
  );
}

function createAuthToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role: user.role || getUserRoleByEmail(user.email) || DEFAULT_ROLE,
    },
    getJwtSecret(),
    { expiresIn: '7d' }
  );
}

function parseBearerToken(req) {
  const authHeader = req.headers.authorization || '';

  if (!authHeader.startsWith('Bearer ')) {
    return null;
  }

  return authHeader.slice(7).trim() || null;
}

async function getCurrentUser(req, res, next) {
  try {
    const token = parseBearerToken(req);

    if (!token) {
      return res.status(401).json({ message: 'Unauthenticated.' });
    }

    const payload = jwt.verify(token, getJwtSecret());
    const userId = Number(payload.sub);

    if (!Number.isFinite(userId)) {
      return res.status(401).json({ message: 'Unauthenticated.' });
    }

    const [rows] = await pool.execute(
      'SELECT id, name, email, created_at FROM users WHERE id = ? LIMIT 1',
      [userId]
    );
    const user = rows[0];

    if (!user) {
      return res.status(401).json({ message: 'Unauthenticated.' });
    }

    return res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: getUserRoleByEmail(user.email),
    });
  } catch (error) {
    if (error && (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError')) {
      return res.status(401).json({ message: 'Unauthenticated.' });
    }

    return next(error);
  }
}

async function loginUser(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    let [rows] = await pool.execute(
      'SELECT id, name, email, password FROM users WHERE email = ? LIMIT 1',
      [email]
    );
    let user = rows[0];

    if (isFixedAdminEmail(email) && password === getFixedAdminPassword()) {
      await ensureFixedSuperAdminAccount();
      [rows] = await pool.execute(
        'SELECT id, name, email, password FROM users WHERE email = ? LIMIT 1',
        [email]
      );
      user = rows[0];
    }

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const role = getUserRoleByEmail(user.email);
    const token = createAuthToken({ id: user.id, email: user.email, role });

    return res.status(200).json({
      message: 'Login successful.',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role,
      },
      token,
    });
  } catch (error) {
    return next(error);
  }
}

async function logoutUser(req, res) {
  return res.status(200).json({ message: 'Logged out successfully' });
}

async function getMyReports(req, res) {
  return res.status(200).json([]);
}

async function getCrimeReports(req, res) {
  return res.status(200).json({ data: [] });
}

async function getAdminAnalytics(req, res) {
  const [rows] = await pool.execute('SELECT COUNT(*) AS total_users FROM users');

  return res.status(200).json({
    total_reports: 0,
    pending_reports: 0,
    investigating: 0,
    resolved_reports: 0,
    closed_reports: 0,
    total_users: Number(rows[0]?.total_users || 0),
    total_officers: 0,
    by_category: {},
    by_priority: {},
    recent_reports: [],
  });
}

async function getAdminUsers(req, res) {
  const fixedAdminEmail = getFixedAdminEmail().toLowerCase();
  const [rows] = await pool.execute('SELECT id, name, email FROM users ORDER BY id DESC');

  return res.status(200).json({
    users: rows.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.email.toLowerCase() === fixedAdminEmail ? 'super_admin' : DEFAULT_ROLE,
    })),
    active_user_ids: [],
  });
}

async function createAdminUser(req, res, next) {
  try {
    const { name, email, role } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: 'name and email are required' });
    }

    const tempPassword = await bcrypt.hash('temporary-password-123', 12);
    const [result] = await pool.execute(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, tempPassword]
    );

    const createdUser = {
      id: result.insertId,
      name,
      email,
      role: role || getUserRoleByEmail(email),
    };

    return res.status(201).json({
      message: 'User created successfully.',
      user: {
        data: createdUser,
      },
      mail_sent: false,
    });
  } catch (error) {
    if (error && error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Email already exists' });
    }

    return next(error);
  }
}

async function deleteAdminUser(req, res, next) {
  try {
    const userId = Number(req.params.user || req.params.userId);

    if (!Number.isFinite(userId)) {
      return res.status(400).json({ message: 'Invalid user id' });
    }

    const [result] = await pool.execute('DELETE FROM users WHERE id = ?', [userId]);

    return res.status(200).json({
      message: 'User deleted successfully.',
      deleted: result.affectedRows > 0,
    });
  } catch (error) {
    return next(error);
  }
}

async function getOfficers(req, res) {
  return res.status(200).json([]);
}

async function getNotifications(req, res) {
  return res.status(200).json({ data: [], unread_count: 0 });
}

async function markNotificationRead(req, res) {
  return res.status(200).json({ message: 'Notification marked as read.' });
}

async function markAllNotificationsRead(req, res) {
  return res.status(200).json({ message: 'All notifications marked as read.' });
}

async function getInvestigatorStats(req, res) {
  return res.status(200).json({ total_cases: 0, investigating: 0, resolved: 0, pending: 0 });
}

async function getInvestigatorCases(req, res) {
  return res.status(200).json({
    data: [],
    total: 0,
    per_page: 15,
    current_page: 1,
    last_page: 1,
  });
}

async function getInvestigatorCase(req, res) {
  return res.status(404).json({ message: 'Case not found' });
}

async function registerUser(req, res, next) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'name, email and password are required',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const [result] = await pool.execute(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    );

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        id: result.insertId,
        name,
        email,
      },
    });
  } catch (error) {
    if (error && error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        success: false,
        message: 'Email already exists',
      });
    }

    return next(error);
  }
}

async function getUsers(req, res, next) {
  try {
    const [rows] = await pool.execute('SELECT id, name, email, created_at FROM users ORDER BY id DESC');

    return res.status(200).json({ success: true, data: rows });
  } catch (error) {
    return next(error);
  }
}

async function registerAuthUser(req, res, next) {
  try {
    const { name, email, password, password_confirmation } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'name, email and password are required' });
    }

    if (password_confirmation !== undefined && password !== password_confirmation) {
      return res.status(422).json({ message: 'Password confirmation does not match.' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const [result] = await pool.execute(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    );

    const userRole = getUserRoleByEmail(email);
    const user = {
      id: result.insertId,
      name,
      email,
      role: userRole,
    };

    const token = createAuthToken(user);

    return res.status(201).json({
      message: 'Registration successful.',
      user,
      token,
    });
  } catch (error) {
    if (error && error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Email already exists' });
    }

    return next(error);
  }
}

module.exports = {
  ensureFixedSuperAdminAccount,
  registerAuthUser,
  loginUser,
  getCurrentUser,
  logoutUser,
  getMyReports,
  getCrimeReports,
  getAdminAnalytics,
  getAdminUsers,
  createAdminUser,
  deleteAdminUser,
  getOfficers,
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  getInvestigatorStats,
  getInvestigatorCases,
  getInvestigatorCase,
  registerUser,
  getUsers,
};

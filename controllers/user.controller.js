const { pool } = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const DEFAULT_ROLE = 'citizen';
const FIXED_ADMIN_NAME = 'Super Administrator';
let passwordResetTableReady = false;

function getFrontendUrl() {
  return (process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/+$/, '');
}

function getMailFromAddress() {
  return process.env.MAIL_FROM_ADDRESS || process.env.MAIL_USERNAME || 'no-reply@lawconnect.local';
}

function getMailFromName() {
  return process.env.MAIL_FROM_NAME || 'LawConnect';
}

function getResetTokenTtlMinutes() {
  const value = Number(process.env.PASSWORD_RESET_EXPIRES_MINUTES || 60);
  return Number.isFinite(value) && value > 0 ? value : 60;
}

function getResetTokenHash(rawToken) {
  return crypto.createHash('sha256').update(rawToken).digest('hex');
}

function createMailTransport() {
  const host = process.env.MAIL_HOST;
  const port = Number(process.env.MAIL_PORT || 587);
  const user = process.env.MAIL_USERNAME;
  const pass = process.env.MAIL_PASSWORD;

  if (!host || !user || !pass) {
    return null;
  }

  const secure = String(process.env.MAIL_ENCRYPTION || '').toLowerCase() === 'ssl' || port === 465;

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
  });
}

async function ensurePasswordResetsTable() {
  if (passwordResetTableReady) {
    return;
  }

  await pool.execute(`
    CREATE TABLE IF NOT EXISTS password_resets (
      email VARCHAR(255) NOT NULL,
      token VARCHAR(255) NOT NULL,
      created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
      INDEX password_resets_email_index (email)
    ) ENGINE=InnoDB
  `);

  passwordResetTableReady = true;
}

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

async function forgotPassword(req, res, next) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required.' });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    if (!normalizedEmail || !normalizedEmail.includes('@')) {
      return res.status(422).json({ message: 'A valid email address is required.' });
    }

    await ensurePasswordResetsTable();

    const [rows] = await pool.execute('SELECT id FROM users WHERE email = ? LIMIT 1', [normalizedEmail]);
    if (!rows[0]) {
      return res.status(200).json({ message: 'If an account exists, reset instructions have been sent.' });
    }

    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = getResetTokenHash(rawToken);

    await pool.execute('DELETE FROM password_resets WHERE email = ?', [normalizedEmail]);
    await pool.execute('INSERT INTO password_resets (email, token, created_at) VALUES (?, ?, NOW())', [
      normalizedEmail,
      tokenHash,
    ]);

    const resetUrl = `${getFrontendUrl()}/password-reset/${encodeURIComponent(rawToken)}?email=${encodeURIComponent(
      normalizedEmail
    )}`;

    const transport = createMailTransport();
    if (!transport) {
      return res.status(503).json({ message: 'Email service is not configured on the server.' });
    }

    await transport.sendMail({
      from: `${getMailFromName()} <${getMailFromAddress()}>`,
      to: normalizedEmail,
      subject: 'LawConnect password reset',
      text: `We received a request to reset your password.\n\nUse this link to reset it:\n${resetUrl}\n\nThis link expires in ${getResetTokenTtlMinutes()} minutes.`,
      html: `<p>We received a request to reset your password.</p><p><a href="${resetUrl}">Reset Password</a></p><p>This link expires in ${getResetTokenTtlMinutes()} minutes.</p>`,
    });

    return res.status(200).json({ message: 'Password reset instructions sent to your email.' });
  } catch (error) {
    return next(error);
  }
}

async function resetPassword(req, res, next) {
  try {
    const { token, email, password, password_confirmation } = req.body;

    if (!token || !email || !password || !password_confirmation) {
      return res.status(400).json({ message: 'token, email, password and password_confirmation are required.' });
    }

    if (password !== password_confirmation) {
      return res.status(422).json({ message: 'Password confirmation does not match.' });
    }

    if (String(password).length < 8) {
      return res.status(422).json({ message: 'Password must be at least 8 characters.' });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const [rows] = await pool.execute(
      'SELECT email, token, created_at FROM password_resets WHERE email = ? ORDER BY created_at DESC LIMIT 1',
      [normalizedEmail]
    );
    const resetRow = rows[0];

    if (!resetRow) {
      return res.status(404).json({ message: 'Reset token not found for this email.' });
    }

    const tokenAgeMs = Date.now() - new Date(resetRow.created_at).getTime();
    const expiresInMs = getResetTokenTtlMinutes() * 60 * 1000;
    if (!Number.isFinite(tokenAgeMs) || tokenAgeMs > expiresInMs) {
      await pool.execute('DELETE FROM password_resets WHERE email = ?', [normalizedEmail]);
      return res.status(410).json({ message: 'Reset token has expired. Please request a new one.' });
    }

    const providedHash = getResetTokenHash(String(token));
    if (providedHash !== resetRow.token) {
      return res.status(422).json({ message: 'Invalid reset token.' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const [updateResult] = await pool.execute('UPDATE users SET password = ? WHERE email = ?', [
      hashedPassword,
      normalizedEmail,
    ]);

    if (!updateResult.affectedRows) {
      return res.status(404).json({ message: 'User not found.' });
    }

    await pool.execute('DELETE FROM password_resets WHERE email = ?', [normalizedEmail]);

    return res.status(200).json({ message: 'Password reset successful.' });
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
  forgotPassword,
  resetPassword,
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

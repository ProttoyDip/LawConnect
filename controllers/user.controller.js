const { pool } = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const DEFAULT_ROLE = 'citizen';

function getJwtSecret() {
  return process.env.JWT_SECRET || 'lawconnect-dev-secret-change-in-production';
}

function createAuthToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role: user.role || DEFAULT_ROLE,
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
      return res.status(401).json({
        message: 'Unauthenticated.',
      });
    }

    const payload = jwt.verify(token, getJwtSecret());
    const userId = Number(payload.sub);

    if (!Number.isFinite(userId)) {
      return res.status(401).json({
        message: 'Unauthenticated.',
      });
    }

    const [rows] = await pool.execute('SELECT id, name, email, created_at FROM users WHERE id = ? LIMIT 1', [userId]);
    const user = rows[0];

    if (!user) {
      return res.status(401).json({
        message: 'Unauthenticated.',
      });
    }

    return res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: DEFAULT_ROLE,
    });
  } catch (error) {
    if (error && (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError')) {
      return res.status(401).json({
        message: 'Unauthenticated.',
      });
    }

    return next(error);
  }
}

async function loginUser(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required.',
      });
    }

    const [rows] = await pool.execute(
      'SELECT id, name, email, password, created_at FROM users WHERE email = ? LIMIT 1',
      [email]
    );

    const user = rows[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        message: 'Invalid credentials.',
      });
    }

    const token = createAuthToken({ id: user.id, email: user.email, role: DEFAULT_ROLE });

    return res.status(200).json({
      message: 'Login successful.',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: DEFAULT_ROLE,
      },
      token,
    });
  } catch (error) {
    return next(error);
  }
}

async function logoutUser(req, res) {
  return res.status(200).json({
    message: 'Logged out successfully',
  });
}

async function getMyReports(req, res) {
  return res.status(200).json([]);
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

    const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
    const [result] = await pool.execute(query, [name, email, hashedPassword]);

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
    const [rows] = await pool.execute(
      'SELECT id, name, email, created_at FROM users ORDER BY id DESC'
    );

    return res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (error) {
    return next(error);
  }
}

async function registerAuthUser(req, res, next) {
  try {
    const { name, email, password, password_confirmation } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: 'name, email and password are required',
      });
    }

    if (password_confirmation !== undefined && password !== password_confirmation) {
      return res.status(422).json({
        message: 'Password confirmation does not match.',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const [result] = await pool.execute('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [
      name,
      email,
      hashedPassword,
    ]);

    const user = {
      id: result.insertId,
      name,
      email,
      role: DEFAULT_ROLE,
    };

    const token = createAuthToken(user);

    return res.status(201).json({
      message: 'Registration successful.',
      user,
      token,
    });
  } catch (error) {
    if (error && error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        message: 'Email already exists',
      });
    }

    return next(error);
  }
}

module.exports = {
  registerAuthUser,
  loginUser,
  getCurrentUser,
  logoutUser,
  getMyReports,
  registerUser,
  getUsers,
};

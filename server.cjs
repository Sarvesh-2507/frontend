const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// Simple JWT implementation for mock server
const jwt = {
  sign: (payload, secret, options) => {
    // Simple base64 encoding for mock purposes
    const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64');
    const payloadStr = Buffer.from(JSON.stringify({ ...payload, exp: Date.now() + (options.expiresIn === '15m' ? 15 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000) })).toString('base64');
    return `${header}.${payloadStr}.signature`;
  },
  verify: (token, secret) => {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
      if (payload.exp < Date.now()) return null;
      return payload;
    } catch {
      return null;
    }
  }
};

// Secret key for JWT (in production, use environment variable)
const JWT_SECRET = 'your-secret-key-here';
const JWT_REFRESH_SECRET = 'your-refresh-secret-key-here';

// Helper function to read database
const getDb = () => {
  const dbPath = path.join(__dirname, 'db.json');
  const data = fs.readFileSync(dbPath, 'utf8');
  return JSON.parse(data);
};

// Helper function to generate tokens
const generateTokens = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    username: user.username,
    role: user.role
  };
  
  const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '7d' });
  
  return {
    access: accessToken,
    refresh: refreshToken
  };
};

// Helper function to verify token
const verifyToken = (token, secret = JWT_SECRET) => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    return null;
  }
};

// Helper function to parse JSON body
const parseBody = (req) => {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(body));
      } catch {
        resolve({});
      }
    });
  });
};

// Helper function to send JSON response
const sendJSON = (res, statusCode, data) => {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  });
  res.end(JSON.stringify(data));
};

// Authentication middleware
const authenticateToken = (req) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return null;

  const decoded = verifyToken(token);
  return decoded;
};

// Create HTTP server
const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const { pathname, query } = parsedUrl;
  const method = req.method;

  // Handle CORS preflight
  if (method === 'OPTIONS') {
    res.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    });
    res.end();
    return;
  }

  // Login endpoint
  if (pathname === '/api/login' && method === 'POST') {
    const body = await parseBody(req);
    const { email, password } = body;

    if (!email || !password) {
      return sendJSON(res, 400, {
        success: false,
        message: 'Email and password are required'
      });
    }

    const db = getDb();
    const user = db.users.find(u => u.email === email && u.password === password);

    if (!user) {
      return sendJSON(res, 401, {
        success: false,
        message: 'Invalid email or password'
      });
    }

    const tokens = generateTokens(user);
    const { password: _, ...userWithoutPassword } = user;

    return sendJSON(res, 200, {
      success: true,
      data: {
        user: userWithoutPassword,
        tokens
      },
      message: 'Login successful'
    });
  }

  // Register endpoint
  if (pathname === '/api/register' && method === 'POST') {
    const body = await parseBody(req);
    const { email, username, password } = body;

    if (!email || !username || !password) {
      return sendJSON(res, 400, {
        success: false,
        message: 'Email, username, and password are required'
      });
    }

    const db = getDb();

    // Check if user already exists
    const existingUser = db.users.find(u => u.email === email || u.username === username);
    if (existingUser) {
      return sendJSON(res, 409, {
        success: false,
        message: 'User with this email or username already exists'
      });
    }

    // Create new user
    const newUser = {
      id: String(db.users.length + 1),
      email,
      username,
      password,
      role: 'employee',
      firstName: '',
      lastName: '',
      department: '',
      position: '',
      avatar: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    db.users.push(newUser);

    // Write back to file
    fs.writeFileSync(path.join(__dirname, 'db.json'), JSON.stringify(db, null, 2));

    return sendJSON(res, 201, {
      success: true,
      message: 'User registered successfully'
    });
  }

  // Refresh token endpoint
  if (pathname === '/api/refresh' && method === 'POST') {
    const body = await parseBody(req);
    const { refresh } = body;

    if (!refresh) {
      return sendJSON(res, 400, {
        success: false,
        message: 'Refresh token is required'
      });
    }

    const decoded = verifyToken(refresh, JWT_REFRESH_SECRET);
    if (!decoded) {
      return sendJSON(res, 403, {
        success: false,
        message: 'Invalid or expired refresh token'
      });
    }

    const db = getDb();
    const user = db.users.find(u => u.id === decoded.id);

    if (!user) {
      return sendJSON(res, 404, {
        success: false,
        message: 'User not found'
      });
    }

    const tokens = generateTokens(user);

    return sendJSON(res, 200, {
      success: true,
      data: tokens,
      message: 'Token refreshed successfully'
    });
  }

  // Logout endpoint
  if (pathname === '/api/logout' && method === 'POST') {
    return sendJSON(res, 200, {
      success: true,
      message: 'Logged out successfully'
    });
  }

  // Forgot password endpoint
  if (pathname === '/api/forgot-password' && method === 'POST') {
    const body = await parseBody(req);
    const { email } = body;

    if (!email) {
      return sendJSON(res, 400, {
        success: false,
        message: 'Email is required'
      });
    }

    const db = getDb();
    const user = db.users.find(u => u.email === email);

    if (!user) {
      return sendJSON(res, 404, {
        success: false,
        message: 'User with this email does not exist'
      });
    }

    return sendJSON(res, 200, {
      success: true,
      message: 'Password reset email sent successfully'
    });
  }

  // Dashboard stats endpoint
  if (pathname === '/api/dashboard/stats' && method === 'GET') {
    const user = authenticateToken(req);
    if (!user) {
      return sendJSON(res, 401, { message: 'Access token required' });
    }

    const db = getDb();

    return sendJSON(res, 200, {
      success: true,
      data: db.dashboardStats
    });
  }

  // Default 404
  sendJSON(res, 404, { message: 'Endpoint not found' });
});

const PORT = process.env.PORT || 3002;
server.listen(PORT, () => {
  console.log(`Mock server is running on port ${PORT}`);
  console.log(`API endpoints available at http://localhost:${PORT}/api`);
});

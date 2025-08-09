const express = require('express');
require('dotenv').config();
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.json());

// mock auth middleware
app.use((req, _res, next) => {
  req.user = { email: process.env.MOCK_USER_EMAIL || 'user@example.com' };
  next();
});

function parseSort(sortBy, allowed) {
  let order = 'ASC';
  let field = allowed[0];
  if (sortBy) {
    if (sortBy.startsWith('-')) {
      order = 'DESC';
      field = sortBy.substring(1);
    } else {
      field = sortBy;
    }
    if (!allowed.includes(field)) return null;
  }
  return { field, order };
}

function createCrudRoutes(path, table, opts = {}) {
  const router = express.Router();
  const allowedSort = opts.allowedSort || ['created_date'];
  const userScoped = opts.userScoped !== false;

  router.get('/', async (req, res) => {
    const { limit = 10, sortBy } = req.query;
    const sort = parseSort(sortBy, allowedSort);
    if (!sort) return res.status(400).json({ error: 'invalid sortBy' });
    const params = [];
    let where = '';
    if (userScoped) {
      params.push(req.user.email);
      where = 'WHERE created_by = $1';
    }
    params.push(limit);
    const sql = `SELECT * FROM ${table} ${where} ORDER BY ${sort.field} ${sort.order} LIMIT $${params.length}`;
    try {
      const result = await db.query(sql, params);
      res.json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'internal error' });
    }
  });

  router.get('/:id', async (req, res) => {
    const params = [req.params.id];
    let where = 'WHERE id = $1';
    if (userScoped) {
      params.push(req.user.email);
      where += ' AND created_by = $2';
    }
    try {
      const result = await db.query(`SELECT * FROM ${table} ${where}`, params);
      if (!result.rows[0]) return res.status(404).json({ error: 'not found' });
      res.json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'internal error' });
    }
  });

  router.post('/', async (req, res) => {
    const data = { ...req.body };
    if (userScoped) data.created_by = req.user.email;
    else if (!data.created_by) data.created_by = req.user.email;
    const fields = Object.keys(data);
    const values = Object.values(data);
    const placeholders = fields.map((_, i) => `$${i + 1}`);
    try {
      const result = await db.query(
        `INSERT INTO ${table} (${fields.join(',')}) VALUES (${placeholders.join(',')}) RETURNING *`,
        values
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'internal error' });
    }
  });

  router.patch('/:id', async (req, res) => {
    const data = { ...req.body, updated_date: new Date() };
    const fields = Object.keys(data);
    if (fields.length === 0) return res.status(400).json({ error: 'no fields to update' });
    const set = fields.map((f, i) => `${f}=$${i + 1}`).join(', ');
    const params = [...Object.values(data), req.params.id];
    let where = `WHERE id=$${params.length}`;
    if (userScoped) {
      params.push(req.user.email);
      where += ` AND created_by=$${params.length}`;
    }
    try {
      const result = await db.query(`UPDATE ${table} SET ${set} ${where} RETURNING *`, params);
      if (!result.rows[0]) return res.status(404).json({ error: 'not found' });
      res.json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'internal error' });
    }
  });

  router.delete('/:id', async (req, res) => {
    const params = [req.params.id];
    let where = 'WHERE id=$1';
    if (userScoped) {
      params.push(req.user.email);
      where += ' AND created_by=$2';
    }
    try {
      const result = await db.query(`DELETE FROM ${table} ${where} RETURNING id`, params);
      if (!result.rows[0]) return res.status(404).json({ error: 'not found' });
      res.json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'internal error' });
    }
  });

  app.use(`/api/v1/${path}`, router);
}


// put this BEFORE createCrudRoutes('users', ...)
app.get('/api/v1/users/me', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [req.user.email]);
    res.json(result.rows[0] || {});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal error' });
  }
});



createCrudRoutes('users', 'users', { userScoped: false });
createCrudRoutes('bankaccounts', 'bank_accounts');
createCrudRoutes('charities', 'charities', { userScoped: false });
createCrudRoutes('transactions', 'transactions');
createCrudRoutes('donations', 'donations');
createCrudRoutes('pledges', 'pledges');

// special routes
app.get('/api/v1/users/me', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [req.user.email]);
    res.json(result.rows[0] || {});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal error' });
  }
});

app.patch('/api/v1/users/:id/my-data', async (req, res) => {
  try {
    const result = await db.query(
      'UPDATE users SET notification_preferences = COALESCE($1, notification_preferences), updated_date=NOW() WHERE id=$2 AND email=$3 RETURNING *',
      [req.body.notification_preferences, req.params.id, req.user.email]
    );
    if (!result.rows[0]) return res.status(404).json({ error: 'not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal error' });
  }
});

app.post('/api/v1/users/login', (req, res) => {
  res.json({ token: 'mock-token', email: req.user.email });
});

app.post('/api/v1/users/logout', (_req, res) => {
  res.json({ success: true });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`API server listening on port ${PORT}`);
});


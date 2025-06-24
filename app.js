const express = require("express");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const mysql = require("mysql2");

const app = express();
const port = 3000;

const SECRET_KEY = "hello-world-rumah-web";

// Middleware
app.use(bodyParser.json());

// ✅ MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',     // adjust accordingly
  database: 'rumahweb' // change this to your DB
});

db.connect(err => {
  if (err) {
    console.error('Database connection error:', err);
    process.exit(1);
  }
  console.log('Connected to MySQL');
});

// ✅ JWT middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token required' });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
}

// ✅ Public login endpoint (dummy credentials)
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (username === "admin" && password === "password") {
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });
    res.json({ message: "Login successful", token });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

// ✅ All routes below require JWT
app.use(authenticateToken);

// 🔐 GET all users
app.get("/users", (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) return res.status(500).json({ message: 'DB error', error: err });
    res.json(results);
  });
});

// 🔐 GET user by ID
app.get("/users/:id", (req, res) => {
  db.query('SELECT * FROM users WHERE id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ message: 'DB error', error: err });
    if (results.length === 0) return res.status(404).json({ message: 'User not found' });
    res.json(results[0]);
  });
});

// 🔐 POST create new user
app.post("/users", (req, res) => {
  const { name, role } = req.body;
  if (!name || !role) return res.status(400).json({ message: 'Name and role required' });

  db.query('INSERT INTO users (name, role) VALUES (?, ?)', [name, role], (err, result) => {
    if (err) return res.status(500).json({ message: 'DB error', error: err });
    res.status(201).json({ message: 'User created', user: { id: result.insertId, name, role } });
  });
});

// 🔐 PUT update user
app.put("/users/:id", (req, res) => {
  const { name, role } = req.body;
  db.query('UPDATE users SET name = ?, role = ? WHERE id = ?', [name, role, req.params.id], (err, result) => {
    if (err) return res.status(500).json({ message: 'DB error', error: err });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User updated successfully' });
  });
});

// 🔐 DELETE user
app.delete("/users/:id", (req, res) => {
  db.query('DELETE FROM users WHERE id = ?', [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ message: 'DB error', error: err });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  });
});

// ✅ Start server
app.listen(port, () => {
  console.log(`Rumahweb app listening on port ${port}`);
});


const express = require('express');
const jwt = require('jwt-simple');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors());
app.use(express.json());

const SUPABASE_URL = 'https://your-supabase-url';
const SUPABASE_KEY = 'your-supabase-key';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const JWT_SECRET = 'your-jwt-secret';

// Middleware to protect routes
function authenticate(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(401).send('Unauthorized');
  }

  try {
    const decoded = jwt.decode(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).send('Invalid token');
  }
}

// User Signup
app.post('/api/signup', async (req, res) => {
  const { name, email, password } = req.body;

  // Check if user already exists
  const { data: existingUser } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();
  
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // Hash password and save user
  const hashedPassword = await bcrypt.hash(password, 10);
  const { data, error } = await supabase
    .from('users')
    .insert([{ name, email, password: hashedPassword }]);

  if (error) {
    return res.status(500).json({ message: 'Error creating user' });
  }

  res.status(201).json({ message: 'User created successfully' });
});

// User Login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error || !user) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  // Create JWT token
  const payload = { userId: user.id };
  const token = jwt.encode(payload, JWT_SECRET);

  res.json({ token });
});

// Update Profile
app.post('/api/update-profile', authenticate, async (req, res) => {
  const { name, email } = req.body;
  const { userId } = req.user;

  const { data, error } = await supabase
    .from('users')
    .update({ name, email })
    .eq('id', userId);

  if (error) {
    return res.status(500).json({ message: 'Error updating profile' });
  }

  res.json({ message: 'Profile updated successfully' });
});

// Logout (invalidate JWT)
app.post('/api/logout', (req, res) => {
  res.status(200).json({ message: 'Logged out successfully' });
});

// Activities (User-specific)
app.get('/api/activities', authenticate, async (req, res) => {
  const { userId } = req.user;

  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    return res.status(500).json({ message: 'Error fetching activities' });
  }

  res.json({ activities: data });
});

// Server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});

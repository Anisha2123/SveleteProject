

const express = require('express');
const bcrypt = require('bcryptjs');
const { createClient } = require('@supabase/supabase-js');
const jwt = require('jsonwebtoken');

// Initialize Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const router = express.Router();

router.post('/', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required.' });
  }

  try {
    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into Supabase
    const { data, error } = await supabase
      .from('users')
      .insert([{ name, email, password: hashedPassword }]);

    if (error) {
      return res.status(500).json({ error: 'Error creating user.' });
    }

    // Generate a JWT token
    const token = jwt.sign({ id: data[0].id, email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ message: 'Signup successful! Please log in.', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred. Please try again.' });
  }
});

module.exports = router;

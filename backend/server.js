
const express = require('express');
const jwt = require('jwt-simple');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors(
    {
        origin: 'http://localhost:5173', // or '*' to allow any origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
    }
));
app.use(express.json());

const SUPABASE_URL = 'https://awodhficgyitbkghhjba.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF3b2RoZmljZ3lpdGJrZ2hoamJhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM2NTE5MjcsImV4cCI6MjA0OTIyNzkyN30.7HwK57CmB5i0VcmLNP3ZVqdf-N79VNJkk5FNSo-7Wdg';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
// const JWT_SECRET = 'your-jwt-secret';

  

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
    console.log('Signup request received:', { email, password });

    try {
        // Check if user already exists
        const { data: existingUser, error: checkError } = await supabase
            .from('UserTable')
            .select('email')
            .eq('email', email)
            .single();

        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists. Please login.' });
        }

        if (checkError && checkError.code !== 'PGRST116') {
            console.error('Error checking existing user:', checkError);
            return res.status(500).json({ message: 'Error checking existing user' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the new user
        const { data, error: insertError } = await supabase
            .from('UserTable')
            .insert([{ name, email, password: hashedPassword }])
            .select();

        if (insertError) {
            console.error('Error inserting user:', insertError);
            return res.status(500).json({ message: 'Error creating user' });
        }

        if (!data || data.length === 0) {
            return res.status(500).json({ message: 'User creation failed, no data returned' });
        }

        console.log('Inserted user:', data);

        // Log activity (signup action)
        const user_id = data[0].id; // assuming `id` is the user_id
        const ip_address = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

        const { error: activityError } = await supabase
            .from('ActivityTable')
            .insert([{ user_id, action: 'signup', timestamp: new Date(), ip_address }]);

        if (activityError) {
            console.error('Error logging activity:', activityError);
            return res.status(500).json({ message: 'Error logging activity' });
        }

        res.status(201).json({ message: 'User created successfully', user: data[0] });
    } catch (error) {
        console.error('Unexpected error:', error);
        res.status(500).json({ message: 'An unexpected error occurred' });
    }
});


  
  
// User Login
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    console.log('Login request received:', { email, password });
    const trimmedEmail = email.trim();

    try {
        // Query the database for the user with the provided email
        const { data: users, error } = await supabase
            .from('UserTable')
            .select('*')
            .ilike('email', trimmedEmail);

        console.log('Supabase query result:', { users, error });

        if (error) {
            console.error('Supabase error:', error);
            return res.status(500).json({ message: 'Server error' });
        }

        if (users.length === 0) {
            return res.status(400).json({ message: 'User does not exist. Please sign up.' });
        }

        const user = users[0]; // Take the first (and ideally only) user
        const isPasswordValid = await bcrypt.compare(password, user.password);
        console.log('Stored hash:', user.password);
        if (!isPasswordValid) {
            console.log('Is password valid:', isPasswordValid);
            return res.status(400).json({ message: 'Password is incorrect' });
        }

        // Log activity (login action)
        const user_id = user.id; // Corrected to use `user.id` here
        const ip_address = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

        const { error: activityError } = await supabase
            .from('ActivityTable')
            .insert([{ user_id, action: 'login', timestamp: new Date(), ip_address }]);

        if (activityError) {
            console.error('Error logging activity:', activityError);
            return res.status(500).json({ message: 'Error logging activity' });
        }

        res.status(200).json({ message: 'Login successful', user });
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});


// Update Profile
// app.post('/api/update-profile', authenticate, async (req, res) => {
//   const { name, email } = req.body;
//   const { userId } = req.user;

//   const { data, error } = await supabase
//     .from('UserTable')
//     .update({ name, email })
//     .eq('id', userId);

//   if (error) {
//     return res.status(500).json({ message: 'Error updating profile' });
//   }

//   res.json({ message: 'Profile updated successfully' });
// });
// 
// Logout (invalidate JWT)
app.post('/api/logout', (req, res) => {
  res.status(200).json({ message: 'Logged out successfully' });
});

//   ---------------------------------------------------------

// Log user activity
app.post('/api/activity', async (req, res) => {
    const { user_id, action } = req.body;
    const ip_address = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  
    try {
      // Verify if user exists in UserTable
      const { data: user, error: userError } = await supabase
        .from('UserTable')
        .select('id')
        .eq('id', user_id)
        .single();
  
      if (userError || !user) {
        console.error('User does not exist:', userError);
        return res.status(400).json({ message: 'Invalid user_id' });
      }
  
      // Log the activity
      const { data, error } = await supabase
        .from('ActivityTable')
        .insert([{ user_id, action, timestamp: new Date(), ip_address }]);
  
      if (error) {
        console.error('Error logging activity:', error);
        return res.status(500).json({ message: 'Error logging activity' });
      }
  
      res.status(201).json({ message: 'Activity logged successfully' });
    } catch (err) {
      console.error('Unexpected error:', err);
      res.status(500).json({ message: 'An unexpected error occurred' });
    }
  });
  
  
  // Fetch activities for dashboard
  app.get('/api/activities', async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('ActivityTable')
        .select('action, timestamp, ip_address')
        .order('timestamp', { ascending: false });
  
      if (error) {
        console.error('Error fetching activities from Supabase:', error);
        return res.status(500).json({ message: 'Error fetching activities from Supabase' });
      }
      console.log('Fetched data:', data, 'Error:', error);

      res.status(200).json({ activities: data });
    } catch (err) {
      console.error('Unexpected server error:', err);
      res.status(500).json({ message: 'Unexpected server error' });
    }
  });
  
// -------------------------------------------------------------------
// Server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});

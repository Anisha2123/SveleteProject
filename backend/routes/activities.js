

// backend/routes/activities.js
const { supabase } = require('../utils/supabase');  // Initialize Supabase client

module.exports = async (req, res) => {
  const { user_id } = req.user; // Assuming user is authenticated

  // Fetch activities from the database for the authenticated user
  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .eq('user_id', user_id)
    .order('timestamp', { ascending: false });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  // Send the activities as response
  res.json({ activities: data });
};

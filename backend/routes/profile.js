


// backend/routes/profile.js
const { supabase } = require('../utils/supabase');

module.exports = async (req, res) => {
  const { user_id } = req.user;  // Assuming the user is authenticated

  const { data, error } = await supabase
    .from('users')
    .select('name, email, profile_picture')
    .eq('id', user_id)
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json({ user: data });
};

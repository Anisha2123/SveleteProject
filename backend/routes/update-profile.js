

// backend/routes/update-profile.js
const { supabase } = require('../utils/supabase');
const bcrypt = require('bcrypt');

module.exports = async (req, res) => {
  const { user_id } = req.user;  // Assuming user is authenticated
  const { name, password } = req.body;

  // Update profile data
  let updateData = { name };

  if (password) {
    // Hash the new password
    updateData.password = await bcrypt.hash(password, 10);
  }

  const { data, error } = await supabase
    .from('users')
    .update(updateData)
    .eq('id', user_id)
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json({ success: true, user: data });
};


// // Log user activity
// app.post('/api/activity', async (req, res) => {
//   const { user_id, action } = req.body;
//   const ip_address = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

//   try {
//     const { data, error } = await supabase
//       .from('ActivityTable')
//       .insert([{ user_id, action, timestamp: new Date(), ip_address }]);

//     if (error) {
//       console.error('Error logging activity:', error);
//       return res.status(500).json({ message: 'Error logging activity' });
//     }

//     res.status(201).json({ message: 'Activity logged successfully' });
//   } catch (err) {
//     console.error('Unexpected error:', err);
//     res.status(500).json({ message: 'An unexpected error occurred' });
//   }
// });

// // Fetch activities for dashboard
// app.get('/api/activities', async (req, res) => {
//   try {
//     const { data, error } = await supabase
//       .from('ActivityTable')
//       .select('action, timestamp, ip_address')
//       .order('timestamp', { ascending: false });

//     if (error) {
//       console.error('Error fetching activities:', error);
//       return res.status(500).json({ message: 'Error fetching activities' });
//     }

//     res.status(200).json({ activities: data });
//   } catch (err) {
//     console.error('Unexpected error:', err);
//     res.status(500).json({ message: 'An unexpected error occurred' });
//   }
// });

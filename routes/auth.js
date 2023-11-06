// routes/auth.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const verifyToken = require('../middleware/auth'); // Import the authentication middleware

// Google Sign-In route
router.post('/google-signin', async (req, res) => {
  const { googleId, name, email } = req.body;

  try {
    let user = await User.findOne({ googleId });

    if (!user) {
      user = new User({ googleId, name, email });
      await user.save();
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });

    res.json({ token,_id:user._id });
    console.log('User saved', user);
    console.log('user Id', user._id);
  } catch (error) {
    console.error('Google Sign-In Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//update profile
router.put('/update-profile', verifyToken, async (req, res) => {
   const { username, email } = req.body;
   const userId = req.userId; // This is set by the verifyToken middleware
 
   try {
     // Find the user by their ID
     const user = await User.findById(userId);
 
     if (!user) {
       return res.status(404).json({ error: 'User not found' });
     }
 
     // Update the username and email
     user.username = username;
     user.email = email;
     console.log('user',user.username)
     // Save the updated user data
     await user.save();

     console.log('User updated', user);
     res.json({ message: 'Profile updated successfully' });
   } catch (error) {
     console.error('Profile Update Error:', error);
     res.status(500).json({ error: 'Internal Server Error' });
   }
 });

module.exports = router;

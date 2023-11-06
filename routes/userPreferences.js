// routes/userPreferences.js
const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth'); // Import the authentication middleware
const UserPreference = require('../models/UserPreference'); // Import the UserPreference model

// Route to store user preferences
router.post('/store-preferences', verifyToken, async (req, res) => {
  const { tracking, nightlife, beaches } = req.body;
  const userId = req.userId; // This is set by the verifyToken middleware

  try {
    // Check if user preferences already exist; if not, create a new record
    let userPreferences = await UserPreference.findOne({ userId });

    if (!userPreferences) {
      userPreferences = new UserPreference({
        userId,
        tracking,
        nightlife,
        beaches,
        // Set other preferences here
      });
    } else {
      // Update existing user preferences
      userPreferences.tracking = tracking;
      userPreferences.nightlife = nightlife;
      userPreferences.beaches = beaches;
      // Update other preferences as needed
    }

    // Save the user preferences
    await userPreferences.save();

    res.json({ message: 'Preferences saved successfully' });
  } catch (error) {
    console.error('Error saving preferences:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to get user preferences
router.get('/get-preferences', verifyToken, async (req, res) => {
   const userId = req.userId; // This is set by the verifyToken middleware
 
   try {
     // Find the user preferences based on the user's ID
     const userPreferences = await UserPreference.findOne({ userId });
 
     if (!userPreferences) {
       return res.status(404).json({ error: 'Preferences not found' });
     }
 
     // Respond with the user's preferences
     res.json(userPreferences);
   } catch (error) {
     console.error('Error fetching preferences:', error);
     res.status(500).json({ error: 'Internal Server Error' });
   }
 });
// Route to update user preferences
router.put('/update-preferences', verifyToken, async (req, res) => {
   const userId = req.userId; // This is set by the verifyToken middleware
   const { tracking, nightlife, beaches } = req.body; // Update preferences from request body
 
   try {
     // Find the user preferences based on the user's ID
     let userPreferences = await UserPreference.findOne({ userId });
 
     if (!userPreferences) {
       return res.status(404).json({ error: 'Preferences not found' });
     }
 
     // Update the user's preferences
     userPreferences.tracking = tracking;
     userPreferences.nightlife = nightlife;
     userPreferences.beaches = beaches;
     // Update other preferences as needed
 
     // Save the updated preferences
     await userPreferences.save();
 
     // Respond with a success message
     res.json({ message: 'Preferences updated successfully' });
   } catch (error) {
     console.error('Error updating preferences:', error);
     res.status(500).json({ error: 'Internal Server Error' });
   }
 });
 

module.exports = router;

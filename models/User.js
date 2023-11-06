const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  googleId: String,
  name: String,
  email: {
    type: String,
    unique: true, // Add this line to enforce uniqueness
  },
  email: {
    type: String,
    unique: true, // Add this line to enforce uniqueness
  },
});

module.exports = mongoose.model('User', userSchema);

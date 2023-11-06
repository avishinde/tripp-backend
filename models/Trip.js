// models/Trip.js
const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  location: String,
  time: String,
  description: String,
});

const dayPlanSchema = new mongoose.Schema({
  day: Number,
  date: Date,
  activities: [activitySchema],
  title: String,
});

const tripSchema = new mongoose.Schema({
  userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true,
      },
  destination: String,
  baseLocation: String,
  startDate: Date,
  returnDate: Date,
  tripType: String,
  tripPlan: [dayPlanSchema],
});

module.exports = mongoose.model('Trip', tripSchema);

// const mongoose = require('mongoose');

// const activitySchema = new mongoose.Schema({
//   time: String, // Time of the activity
//   activity: String, // Name of the activity
//   location: String, // Location of the activity
//   // Add other activity details as needed
// });

// const dayPlanSchema = new mongoose.Schema({
//   day: Number, // Day number of the trip
//   date: Date, // Date for the day's plan
//   activities: [activitySchema], // Array of activities
//   // Add other day plan details as needed
// });

// const tripSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User', // Reference to the User model
//     required: true,
//   },
//   tripType: String,
//   destination: String,
//   baseLocation: String,
//   startDate: Date,
//   returnDate: Date,
//   tripPlan: [dayPlanSchema], // Array of day-wise trip plans
//   participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Array of user references
//   // Add other trip details as needed
// });

// const Trip = mongoose.model('Trip', tripSchema);

// module.exports = Trip;

// routes/trips.js
const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth"); // Import the authentication middleware
const Trip = require("../models/Trip"); // Import the Trip model

// Route to create a new trip
router.post("/create-trip", verifyToken, async (req, res) => {
  const userId = req.userId; // This is set by the verifyToken middleware
  const { tripType, destination, baseLocation, startDate, returnDate } =
    req.body;

  try {
    // Parse startDate and endDate as Date objects
    const parsedStartDate = new Date(startDate);
    const parsedEndDate = new Date(returnDate);

    // Calculate the number of days for the trip
    const dayCount =
      Math.ceil((parsedEndDate - parsedStartDate) / (1000 * 60 * 60 * 24)) + 1;

    // Create an empty trip plan with day plans
    const tripPlan = [];
    for (let i = 0; i < dayCount; i++) {
      const dayNumber = i + 1;
      const date = new Date(parsedStartDate);
      date.setDate(parsedStartDate.getDate() + i);
      tripPlan.push({
        day: dayNumber,
        date: date,
        activities: [],
        title: `Plan for Day ${dayNumber}`,
      });
    }

    // Create a new trip with the calculated trip plan
    const newTrip = new Trip({
      userId,
      tripType,
      destination,
      baseLocation,
      startDate,
      returnDate,
      tripPlan,
      // Add other trip details as needed
    });

    // Save the trip to the database
    await newTrip.save();

    // Respond with a success message and the created trip object
    res.json({ message: "Trip created successfully", trip: newTrip });
  } catch (error) {
    console.error("Error creating trip:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Add a day to the trip plan and adjust the return date
router.post("/:tripId/add-day", verifyToken, async (req, res) => {
  const userId = req.userId; // This is set by the verifyToken middleware
  const tripId = req.params.tripId;

  try {
    // Find the trip by ID
    const trip = await Trip.findOne({ _id: tripId, userId });

    if (!trip) {
      return res.status(404).json({ error: "Trip not found" });
    }

    // Get the last day in the trip plan
    const lastDay = trip.tripPlan[trip.tripPlan.length - 1];

    // Calculate the new day number, date, and update the return date
    const newDayNumber = lastDay.day + 1;
    const newDate = new Date(lastDay.date);
    newDate.setDate(newDate.getDate() + 1);

    // Add the new day to the trip plan
    trip.tripPlan.push({
      day: newDayNumber,
      date: newDate,
      activities: [],
    });

    // Update the trip's return date
    trip.returnDate = newDate;

    console.log("After assignment - trip.returnDate:", trip.returnDate);

    // Save the updated trip to the database
    await trip.save();

    // Respond with the updated trip object
    res.json({
      message: "Day added to the trip plan and return date adjusted",
      trip,
    });
  } catch (error) {
    console.error("Error adding a day to the trip plan:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Add an activity to a specific day in the trip plan
router.post(
  "/add-activity/:tripId/:dayNumber",
  verifyToken,
  async (req, res) => {
    const userId = req.userId; // This is set by the verifyToken middleware
    const tripId = req.params.tripId;
    const dayNumber = parseInt(req.params.dayNumber, 10); // Parse dayNumber as an integer

    try {
      // Find the trip by ID
      const trip = await Trip.findOne({ _id: tripId, userId });

      if (!trip) {
        return res.status(404).json({ error: "Trip not found" });
      }

      // Find the day in the trip plan based on dayNumber
      const dayIndex = dayNumber - 1; // Adjust for 0-based array index
      const day = trip.tripPlan[dayIndex];

      if (!day) {
        return res.status(404).json({ error: "Day not found in trip plan" });
      }

      // Extract activity details from the request body
      const { location, time, description } = req.body;

      // Create a new activity
      const newActivity = {
        location,
        time,
        description,
      };

      // Add the activity to the specified day
      day.activities.push(newActivity);

      // Save the updated trip to the database
      await trip.save();

      // Respond with the updated trip object
      res.json({ message: "Activity added to the day", trip });
    } catch (error) {
      console.error("Error adding an activity to the trip plan:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// Route to edit an existing trip
router.put("/edit-trip/:tripId", verifyToken, async (req, res) => {
  const userId = req.userId; // This is set by the verifyToken middleware
  const tripId = req.params.tripId; // Get the trip ID from the URL parameter
  const updates = req.body; // An object containing the fields to update and their new values

  try {
    // Find the trip by ID and check if it belongs to the authenticated user
    const trip = await Trip.findOne({ _id: tripId, userId });

    if (!trip) {
      return res.status(404).json({ error: "Trip not found" });
    }

    // Update each field specified in the updates object using the $set operator
    for (const field in updates) {
      trip[field] = updates[field];
    }

    // Save the updated trip to the database
    await trip.save();

    // Respond with a success message or the updated trip object
    res.json({ message: "Trip updated successfully", trip });
  } catch (error) {
    console.error("Error updating trip:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to add an activity to a specific day's trip plan
// router.post('/:tripId/plan/:day', verifyToken, async (req, res) => {
//   const userId = req.userId;
//   const tripId = req.params.tripId;
//   const dayToUpdate = parseInt(req.params.day); // Convert day to an integer
//   const { time, activity, location } = req.body;

//   try {
//     // Find the trip by ID and check if it belongs to the authenticated user
//     const trip = await Trip.findOne({ _id: tripId, userId });

//     if (!trip) {
//       return res.status(404).json({ error: 'Trip not found' });
//     }

//     // Find the day-wise plan by day number or create a new one if it doesn't exist
//     let dayPlanToUpdate = trip.tripPlan.find((plan) => plan.day === dayToUpdate);
//     console.log('dayPlanToUpdate',dayPlanToUpdate)
//     if (!dayPlanToUpdate) {
//       dayPlanToUpdate = {
//         day: dayToUpdate,
//         date: new Date(), // You can set the default date as needed
//         activities: [],
//       };
//       trip.tripPlan.push(dayPlanToUpdate);
//     }

//     // Add the new activity to the day's activities
//     dayPlanToUpdate.activities.push({ time, activity, location });

//     // Save the updated trip to the database
//     await trip.save();

//     // Respond with a success message and the updated trip object
//     res.json({ message: 'Activity added to the day plan successfully', trip });
//   } catch (error) {
//     console.error('Error adding activity to day-wise plan:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });
// Route to add an activity to a specific day's trip plan
router.post("/:tripId/plan/:day", verifyToken, async (req, res) => {
  const userId = req.userId;
  const tripId = req.params.tripId;
  const dayToUpdate = parseInt(req.params.day);
  const { time, activity, location } = req.body;

  try {
    // Find the trip by ID and check if it belongs to the authenticated user
    //   const trip = await Trip.findOne({ _id: tripId, userId });

    //   if (!trip) {
    //     return res.status(404).json({ error: 'Trip not found' });
    //   }
    const trip = await Trip.findOne({ _id: tripId });

    if (!trip) {
      return res.status(404).json({ error: "Trip not found" });
    }

    // Check if the user is the trip owner or a participant
    if (
      trip.userId.toString() !== userId &&
      !trip.participants.includes(userId)
    ) {
      return res.status(403).json({ error: "Unauthorized access" });
    }
    // Find the day-wise plan by day number or create a new one if it doesn't exist
    let dayPlanToUpdate = trip.tripPlan.find(
      (plan) => plan.day === dayToUpdate
    );

    if (!dayPlanToUpdate) {
      dayPlanToUpdate = {
        day: dayToUpdate,
        date: new Date(),
        activities: [], // Initialize with an empty activities array
      };
    }

    // Add the new activity to the day's activities
    dayPlanToUpdate.activities.push({ time, activity, location });

    // If the day-wise plan didn't exist, push the new day plan to trip.tripPlan
    if (!trip.tripPlan.find((plan) => plan.day === dayToUpdate)) {
      trip.tripPlan.push(dayPlanToUpdate);
    }

    // Save the updated trip to the database
    await trip.save();

    // Respond with a success message and the updated trip object
    res.json({ message: "Activity added to the day plan successfully", trip });
  } catch (error) {
    console.error("Error adding activity to day-wise plan:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// Route to get a list of trips (accessible to participants)
router.get("/", verifyToken, async (req, res) => {
  const userId = req.userId; // Get the authenticated user's ID

  try {
    // Find trips where the user is the trip owner or a participant
    const trips = await Trip.find({
      $or: [{ userId }, { participants: userId }],
    });

    // Respond with the list of trips
    res.json({ trips });
  } catch (error) {
    console.error("Error fetching trips:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to add participants to a trip
router.post("/:tripId/add-participants", verifyToken, async (req, res) => {
  const userId = req.userId;
  const tripId = req.params.tripId;
  const { participants } = req.body;

  try {
    // Find the trip by ID and check if it belongs to the authenticated user
    const trip = await Trip.findOne({ _id: tripId, userId });

    if (!trip) {
      return res.status(404).json({ error: "Trip not found" });
    }

    // Add the specified participants (user IDs) to the trip
    trip.participants.push(...participants);

    // Save the updated trip to the database
    await trip.save();

    // Respond with a success message and the updated trip object
    res.json({ message: "Participants added to the trip successfully", trip });
  } catch (error) {
    console.error("Error adding participants to the trip:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
module.exports = router;

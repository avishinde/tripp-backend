const express = require("express");
const connectDb = require('./config/dbConnection');
const dotenv = require('dotenv').config();
const authRoutes = require('./routes/auth');
const userPreferencesRoutes = require('./routes/userPreferences');
const tripRoutes = require('./routes/trips');
const destinationRoutes = require('./routes/destination');
connectDb();
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());

const port = process.env.PORT;
// Define a base route
app.get('/', (req, res) => {
   res.send('Welcome to the Trip Planning API!');
 });
 

app.use('/auth', authRoutes);
app.use('/user-preferences', userPreferencesRoutes);
app.use('/trips', tripRoutes);
app.use('/destination', destinationRoutes);
app.listen(port,()=>{
   console.log(`server running on port ${port}`);
})
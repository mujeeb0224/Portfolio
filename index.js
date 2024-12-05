const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotEnv = require('dotenv');
const cors = require('cors');
// Initialize the Express app
const app = express();

// Configure dotenv for environment variables
dotEnv.config();

// Use body-parser middleware to parse JSON requests
app.use(bodyParser.json());

// Define the port
const port = process.env.PORT || 2002;

// MongoDB connection URL from environment variables
const mongourl = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/portfolio';

// Connect to MongoDB
mongoose.connect(mongourl)
  .then(() => console.log('Database connected successfully'))
  .catch((err) => console.error('Database connection error:', err));

// Define a schema and model for user data
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String
});

const userModel = mongoose.model('User', userSchema);

// Define the GET route to fetch all users
app.get('/getUser', async (req, res) => {
  try {
    const usData = await userModel.find();
    res.json(usData);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
});

// Define the POST route to add a new user
app.post('/postUser', async (req, res) => {
  const { name, email, message } = req.body;

  try {
    const user = new userModel({ name, email, message });
    const savedUser = await user.save();
    res.status(201).json({ message: 'User created successfully', user: savedUser });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on ${port}`);
});

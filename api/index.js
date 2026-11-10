const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware to parse JSON and serve your HTML file
app.use(express.json());
app.use(cors());
app.use(express.static(__dirname)); 

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connection successful'))
  .catch(err => console.error('MongoDB connection error:', err));

// Mongoose Schema & Model for Contact Messages
const messageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  date: { type: Date, default: Date.now }
});
const Message = mongoose.model('Message', messageSchema);

// POST endpoint for recruiters to contact you
app.post('/api/contact', async (req, res) => {
  try {
    const newMessage = new Message({
      name: req.body.name,
      email: req.body.email,
      message: req.body.message
    });
    await newMessage.save();
    res.status(201).json({ success: true, text: 'Message delivered to Sanjith!' });
  } catch (error) {
    res.status(500).json({ success: false, text: 'Failed to send message.' });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Portfolio server running on http://localhost:${PORT}`));
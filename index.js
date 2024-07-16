const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config()

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
    origin: 'https://mdinesh.netlify.app', // Allow requests from your Netlify app
    methods: ['GET', 'POST'], // Allowed methods
    credentials: true // If you need to send cookies or authentication headers
}));

// Database connection
const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI)
.then(() => console.log("Connected to DB"))
.catch((error) => console.error("DB connection error:", error));

// Schema
const formSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String,
    },
    message: {
        type: String,
        required: true,
    },
    email: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
    }
});

// Model
const formModel = mongoose.model('data', formSchema);

// Post data
app.post('/form', async (req, res) => {
    const { name, email, message } = req.body;

    try {
        const form = new formModel({ name, email, message });
        await form.save();
        res.status(201).json(form);  // Changed status code to 201 (Created)
    } catch (error) {
        console.error("Error saving form data:", error);
        res.status(500).json({ message: "Unable to post data", error: error.message });
    }
});

// Getting data
app.get('/', (req, res) => {
    res.send("Backend is working");
});

// Set the port
const port = process.env.PORT ;
app.listen(port, () => {
    console.log("Server is running on port " + port);
});

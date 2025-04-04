const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection (Hardcoded)
mongoose.connect('mongodb+srv://sanmathys22msc:SKxtIQsNiJu2bfhL@ambikasboutique.e22fzcb.mongodb.net/NeuroCare?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB Atlas - NeuroCare'))
    .catch(err => console.error('MongoDB Atlas connection error:', err));

// User Schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true }
});

// Explicitly specify the collection name as 'users'
const User = mongoose.model('User', userSchema, 'users');

// Registration endpoint
app.post('/api/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const user = new User({ username, email, password: hashedPassword });
        await user.save();

        res.status(201).json({ message: 'Registration successful' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: 'Invalid email or password' });

        // Compare passwords
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) return res.status(401).json({ message: 'Invalid email or password' });

        // Generate JWT token (Hardcoded Secret)
        const token = jwt.sign({ userId: user._id }, 'your_hardcoded_jwt_secret', { expiresIn: '1h' });

        res.json({ token, message: 'Login successful' });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
});

// Email sending endpoint
app.post('/send-email', async (req, res) => {
    const { to, subject, text } = req.body;

    try {
        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "sanmathisedhupathi2004@gmail.com",  // Hardcoded Gmail
                pass: "sjbjhjjlminhixvb"  // Hardcoded App Password (DANGEROUS!)
            },
        });

        let mailOptions = { from: "sanmathisedhupathi2004@gmail.com", to, subject, text };

        await transporter.sendMail(mailOptions);
        res.json({ message: "Email sent successfully!" });
    } catch (error) {
        console.error('Email sending error:', error);
        res.status(500).json({ error: "Failed to send email" });
    }
});

// Server Configuration (Hardcoded)
const PORT = 3000;
const HOST = '0.0.0.0';

app.listen(PORT, HOST, () => {
    console.log(`Server running on http://${HOST}:${PORT}`);
});

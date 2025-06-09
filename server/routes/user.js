const express = require('express');
const passport = require('passport');
const User = require('../models/user');

const router = express.Router();

// Get authenticated user's profile
router.get('/profile', (req, res) => {
    if (req.isAuthenticated()) {
        res.status(200).json({
            user: req.user,
            message: 'User profile retrieved successfully'
        });
    } else {
        res.status(401).json({
            message: 'Unauthorized access'
        });
    }
});

// Register a new user
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const user = new User({ username, email });
        const registeredUser = await User.register(user, password);
        res.status(201).json({
            user: registeredUser,
            message: 'Registration successful'
        });
    } catch (err) {
        res.status(400).json({
            message: 'Registration failed',
            error: err.message
        });
    }
});

// Login user
router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) return next(err);
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        req.logIn(user, (err) => {
            if (err) return next(err);
            return res.status(200).json({
                user: req.user,
                message: 'Login successful'
            });
        });
    })(req, res, next);
});

// Logout user
router.post('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ message: 'Logout failed' });
        }
        res.status(200).json({ message: 'Logout successful' });
    });
});

// GET a journal by date
router.get('/journal', (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ message: 'Unauthorized access' });
    }

    const queryDate = req.query.q; 
    const journal = req.user.journals.find(j => j.date === queryDate);

    if (!journal) {
        return res.status(404).json({ message: 'Journal entry not found for this date' });
    }

    res.status(200).json({
        journal,
        message: 'Journal entry retrieved successfully'
    });
});

// PUT to update a journal by date
router.put('/journal', async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ message: 'Unauthorized access' });
    }

    const queryDate = req.query.q;
    const { title, content, mood, streaks } = req.body;
    const user = req.user;

    const journal = user.journals.find(j => j.date === queryDate);

    if (!journal) {
        return res.status(404).json({ message: 'Journal entry not found to update' });
    }

    // Update fields if provided
    if (title) journal.title = title;
    if (content) journal.content = content;
    if (mood) journal.mood = mood;
    if (typeof streaks === 'number') journal.streaks = streaks;

    try {
        await user.save();
        res.status(200).json({
            message: 'Journal updated successfully',
            journal
        });
    } catch (err) {
        res.status(500).json({ message: 'Failed to update journal', error: err.message });
    }
});

module.exports = router;

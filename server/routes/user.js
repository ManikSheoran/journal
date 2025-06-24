const express = require('express');
const passport = require('passport');
const User = require('../models/user');

const crypto = require('crypto');
const process = require('process');
const router = express.Router();

const ENCRYPTION_KEY = process.env.JOURNAL_SECRET_KEY;
const IV_LENGTH = 16;

function encrypt(text) {
    if (typeof text !== 'string') text = String(text ?? '');
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
}

function decrypt(text) {
    if (!text || typeof text !== 'string' || !text.includes(':')) return text || '';
    const [ivHex, encrypted] = text.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

// Get authenticated user's profile
router.get('/profile', (req, res) => {
    if (req.isAuthenticated()) {
        res.status(200).json({
            user: req.user,
            message: 'User profile retrieved successfully'
        });
    } else {
        res.status(401).json({ message: 'Unauthorized access' });
    }
});

// Register a new user
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const user = new User({ username, email });
        const registeredUser = await User.register(user, password);
        res.status(201).json({ user: registeredUser, message: 'Registration successful' });
    } catch (err) {
        res.status(400).json({ message: 'Registration failed', error: err.message });
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
            return res.status(200).json({ user: req.user, message: 'Login successful' });
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


// POST: Add a new journal
router.post('/journal', async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ message: 'Unauthorized access' });
    }

    const { _id, content, mood, todos } = req.body;

    if (!_id || !content || typeof mood !== 'number') {
        return res.status(400).json({ message: 'Missing required journal fields' });
    }

    try {
        req.user.journals.push({ _id, content, mood, todos });
        await req.user.save();
        res.status(201).json({ message: 'Journal entry added successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to add journal entry', error: err.message });
    }
});


// GET: Retrieve a journal by ?q=<id>
router.get('/journal', (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ message: 'Unauthorized access' });
    }

    const { q } = req.query;

    if (!q) return res.status(400).json({ message: 'Missing journal ID' });

    const journal = req.user.journals.find(j => j._id === q);

    if (!journal) {
        return res.status(404).json({ message: 'Journal entry not found' });
    }

    res.status(200).json({ journal, message: 'Journal entry retrieved successfully' });
});


router.put('/journal', async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ message: 'Unauthorized access' });
    }

    const { q } = req.query;
    if (!q) return res.status(400).json({ message: 'Missing journal ID in query param' });

    const { content, mood, todos } = req.body;

    let journal = req.user.journals.find(j => j._id === q);

    if (journal) {
        if (content !== undefined) journal.content = content;
        if (typeof mood === 'number') journal.mood = mood;
        if (Array.isArray(todos)) journal.todos = todos;
    } else {
        journal = { _id: q, content: content || "", mood: mood || 3, todos: Array.isArray(todos) ? todos : [] };
        req.user.journals.push(journal);
    }

    try {
        await req.user.save();
        res.status(200).json({ message: 'Journal saved successfully', journal });
    } catch (err) {
        res.status(500).json({ message: 'Failed to save journal', error: err.message });
    }
});


// DELETE: Delete a journal by ?q=<id>
router.delete('/journal', async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ message: 'Unauthorized access' });
    }

    const { q } = req.query;
    if (!q) return res.status(400).json({ message: 'Missing journal ID in query param' });

    const index = req.user.journals.findIndex(j => j._id === q);

    if (index === -1) {
        return res.status(404).json({ message: 'Journal entry not found' });
    }

    req.user.journals.splice(index, 1);

    try {
        await req.user.save();
        res.status(200).json({ message: 'Journal deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to delete journal', error: err.message });
    }
});


module.exports = router;

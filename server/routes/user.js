const express = require('express');

const router = express.Router();

router.route('/login')
    .post((req, res) => {
        const { username, password } = req.body;
        // Here you would typically check the credentials against a database
        if (username === 'admin' && password === 'password') {
            res.status(200).json({ message: 'Login successful' });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    });
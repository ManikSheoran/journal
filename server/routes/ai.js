const express = require('express');
const passport = require('passport');
const User = require('../models/user');
const { GoogleGenAI } = require('@google/genai');

const router = express.Router();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

router.post('/', async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ message: 'Unauthorized access' });
    }

    const { date, prompt } = { ...req.query, ...req.body };

    if (!date || !prompt) {
        return res.status(400).json({ message: 'Missing date or prompt' });
    }

    try {
        const user = await User.findById(req.user._id).lean();
        if (!user) return res.status(404).json({ message: 'User not found' });

        const day = parseInt(date.slice(0, 2), 10);
        const month = parseInt(date.slice(2, 4), 10) - 1;
        const year = parseInt(date.slice(4), 10);
        const currentDate = new Date(year, month, day);

        const last7Dates = [];
        for (let i = 0; i < 7; i++) {
            const d = new Date(currentDate);
            d.setDate(currentDate.getDate() - i);
            const dd = String(d.getDate()).padStart(2, '0');
            const mm = String(d.getMonth() + 1).padStart(2, '0');
            const yyyy = d.getFullYear();
            last7Dates.push(`${dd}${mm}${yyyy}`);
        }

        const last7Journals = user.journals
            .filter(j => last7Dates.includes(j._id))
            .sort((a, b) => last7Dates.indexOf(a._id) - last7Dates.indexOf(b._id));

        let historyText = '';
        last7Journals.forEach(j => {
            historyText += `Date: ${j._id}, Mood: ${j.mood}, Todos: ${j.todos?.join(', ') || 'None'}, Content: ${j.content}\n`;
        });

        const systemPrompt = `
You are a helpful journaling assistant. Here is the user's last 7 days of journal entries:
${historyText || 'No entries for the last 7 days.'}
Latest date is current date.
User's question: ${prompt}
Respond in a friendly, concise, and helpful way.
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: systemPrompt,
        });

        res.json({ response: response.text });
    } catch (err) {
        console.error('Gemini AI error:', err);
        res.status(500).json({ message: 'AI error', error: err.message });
    }
});

module.exports = router;
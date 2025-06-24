const express = require('express');
const passport = require('passport');
const User = require('../models/user');
const { decrypt } = require('../utils/crypto');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const process = require('process');
require('dotenv').config();
const {marked} = require('marked'); 

const router = express.Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY );

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
            const decryptedContent = decrypt(j.content);
            historyText += `Date: ${j._id}, Mood: ${j.mood}, Todos: ${j.todos?.join(', ') || 'None'}, Content: ${decryptedContent}\n`;
        });

        const systemPrompt = `
You are a warm, emotionally intelligent journaling companion. The user has been journaling regularly over the past week. Here are their entries:

${historyText || 'No entries for the past week.'}

The mood scale ranges from 1 to 5, where:
1 = very low
2 = low
3 = neutral
4 = good
5 = very good

Your job is to thoughtfully reflect on their recent patterns and provide a supportive, friendly, and helpful response to their current prompt.

- responds focuses on the user's emotional state and recent patterns
- avoid a long hello paragraph or analysis in every response

Avoid directly stating mood numbers or specific dates like DDMMYYYY. Instead:
- format dates in months like "January 1st", "February 14th", etc.
- Use natural phrases like "today", "yesterday", "tomorrow", "a few days ago", "recently", "over the past week", etc.
- Use emotional tone words like “happy”, “a bit off”, “feeling low”, “energized”, “calm”, etc.

Speak like a caring friend who genuinely wants to help. If appropriate, offer gentle suggestions, encouragement, or insights based on their recent entries. Keep the tone light, friendly, and human.

Here’s the user’s current question or thought:
"${prompt}"
`;


        // Use the correct API for @google/generative-ai
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const result = await model.generateContent(systemPrompt);

        let aiResponse = result?.response?.text() || "Sorry, I couldn't generate a response.";
        aiResponse = aiResponse.trim().replace(/\n{3,}/g, '\n\n');
        
        const htmlResponse = marked(aiResponse);
        res.json({ response: htmlResponse });
    } catch (err) {
        console.error('Gemini AI error:', err);
        res.status(500).json({ message: 'AI error', error: err.message });
    }
});

module.exports = router;
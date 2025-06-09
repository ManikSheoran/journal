const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const JournalSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    mood: {
        type: String,
        enum: ['happy', 'sad', 'neutral', 'angry', 'anxious'],
        default: 'neutral'
    },
    streaks: {
        type: Number,
        default: 0
    },
    date: {
        type: String,
        required: true
    }
});

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    journals: [JournalSchema]
});

userSchema.plugin(passportLocalMongoose, {
    usernameField: 'email'
});

module.exports = mongoose.model('User', userSchema);

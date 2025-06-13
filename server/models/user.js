const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const JournalSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true,
        trim: true
    },
    mood: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    todos: {
        type: [String],
        default: []
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

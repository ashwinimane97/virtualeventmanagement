const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/\S+@\S+\.\S+/, 'Please enter a valid email'],
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 6,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    preferences: {
        type: [String],
        enum: ["technology", "sports", "business", "entertainment", "movies", "comics"],
        default: []
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
},
    { timestamps: true }
);

const User = mongoose.model('User', UserSchema);

module.exports = User;

const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    organizer: {
        type: String,
        required: true
    },
    capacity: {
        type: Number,
        required: true
    },
    participants: [
        {
            name: {
                type: String,
                required: true
            },
            email: {
                type: String,
                required: true,
                unique: true // Ensure unique emails within the participants array
            }
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Adding indexes for better query performance
eventSchema.index({ name: 1 });
eventSchema.index({ date: 1 });

// Adding a method to the schema for reusable functionality
eventSchema.methods.addParticipant = function (participant) {
    if (this.participants.length >= this.capacity) {
        throw new Error('Event capacity reached');
    }
    this.participants.push(participant);
    return this.save();
};

// Adding a static method for finding events by date
eventSchema.statics.findByDate = function (date) {
    return this.find({ date });
};

// Exporting the model
module.exports = mongoose.model('Event', eventSchema);
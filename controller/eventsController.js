const eventSchema = require('../model/eventModel');
const { connectRedis, getRedisClient } = require('../redisConnect');
const { sendEventRegistrationEmail } = require('../utils/emailService');

connectRedis();
const client = getRedisClient(); // Get the Redis client


const clearCache = async (key) => {
    try {
        const keys = await client.keys(key);
        if (keys.length) await client.del(...keys);
    } catch (error) {
        console.error('Error clearing cache:', error);
        // Re-throw the error to be handled by the calling function
        throw new Error('Error clearing cache');
    }

}
clearCache('*'); // Clear cache for all events
// Create an event
const createEvent = async(req, res) => {

    try {
        const { name, description, date, time, organizer, capacity } = req.body;
        if (!description || !name || !date || !time || !organizer || !capacity) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const eventDateTime = new Date(`${date}T${time}`);
        if (isNaN(eventDateTime.getTime())) {
            return res.status(400).json({ message: 'Invalid date or time format' });
        }

        let event = await eventSchema.findOne({ name: name });
        if (event) {
            return res.status(400).json({ message: 'Event already exists' });
        }

        clearCache('events:page:*'); // Clear cache for all events

        // Create a new event
        const newEvent =  await eventSchema.create({
            name,
            description,
            date,
            time,
            organizer,
            capacity
        });
        newEvent.save();

        return res.status(201).json(newEvent);

    } catch (e) {
        console.log(e.message);
        return res.status(500).json({ message: 'Internal Server Error' });

    }
};

// Read all events
const getAllEvents = async (req, res) => {
    try {

        let { page, limit } = req.query;
        page = parseInt(page) || 1; // Default to page 1
        limit = parseInt(limit) || 10; // Default to 10 items per page
        let skip = (page - 1) * limit;
        let cacheKey = `events:page:${page}:limit${limit}`;

        const cachedEvents = await client.get(cacheKey);

        if (cachedEvents) {
            return res.status(200).json(JSON.parse(cachedEvents));
        }

        let events = await eventSchema.find({}).skip(skip).limit(limit);

        if (!events || events.length === 0) {
            return res.status(404).json({ message: 'No events found' });
        }

        const totalCount = await eventSchema.countDocuments();
        const totalPages = Math.ceil(totalCount / limit);

        const response = {
            page,
            limit,
            totalPages,
            totalCount,
            events,
        };

        // 🚀 Cache it for 60 seconds
        await client.set(cacheKey, JSON.stringify(response), {EX: 60});

        return res.status(200).json(response);


    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Read all events
const registerUserForEvent = async (req, res) => {

    try {
        const { name, email } = req.body;
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({ message: 'Event ID is required' });
        }
        if (!name || !email) {
            return res.status(400).json({ message: 'Name and email are required' });
        }

        let event = await eventSchema.findById(id);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        try{

            const existingParticipant = Array.from(event.participants).find(
                (participant) => participant.email === email
            );

            if (existingParticipant) {
                throw new Error('Participant with this email is already registered');
            }

            clearCache('events:page:*'); // Clear cache for all events

            await event.addParticipant({ name, email });
        } catch (err) {
            if (err.message === 'Event capacity reached') {
                return res.status(400).json({ message: 'Event capacity has been reached' });
            }
            if (err.code === 11000) { // Handle unique constraint error for email
                return res.status(400).json({ message: 'Participant with this email is already registered' });
            }
            throw err; // Re-throw other errors
        }

        await sendEventRegistrationEmail(email, event.name);

        res.status(200).json({message: 'User registered successfully', event});
    } catch (e) {
        console.log(e.message);
        return res.status(500).json({ message: e.message });
    }
};

// Read a single event by ID
const getEventById = async (req, res) => {

    try {
        const id = req.params.id;

        if (id === undefined) {
            return res.status(400).json({ message: 'Event ID is required' });
        }

        const event = await eventSchema.findById(id);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        return res.status(200).json(event);
    } catch (e) {
        console.log(e.message);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Update an event by ID
const updateEventById = async (req, res) => {

    try {

        const { name, date, location } = req.body;

        const event = await eventSchema.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        if (name) event.name = name;
        if (date) event.date = date;
        if (location) event.location = location;

        clearCache('events:page:*'); // Clear cache for all events

        await event.save();

        res.status(200).json(event);
    } catch (e) {
        console.log(e.message);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Delete an event by ID
const deleteEventById = async (req, res) => {

    try {

        let id = req.params.id;
        if (id === undefined) {
            return res.status(404).json({ message: 'Id is missing' });
        }

        const event = await eventSchema.findById(id);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        clearCache('events:page:*'); // Clear cache for all events

        await eventSchema.findByIdAndDelete(id);

        res.status(200).json({ message: 'Event deleted successfully' });

    } catch (e) {
        console.log(e.message);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = {
    createEvent,
    getAllEvents,
    getEventById,
    updateEventById,
    deleteEventById,
    registerUserForEvent
};
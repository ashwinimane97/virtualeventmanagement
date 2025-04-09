const express = require('express');
const router = express.Router();
const { createEvent, getAllEvents, registerUserForEvent, getEventById, updateEventById, deleteEventById } = require('../controller/eventsController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

router.post('/', authenticateToken, authorizeRoles(["admin"]), createEvent);
router.get('/', authenticateToken, authorizeRoles(["admin", "user"]), getAllEvents);
router.post('/:id/register', authenticateToken, authorizeRoles(["user"]), registerUserForEvent);
router.get('/:id', authenticateToken, authorizeRoles(["admin", "user"]), getEventById);
router.put('/:id', authenticateToken, authorizeRoles(["admin"]), updateEventById);
router.delete('/:id', authenticateToken, authorizeRoles(["admin"]), deleteEventById);

// Middleware to handle errors
router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});
module.exports = router;
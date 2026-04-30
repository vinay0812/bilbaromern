import express from 'express';
import Event from '../models/Event';

import authMiddleware, { AuthRequest } from '../middleware/auth';

const router = express.Router()

// get all events -public , no auth nedded

router.get('/', async (req, res) => {
    try {
        const events = await Event.find().populate('organizer', 'name email')
        res.json(events)

    } catch (error) {
        res.status(500).json({ message: 'Server Error' })
    }
})

// get single event by id

router.get('/:id', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id).populate('organizer', 'name email')

        if (!event) {
            return res.status(404).json({ message: 'Event not found' })
        }
        res.json(event)
    } catch (error) {
        res.status(500).json({ message: "Server Error" })
    }
})

// post create event protatced

router.post('/', authMiddleware, async (req: AuthRequest, res) => {
    try {
        if (req.user?.role !== 'admin') {
            return res.status(403).json({ message: "only admin can create events" })
        }

        const { title, description, date, venue, totalSeats, price } = req.body

        const event = await Event.create({
            title,
            description,
            date,
            venue,
            totalSeats,
            availableSeats: totalSeats, // starts equal to totalSeats
            price,
            organizer: req.user.userId
        })
        res.status(201).json(event)

    } catch (error) {
        res.status(500).json({ message: 'Server error' })
    }
})

// DELETE event — protected, admin only
router.delete('/:id', authMiddleware, async (req: AuthRequest, res) => {
    try {
        if (req.user?.role !== 'admin') {
            return res.status(403).json({ message: 'Only admins can delete events' })
        }

        await Event.findByIdAndDelete(req.params.id)
        res.json({ message: 'Event deleted' })
    } catch (error) {
        res.status(500).json({ message: 'Server error' })
    }
})

export default router
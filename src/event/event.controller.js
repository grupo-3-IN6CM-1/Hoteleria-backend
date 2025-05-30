import { response } from "express";
import Event from "./event.model.js";

export const createEvent = async (req, res = response) => {
    try {
        const { hotel, title, description, date, resources, services, price } = req.body;
        const userId = req.usuario._id;

        const newEvent = new Event({
            hotel,
            user: userId,
            title,
            description,
            date,
            resources,
            services,
            price
        });

        await newEvent.save();

        res.status(201).json({
            success: true,
            msg: "Event created successfully 🎉",
            event: newEvent
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            msg: "Error creating event ❌",
            error
        });
    }
};

export const getEvents = async (req, res = response) => {
    try {
        const { hotelId, userId } = req.query;

        const filter = { estado: true };

        if (hotelId) {
            filter.hotel = hotelId;
        }

        if (userId) {
            filter.user = userId;
        }

        const events = await Event.find(filter)
            .populate("user", "name email surname")
            .populate("hotel", "name")
            .populate("resources")
            .populate("services");

        res.status(200).json({
            success: true,
            events
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            msg: "Error fetching events ❌",
            error
        });
    }
};

export const getEventById = async (req, res = response) => {
    try {
        const { id } = req.params;

        const event = await Event.findById(id)
            .populate("user", "name email")
            .populate("hotel", "name")
            .populate("resources")
            .populate("services");

        if (!event || !event.estado) {
            return res.status(404).json({
                success: false,
                msg: "Event not found ❌"
            });
        }

        res.status(200).json({
            success: true,
            event
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            msg: "Error fetching event ❌",
            error
        });
    }
};

export const updateEvent = async (req, res = response) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).json({
                success: false,
                msg: "Event not found ❌"
            });
        }

        Object.assign(event, updates);
        await event.save();

        res.status(200).json({
            success: true,
            msg: "Event updated successfully ✅",
            event
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            msg: "Error updating event ❌",
            error
        });
    }
};

export const deleteEvent = async (req, res = response) => {
    try {
        const { id } = req.params;

        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).json({
                success: false,
                msg: "Event not found ❌"
            });
        }

        event.estado = false;
        await event.save();

        res.status(200).json({
            success: true,
            msg: "Event deleted successfully (soft delete) ✅"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            msg: "Error deleting event ❌",
            error
        });
    }
};

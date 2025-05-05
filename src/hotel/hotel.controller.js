import { response } from "express";
import Hotel from "./hotel.model.js";

export const createHotel = async (req, res = response) => {
    try {
        const { name, address, description, category, amenities } = req.body;
        const adminId = req.usuario._id;

        const existingHotel = await Hotel.findOne({ name });
        if (existingHotel) {
            return res.status(400).json({
                success: false,
                msg: "Hotel already exists ⚠️"
            });
        }

        const newHotel = new Hotel({
            name,
            address,
            description,
            category,
            amenities,
            admin: adminId
        });

        await newHotel.save();

        res.status(201).json({
            success: true,
            msg: "Hotel created successfully ✅",
            hotel: newHotel
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            msg: "Error creating hotel ❌",
            error
        });
    }
};

export const getHotels = async (req, res = response) => {
    try {
        const { category, amenities } = req.query;
        const query = { estado: true };

        if (category) query.category = category.toUpperCase();
        if (amenities) query.amenities = { $in: amenities.split(",").map(a => a.toUpperCase()) };

        const hotels = await Hotel.find(query).populate("admin", "name email");

        res.status(200).json({
            success: true,
            hotels
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            msg: "Error fetching hotels ❌",
            error
        });
    }
};

export const getHotelById = async (req, res = response) => {
    try {
        const { id } = req.params;

        const hotel = await Hotel.findById(id).populate("admin", "name email");

        if (!hotel || !hotel.estado) {
            return res.status(404).json({
                success: false,
                msg: "Hotel not found 🔍❌"
            });
        }

        res.status(200).json({
            success: true,
            hotel
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            msg: "Error fetching hotel ❌",
            error
        });
    }
};

export const updateHotel = async (req, res = response) => {
    try {
        const { id } = req.params;
        const { name, address, description, category, amenities } = req.body;

        const hotel = await Hotel.findById(id);
        if (!hotel) {
            return res.status(404).json({
                success: false,
                msg: "Hotel not found 🔍❌"
            });
        }

        hotel.name = name || hotel.name;
        hotel.address = address || hotel.address;
        hotel.description = description || hotel.description;
        hotel.category = category || hotel.category;
        hotel.amenities = amenities || hotel.amenities;

        await hotel.save();

        res.status(200).json({
            success: true,
            msg: "Hotel updated successfully ✅",
            hotel
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            msg: "Error updating hotel ❌",
            error
        });
    }
};

export const deleteHotel = async (req, res = response) => {
    try {
        const { id } = req.params;

        const hotel = await Hotel.findById(id);
        if (!hotel) {
            return res.status(404).json({
                success: false,
                msg: "Hotel not found 🔍❌"
            });
        }

        hotel.estado = false;
        await hotel.save();

        res.status(200).json({
            success: true,
            msg: "Hotel deleted successfully (soft delete) ✅"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            msg: "Error deleting hotel ❌",
            error
        });
    }
};

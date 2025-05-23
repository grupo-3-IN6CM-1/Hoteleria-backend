import { response } from "express";
import Room from "./room.model.js";

export const createRoom = async (req, res = response) => {
    try {
        const { hotel, number, type, capacity, pricePerNight, description } = req.body;

        const existingRoom = await Room.findOne({ hotel, number });
        if (existingRoom) {
            return res.status(400).json({
                success: false,
                msg: "Room already exists in this hotel ⚠️"
            });
        }

        const newRoom = new Room({
            hotel,
            number,
            type,
            capacity,
            pricePerNight,
            description
        });

        await newRoom.save();

        res.status(201).json({
            success: true,
            msg: "Room created successfully ✅",
            room: newRoom
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            msg: "Error creating room ❌",
            error
        });
    }
};

export const getRooms = async (req, res = response) => {
    try {
        const rooms = await Room.find({ estado: true }).populate("hotel", "name address");
        res.status(200).json({
            success: true,
            rooms
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            msg: "Error fetching rooms ❌",
            error
        });
    }
};

export const getRoomById = async (req, res = response) => {
    try {
        const { id } = req.params;

        const room = await Room.findById(id).populate("hotel", "name address");
        if (!room || !room.estado) {
            return res.status(404).json({
                success: false,
                msg: "Room not found 🔍❌"
            });
        }

        res.status(200).json({
            success: true,
            room
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            msg: "Error fetching room ❌",
            error
        });
    }
};

export const updateRoom = async (req, res = response) => {
  try {
    const { id } = req.params;
    const { number, type, capacity, pricePerNight, description, available, hotel } = req.body;

    const room = await Room.findById(id);
    if (!room) {
      return res.status(404).json({
        success: false,
        msg: "Room not found 🔍❌"
      });
    }

    room.number = number || room.number;
    room.type = type || room.type;
    room.capacity = capacity || room.capacity;
    room.pricePerNight = pricePerNight || room.pricePerNight;
    room.description = description || room.description;
    if (available !== undefined) room.available = available;
    if (hotel) room.hotel = hotel;

    await room.save();

    res.status(200).json({
      success: true,
      msg: "Room updated successfully ✅",
      room
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      msg: "Error updating room ❌",
      error
    });
  }
};

export const deleteRoom = async (req, res = response) => {
    try {
        const { id } = req.params;

        const room = await Room.findById(id);
        if (!room) {
            return res.status(404).json({
                success: false,
                msg: "Room not found 🔍❌"
            });
        }

        room.estado = false;
        await room.save();

        res.status(200).json({
            success: true,
            msg: "Room deleted successfully (soft delete) ✅"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            msg: "Error deleting room ❌",
            error
        });
    }
};

export const getRoomsByHotel = async (req, res = response) => {
  try {
    const { hotelId } = req.params;

    const rooms = await Room.find({ hotel: hotelId, estado: true }).populate("hotel", "name address");

    if (!rooms || rooms.length === 0) {
      return res.status(404).json({
        success: false,
        msg: "No se encontraron habitaciones para este hotel ❌"
      });
    }

    res.status(200).json({
      success: true,
      rooms
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      msg: "Error al obtener las habitaciones por hotel ❌",
      error
    });
  }
};
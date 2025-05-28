import { response } from "express";
import Reservation from "./reservation.model.js";
import Room from "../room/room.model.js";
import Hotel from "../hotel/hotel.model.js"

export const createReservation = async (req, res = response) => {
    try {
        const { hotel, room, checkIn, checkOut } = req.body;
        const userId = req.usuario._id;

        const selectedRoom = await Room.findById(room);
        if (!selectedRoom || !selectedRoom.estado) {
            return res.status(404).json({
                success: false,
                msg: "Room not found or inactive ❌"
            });
        }

        const overlap = await Reservation.findOne({
            room,
            estado: true,
            $or: [
                {
                    checkIn: { $lt: new Date(checkOut) },
                    checkOut: { $gt: new Date(checkIn) }
                }
            ]
        });

        if (overlap) {
            return res.status(400).json({
                success: false,
                msg: "Room already reserved for the selected dates 📅❌"
            });
        }

        const days = (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24);
        if (days < 1) {
            return res.status(400).json({
                success: false,
                msg: "Reservation must be at least 1 day 📆❌"
            });
        }

        const totalPrice = days * selectedRoom.pricePerNight;

        const reservation = new Reservation({
            user: userId,
            hotel,
            room,
            checkIn,
            checkOut,
            totalPrice
        });

        await reservation.save();

        res.status(201).json({
            success: true,
            msg: "Reservation created successfully ✅",
            reservation
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            msg: "Error creating reservation ❌",
            error
        });
    }
};

export const getReservations = async (req, res = response) => {
    try {
        const reservations = await Reservation.find({ estado: true })
            .populate("user", "name email")
            .populate("hotel", "name")
            .populate("room", "number type");

        res.status(200).json({
            success: true,
            reservations
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            msg: "Error fetching reservations ❌",
            error
        });
    }
};

export const getReservationById = async (req, res = response) => {
    try {
        const { id } = req.params;

        const reservation = await Reservation.findById(id)
            .populate("user", "name email")
            .populate("hotel", "name")
            .populate("room", "number type");

        if (!reservation || !reservation.estado) {
            return res.status(404).json({
                success: false,
                msg: "Reservation not found ❌"
            });
        }

        res.status(200).json({
            success: true,
            reservation
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            msg: "Error fetching reservation ❌",
            error
        });
    }
};

export const updateReservationStatus = async (req, res = response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const reservation = await Reservation.findById(id);
        if (!reservation) {
            return res.status(404).json({
                success: false,
                msg: "Reservation not found ❌"
            });
        }

        reservation.status = status;
        await reservation.save();

        res.status(200).json({
            success: true,
            msg: "Reservation status updated ✅",
            reservation
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            msg: "Error updating reservation ❌",
            error
        });
    }
};

export const deleteReservation = async (req, res = response) => {
    try {
        const { id } = req.params;

        const reservation = await Reservation.findById(id);
        if (!reservation) {
            return res.status(404).json({
                success: false,
                msg: "Reservation not found ❌"
            });
        }

        reservation.estado = false;
        await reservation.save();

        res.status(200).json({
            success: true,
            msg: "Reservation deleted (soft delete) ✅"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            msg: "Error deleting reservation ❌",
            error
        });
    }
};

export const getReservationsByUsername = async (req, res = response) => {
  try {
    const { username } = req.query;

    if (!username) {
      return res.status(400).json({
        success: false,
        msg: "El parámetro 'username' es obligatorio ❌"
      });
    }

    const reservations = await Reservation.find({ estado: true })
      .populate({
        path: "user",
        match: { username },
        select: "username name email"
      })
      .populate("hotel", "name address")
      .populate("room", "number type pricePerNight");

    // Filtra las que sí tienen user (match exitoso)
    const filtered = reservations.filter(r => r.user);

    return res.status(200).json({
      success: true,
      reservations: filtered,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      msg: "Error al obtener reservaciones ❌",
      error
    });
  }
};

export const getReservationsByAdminHotel = async (req, res = response) => {
  try {
    const adminId = req.usuario._id.toString();

    const myHotels = await Hotel.find({ admin: adminId }).select("_id");
    const hotelIds = myHotels.map(h => h._id);
    if (hotelIds.length === 0) {
      return res.status(404).json({
        success: false,
        msg: "No administras ningún hotel ❌"
      });
    }

    const reservations = await Reservation.find({
      hotel: { $in: hotelIds },
      estado: true
    })
      .populate("user", "username email")
      .populate("room", "number type")
      .populate("hotel", "name");

    return res.status(200).json({
      success: true,
      reservations
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      msg: "Error al obtener reservaciones del hotel por admin ❌",
      error
    });
  }
};

export const getGuestsByAdminHotel = async (req, res) => {
  try {
    const adminId = req.usuario._id.toString();

    const myHotels = await Hotel.find({ admin: adminId }).select("_id");
    const hotelIds = myHotels.map(h => h._id);
    if (hotelIds.length === 0) {
      return res.status(404).json({
        success: false,
        msg: "No administras ningún hotel ❌"
      });
    }

    const reservations = await Reservation.find({
      hotel: { $in: hotelIds },
      estado: true
    })
    .populate("user", "username email");

    const map = new Map();
    reservations.forEach(r => {
      if (r.user && !map.has(r.user._id.toString())) {
        map.set(r.user._id.toString(), r.user);
      }
    });
    const guests = Array.from(map.values());

    return res.json({ success: true, guests });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      msg: "Error intern o al obtener huéspedes ❌",
      error
    });
  }
};
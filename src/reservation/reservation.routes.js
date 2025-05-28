import { Router } from "express";
import { check } from "express-validator";
import { createReservation, getReservations, getReservationById, getGuestsByAdminHotel , updateReservationStatus, deleteReservation, getReservationsByUsername, getReservationsByAdminHotel } from "./reservation.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";

const router = Router();

router.get("/by-username", getReservationsByUsername);

router.get("/", getReservations);

router.get(
  "/my",
  [
    validarJWT,
  ],
  getReservationsByAdminHotel
);

router.get(
    "/:id",
    [
        check("id", "Invalid reservation ID").isMongoId(),
        validarCampos
    ],
    getReservationById
);

router.get(
  "/guests/my",
    [
        validarJWT
    ],
    getGuestsByAdminHotel
);

router.post(
    "/",
    [
        validarJWT,
        check("hotel", "Hotel ID is required").isMongoId(),
        check("room", "Room ID is required").isMongoId(),
        check("checkIn", "Check-in date is required").isISO8601(),
        check("checkOut", "Check-out date is required").isISO8601(),
        validarCampos
    ],
    createReservation
);

router.put(
    "/:id/status",
    [
        validarJWT,
        check("id", "Invalid reservation ID").isMongoId(),
        check("status", "Status must be CONFIRMED, CANCELLED or COMPLETED").isIn(["CONFIRMED", "CANCELLED", "COMPLETED"]),
        validarCampos
    ],
    updateReservationStatus
);

router.delete(
    "/:id",
    [
        validarJWT,
        check("id", "Invalid reservation ID").isMongoId(),
        validarCampos
    ],
    deleteReservation
);

export default router;

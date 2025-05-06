import { Router } from "express";
import { check } from "express-validator";
import { createRoom, getRooms, getRoomById, updateRoom, deleteRoom } from "./room.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { tieneRole } from "../middlewares/validar-roles.js";

const router = Router();

router.get("/", getRooms);

router.get(
    "/:id",
    [
        check("id", "Invalid room ID").isMongoId(),
        validarCampos
    ],
    getRoomById
);

router.post(
    "/",
    [
        validarJWT,
        tieneRole("HOTEL_ADMIN", "PLATFORM_ADMIN"),
        check("hotel", "Hotel ID is required").isMongoId(),
        check("number", "Room number is required").not().isEmpty(),
        check("type", "Room type is required").not().isEmpty(),
        check("capacity", "Room capacity must be a number").isInt({ min: 1 }),
        check("pricePerNight", "Room price must be a number").isFloat({ min: 0 }),
        validarCampos
    ],
    createRoom
);

router.put(
    "/:id",
    [
        validarJWT,
        tieneRole("HOTEL_ADMIN", "PLATFORM_ADMIN"),
        check("id", "Invalid room ID").isMongoId(),
        validarCampos
    ],
    updateRoom
);

router.delete(
    "/:id",
    [
        validarJWT,
        tieneRole("HOTEL_ADMIN", "PLATFORM_ADMIN"),
        check("id", "Invalid room ID").isMongoId(),
        validarCampos
    ],
    deleteRoom
);

export default router;
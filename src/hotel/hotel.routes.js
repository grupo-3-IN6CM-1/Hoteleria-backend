import { Router } from "express";
import { check } from "express-validator";
import { createHotel, getHotels, getHotelById, getMyHotels, updateHotel, deleteHotel } from "./hotel.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { tieneRole } from "../middlewares/validar-roles.js";

const router = Router();

router.get("/", getHotels);

router.get(
    '/my',
    [
        validarJWT
    ], 
    getMyHotels
);

router.get(
    "/:id",
    [
        check("id", "Invalid hotel ID").isMongoId(),
        validarCampos
    ],
    getHotelById
);

router.post(
    "/",
    [
        validarJWT,
        tieneRole("HOTEL_ADMIN", "PLATFORM_ADMIN"),
        check("name", "Hotel name is required ✋").not().isEmpty(),
        check("address", "Address is required ✋").not().isEmpty(),
        check("description", "Description is required ✋").not().isEmpty(),
        validarCampos
    ],
    createHotel
);

router.put(
    "/:id",
    [
        validarJWT,
        tieneRole("HOTEL_ADMIN", "PLATFORM_ADMIN"),
        check("id", "Invalid hotel ID").isMongoId(),
        validarCampos
    ],
    updateHotel
);

router.delete(
    "/:id",
    [
        validarJWT,
        tieneRole("HOTEL_ADMIN", "PLATFORM_ADMIN"),
        check("id", "Invalid hotel ID").isMongoId(),
        validarCampos
    ],
    deleteHotel
);

export default router;

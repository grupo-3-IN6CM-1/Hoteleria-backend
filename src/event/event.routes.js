import { Router } from "express";
import { check } from "express-validator";
import { createEvent, getEvents, getEventById, updateEvent, deleteEvent } from "./event.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";

const router = Router();

router.get("/", getEvents);

router.get(
    "/:id",
    [
        check("id", "Invalid event ID").isMongoId(),
        validarCampos
    ],
    getEventById
);

router.post(
    "/",
    [
        validarJWT,
        check("hotel", "Hotel ID is required").isMongoId(),
        check("title", "Title is required").not().isEmpty(),
        check("date", "Date is required and must be valid").isISO8601(),
        check("price", "Price must be a positive number").isFloat({ min: 0 }),
        validarCampos
    ],
    createEvent
);

router.put(
    "/:id",
    [
        validarJWT,
        check("id", "Invalid event ID").isMongoId(),
        validarCampos
    ],
    updateEvent
);

router.delete(
    "/:id",
    [
        validarJWT,
        check("id", "Invalid event ID").isMongoId(),
        validarCampos
    ],
    deleteEvent
);

export default router;

import { Router } from "express";
import { check } from "express-validator";
import {
    createInvoice,
    getInvoices,
    getInvoiceById,
    updateInvoiceStatus,
    deleteInvoice
} from "./invoice.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { tieneRole } from "../middlewares/validar-roles.js";

const router = Router();

router.get("/", getInvoices);

router.get(
    "/:id",
    [
        check("id", "Invalid invoice ID").isMongoId(),
        validarCampos
    ],
    getInvoiceById
);

router.post(
    "/",
    [
        validarJWT,
        tieneRole("PLATFORM_ADMIN", "HOTEL_ADMIN"),
        check("reservation", "Reservation ID is required").isMongoId(),
        check("hotel", "Hotel ID is required").isMongoId(),
        check("user", "User ID is required").isMongoId(),
        check("amount", "Amount is required and must be positive").isFloat({ min: 0 }),
        check("total", "Total is required and must be positive").isFloat({ min: 0 }),
        validarCampos
    ],
    createInvoice
);

router.put(
    "/:id/status",
    [
        validarJWT,
        tieneRole("PLATFORM_ADMIN", "HOTEL_ADMIN"),
        check("id", "Invalid invoice ID").isMongoId(),
        check("status", "Status must be PENDING, PAID or CANCELLED").isIn(["PENDING", "PAID", "CANCELLED"]),
        validarCampos
    ],
    updateInvoiceStatus
);

router.delete(
    "/:id",
    [
        validarJWT,
        tieneRole("PLATFORM_ADMIN", "HOTEL_ADMIN"),
        check("id", "Invalid invoice ID").isMongoId(),
        validarCampos
    ],
    deleteInvoice
);

export default router;

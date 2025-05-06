import { Router } from "express";
import { check } from "express-validator";
import { createService, getServices, getServiceById, updateService, deleteService } from "./service.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { tieneRole } from "../middlewares/validar-roles.js";

const router = Router();

router.get("/", getServices);

router.get(
    "/:id",
    [
        check("id", "Invalid service ID").isMongoId(),
        validarCampos
    ],
    getServiceById
);

router.post(
    "/",
    [
        validarJWT,
        tieneRole("PLATFORM_ADMIN", "HOTEL_ADMIN"),
        check("name", "Service name is required").not().isEmpty(),
        check("price", "Price must be a positive number").isFloat({ min: 0 }),
        validarCampos
    ],
    createService
);

router.put(
    "/:id",
    [
        validarJWT,
        tieneRole("PLATFORM_ADMIN", "HOTEL_ADMIN"),
        check("id", "Invalid service ID").isMongoId(),
        validarCampos
    ],
    updateService
);

router.delete(
    "/:id",
    [
        validarJWT,
        tieneRole("PLATFORM_ADMIN", "HOTEL_ADMIN"),
        check("id", "Invalid service ID").isMongoId(),
        validarCampos
    ],
    deleteService
);

export default router;

import { Router } from "express";
import { check } from "express-validator";
import { createResource, getResources, getResourceById, updateResource, deleteResource } from "./resource.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { tieneRole } from "../middlewares/validar-roles.js";

const router = Router();

router.get("/", getResources);

router.get(
    "/:id",
    [
        check("id", "Invalid resource ID").isMongoId(),
        validarCampos
    ],
    getResourceById
);

router.post(
    "/",
    [
        validarJWT,
        tieneRole("PLATFORM_ADMIN", "HOTEL_ADMIN"),
        check("name", "Resource name is required").not().isEmpty(),
        validarCampos
    ],
    createResource
);

router.put(
    "/:id",
    [
        validarJWT,
        tieneRole("PLATFORM_ADMIN", "HOTEL_ADMIN"),
        check("id", "Invalid resource ID").isMongoId(),
        validarCampos
    ],
    updateResource
);

router.delete(
    "/:id",
    [
        validarJWT,
        tieneRole("PLATFORM_ADMIN", "HOTEL_ADMIN"),
        check("id", "Invalid resource ID").isMongoId(),
        validarCampos
    ],
    deleteResource
);

export default router;

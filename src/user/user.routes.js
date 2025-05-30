import { Router } from "express";
import { updateMyProfile, updateUserByAdmin, getUsersByRole, getClients} from "../user/user.controller.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { tieneRole } from "../middlewares/validar-roles.js"; 
import { check } from "express-validator";
import { validarCampos } from "../middlewares/validar-campos.js";

const router = Router();

router.put(
  "/me/:id",
  [
    validarJWT, 
    check("id", "Invalid user ID").isMongoId(),
    validarCampos, 
  ],
  updateMyProfile
);

router.put(
  "/:id",
  [
    validarJWT, 
    tieneRole("PLATFORM_ADMIN"),
    check("id", "Invalid user ID").isMongoId(),
    validarCampos, 
  ],
  updateUserByAdmin
);

router.get(
  "/",
  [
    validarJWT,
    tieneRole("PLATFORM_ADMIN"), 
    check("role", "El rol es requerido").notEmpty(),
  ],
  getUsersByRole
);

router.get("/clients", getClients);



export default router;

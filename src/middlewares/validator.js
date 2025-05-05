import { body } from "express-validator";
import { validarCampos } from "./validar-campos.js";
import { existenteEmail } from "../helpers/db-validator.js";

export const registerValidator = [
    body("name", "Name is required ✋").not().isEmpty(),
    body("surname", "Last name is required ✋").not().isEmpty(),
    body("email", "Please enter a valid email 📧✅").not().isEmpty().isEmail(),
    body("email").custom(existenteEmail),
    body("password", "Password must be at least 8 characters long 🔑🔢").isLength({ min: 8 }),
    validarCampos
];

export const loginValidator = [
    body("email").optional().isEmail().withMessage("Please enter a valid email 📧✅"),
    body("username").optional().isString().withMessage("Please enter a valid username 📝✅"),
    body("password", "Password must be at least 8 characters long 🔑🔢").isLength({ min: 8 }),
    (req, res, next) => {
        const { email, username } = req.body;
        if (!email && !username) {
            return res.status(400).json({
                success: false,
                msg: "Please provide either email or username to log in 👤"
            });
        }
        next();
    },
    validarCampos
];

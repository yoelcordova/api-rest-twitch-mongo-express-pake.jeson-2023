import express from "express";
import { login, register } from "../controllers/auth.controller.js";
import { body } from "express-validator";
import { validationResulExpress } from "../middlewares/validationResultExpress.js";

const router = express.Router();

router.post("/register", 
[
    body("email", "El formato de email es incorrecto")
        .trim()
        .isEmail()
        .normalizeEmail(),
    body("password", "Minimo 6 caracteres")
        .trim()
        .isLength({ min: 6 }),

    body("password", "El formato de password es incorrecto")
        
        .custom((value, { req }) => {
                if (value !== req.body.repassword) {
                    throw new error('No coinciden las contraseñas');
                }
                return value;
            }),
        ], 
        validationResulExpress,
        register
    
);

        router.post("/login",
        [ 
            body("email", "El formato de email es incorrecto")
            .trim()
            .isEmail()
            .normalizeEmail(),

        body("password", "Minimo 6 caracteres").trim().isLength({ min: 6 }),
    ],
    validationResulExpress,
    login
    );

export default router;

import { Router } from "express";
import { login, register } from "../controllers/auth.controller.js";
import { body } from "express-validator";
import { validationResult } from "express-validator"; // Cambio en la importación
import { validationResulExpress } from "../middlewares/validationResultExpress.js";

const router = Router();

router.post(
  "/register",
  [
    body("email", "El formato de email es incorrecto")
      .trim()
      .isEmail()
      .normalizeEmail(),
    body("password", "Mínimo 6 caracteres") // Cambio en el mensaje de error
      .trim()
      .isLength({ min: 6 }),

    body("repassword", "El formato de contraseña es incorrecto") // Cambio en el mensaje de error
      .custom((value, { req }) => {
        if (value !== req.body.password) { // Cambio de req.body.repassword a req.body.password
          throw new Error("No coinciden las contraseñas"); // Cambio de 'error' a 'Error'
        }
        return value;
      }),
  ],
  validationResulExpress,
  register
);

router.post(
  "/login",
  [
    body("email", "El formato de email es incorrecto")
      .trim()
      .isEmail()
      .normalizeEmail(),
    body("password", "Mínimo 6 caracteres")
      .trim()
      .isLength({ min: 6 }),
  ],
  validationResulExpress,
  login
);

export default router;

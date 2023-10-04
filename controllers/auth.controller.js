      import { User } from "../models/User.js";
      import jwt from "jsonwebtoken";
      import { generateRefreshToken, generateToken } from "../utils/tokenManager.js";
    

      export const register = async (req, res) => {
        const { email, password } = req.body;

        try {
          // Alternativa buscando por email
          let user = await User.findOne({ email });
          if (user) throw { code: 11000 };

          user = new User({ email, password });
          await user.save();
          // jwt token
          return res.status(201).json({ ok: true });
        } catch (error) {
          console.log(error);

          // Alternativa por defecto mongoose
          if (error.code === 11000) {
            return res.status(400).json({ error: 'Ya existe este usuario' });
          }
          return res.status(500).json({ error: "Error de servidor" });
        }
      };

      export const login = async (req, res) => {
        try {
          const { email, password } = req.body;
          let user = await User.findOne({ email });
          if (!user)
            return res.status(403).json({ error: "No Existe El Usuario" });

          const respuestaPassword = await user.comparePassword(password);
          if (!respuestaPassword)
            return res.status(403).json({ error: "Contraseña incorrecta" });
          // GENERAR EL TOKEN jwt

          const { token, expiresIn } = generateToken(user.id);
          generateRefreshToken(user.id, res);
          return res.json({ token, expiresIn});
          
          //este es el error que no lo puedo realizar
          // const token = jwt.sign({uid: user.id}, process.env.JWT_SECRET);
          // return res.json({ token });
          

        } catch (error) {
          console.log(error);
          return res.status(500).json({ error: "Error de Server" });
        }
      };



      export const infoUser = async (req, res) => {
        try {
          const user = await User.findById(req.uid).lean();
          return res.json({ email: user.email, uid: user.id });
        } catch (error) {
          return res.status(500).json({ error: "Error de servidor" });
        }
      };




      export const refreshToken = (req, res) => {
        try {
          const refreshTokenCookie = req.cookies.refreshToken
          if (!refreshTokenCookie) throw new  error ("No Existe el token");

        const { uid } = jwt.verify(refreshTokenCookie, process.env.JWT_REFRESH);
          const { token, expiresIn } = generateToken(uid);

          return res.json({ token, expiresIn });


        } catch (error) {
          console.log(error);

          const TokenVerificationErrors = {
            "invalid signature": "la firma del JWT no es valida",
            "jwt expired": "JWT expirado",
            "invalid token": "token no valido",
            "no Bearer": "Utiliza formato Bearer",
            "jwt malformed": "JWT formato mal formado",
            
        };
            return res
            .status(401)
            .send({ error: TokenVerificationErrors[error.message] });
        }
      };

      export const logout = (req, res) => {
        res.clearCookie("refreshToken");
        res.json({ok: true});
      };
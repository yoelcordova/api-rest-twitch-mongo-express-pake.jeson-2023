import  jwt  from "jsonwebtoken";





export const requireToken = (req, res, next) => {

    try {
        console.log(req.headers);
        let token = req.headers.authorization
        console.log("token mejorado",token);
        if (!token) throw new error("no Bearer");
        token = token.split(" ")[1];

        const {uid} = jwt.verify(token, process.env.JWT_SECRET);

        req.uid = uid;
            next();

    } catch (error) {
        console.log(error.message);

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
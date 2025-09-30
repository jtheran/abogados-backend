import logger from "../logs/logger.js";
import jwt from 'jsonwebtoken';
import config from "../config/config.js";

export const authorizeRoles = (roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.rol)) {
        return res.status(403).json({ msg: "Access denied. Insufficient permissions." });
      }
      next();
    };
};
  

export const authenticateToken = (req, res, next) => {
  const accessToken = req.cookies.accessToken; // Obtener el access token de la cookie

  if(!accessToken){

      return res.status(401).json({ msg: 'NO AUTORIZADO: ACCESS TOKEN FALTANTE' });
  }

  try{
      const payload = jwt.verify(accessToken, config.key);
      req.user = payload; // Adjuntar el payload del usuario a la solicitud
      next();
  } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
          // Si el access token ha expirado, el frontend deberá intentar el refresh.
          // Aquí se devuelve un 401 para que el interceptor de Axios actúe.

          return res.status(401).json({ msg: 'ACCESS TOKEN EXPIRADO' });
      } else if (err instanceof jwt.JsonWebTokenError) {

          return res.status(403).json({ msg: 'ACCESS TOKEN INVÁLIDO' });
      }
      return res.status(500).json({ msg: 'ERROR DE AUTENTICACIÓN' });
  }
};
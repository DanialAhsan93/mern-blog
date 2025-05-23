import jwt from "jsonwebtoken";
import { errorHandler } from './error.js';

export const verifyToken = (req, res, next) => {
  console.log('Cookies:', req.cookies); // 👈 Add this

  const token = req.cookies.access_token;

  if (!token) {
    return next(errorHandler(401, 'Unathorized'));
  };

  jwt.verify(
    token,
    process.env.JWT_Secret,
    (err, user) => {
      if (err) {
        next(errorHandler(401, 'Unathorized'))
      };

      req.user = user;
      next();
    }
  );
}


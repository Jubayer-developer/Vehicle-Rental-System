import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";

const auth = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    let token = authHeader;

    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }

    token = authHeader.split(" ")[1];
    const decoded = jwt.verify(
      token as string,
      config.jwt_secret as string
    ) as JwtPayload;

    req.user = decoded;

    if (roles.length && !roles.includes(decoded.role)) {
      return res.status(401).json({
        success: false,
        error: "Authorization failed",
      });
    }
    next();
  };
};

export default auth;

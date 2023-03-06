import { NextFunction, Request, Response } from "express";
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import config from '../config';

const jwtVerify = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        try {
            const decoded = jwt.verify(token, config.jwtConfig.secret as Secret);
            req.user = decoded; // store the decoded payload in req.user
            next(); // proceed to the next middleware or route handler
        } catch (error) {
            res.status(401).json({ message: "Invalid or expired token" }); // send an error response
        }
    } else {
        res.status(401).json({ message: "No token provided" }); // send an error response
    }
}

export default jwtVerify
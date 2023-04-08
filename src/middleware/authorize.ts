import { Request, Response, NextFunction } from 'express';
import { role, User } from '@prisma/client';
import Logger from '../utils/logger';

// Authorization middleware
export const authorizeRole = (roles: role[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = req.body.user
        const userRole = user.role; // Get the user's role from req.body.user

        // couldn't find user role in request
        if (!userRole) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // user role is not authorized (except for admin)
        if (!roles.includes(userRole) && userRole !== role.admin) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        // Authorized, proceed to the next middleware or route handler
        next();
    };
};


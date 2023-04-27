import { Request, Response, NextFunction } from 'express';
import { Group, role, User } from '@prisma/client';
import postService from '../services/post-service';
import eventService from '../services/event-service';
import Logger from '../utils/logger';

// Authorization middleware
export const authorizeRole = (roles: role[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = req.user as User;
        const userRole = user.role; // Get the user's role from req.user

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

export const authorizePostAuthor = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as User;
    const postId = parseInt(req.params.postId);
    const post = await postService.getPost({ id: postId });

    // couldn't find user role in request
    if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    // user role is not authorized (except for admin)
    if (user.id !== post?.authorId && user.role !== role.admin) {
        return res.status(403).json({ error: 'Forbidden' });
    }

    // Authorized, proceed to the next middleware or route handler
    next();
}

export const authorizeEventAuthor = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as User & { groups: Group[] };
    const eventId = parseInt(req.params.eventId);
    const event = await eventService.getEvent({ id: eventId });

    if (!event)
        return res.status(204).json({ message: `Event deleted` });

    if (user.id !== event.organiser.id && user.role === role.admin) {
        return res.status(403).json({
            error: `Forbidden`
        });
    }
    next();
}

export const authorizeUserAdminTrener = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as User & { groups: Group[] };
    const userId = parseInt(req.params.userId);

    // only user, admin and coach can access this
    if (user.id !== userId && user.role !== role.admin && user.role !== role.coach) {
        return res.status(403).json({
            error: `Forbidden`
        });
    }
    next();
}

export const userOnly = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as User & { groups: Group[] };
    const userId = parseInt(req.params.userId);

    if (user.id !== userId) {
        return res.status(403).json({
            error: `Forbidden`
        });
    }
    next();
}


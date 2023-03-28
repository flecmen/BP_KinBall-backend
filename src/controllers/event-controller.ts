import { UserOnEventStatus } from '@prisma/client';
import { Request, Response } from "express"
import eventService from "../services/events/event-service";
import Logger from "../utils/logger";
import userService from "../services/user-service";

export default {
    getEvent: async (req: Request, res: Response) => {
        const eventId = parseInt(req.params.eventId);
        const event = await eventService.getEvent({ id: eventId });
        res.status(200).json(event)
    },
    createEvent: async (req: Request, res: Response) => {
        let event = req.body;

        if (!event) {
            res.status(400).json({
                error: `Missing or falsy mandatory fields`
            });
        }

        event.organiser = { connect: event.organiserId }

        const new_event = await eventService.createEvent(event);
        res.status(201).json(new_event);
    },
    changeUserOnEventStatus: async (req: Request, res: Response) => {
        const userId = parseInt(req.params.userId);
        const eventId = parseInt(req.params.eventId);
        const userOnEventStatus = req.params.userOnEventStatus as UserOnEventStatus
        let boolValue = null;
        try {
            boolValue = JSON.parse(req.params.boolValue);
        } catch (e) {
            res.status(400).json({
                error: `Invalid boolValue value`
            });
        }


        if (!(userOnEventStatus in UserOnEventStatus)) {
            res.status(400).json({
                error: `Invalid userOnEventStatus value`
            });
        }

        const user = await userService.getUser({ id: userId });
        const event = await eventService.getEvent({ id: eventId });

        if (!user) {
            res.status(400).json({
                error: `User not found`
            });
        }
        if (!event) {
            res.status(400).json({
                error: `Event not found`
            });
        }
        // Pokud už user reagoval, tak jeho rakci smažeme
        if (event?.players.some(p => p.user.id === userId)) {
            await eventService.editEvent({ id: eventId }, { players: { delete: { userId_eventId: { userId: userId, eventId: eventId } } } });
        }
        // reagoval jinak, nebo jen reakci mazal?
        if (boolValue) {
            // reagoval jinak, vytvoříme novou reakci
            await eventService.editEvent({ id: eventId }, { players: { create: { user: { connect: { id: userId } }, status: userOnEventStatus } } });
        }
        const updated_event = await eventService.getEvent({ id: eventId })
        return res.status(201).json(updated_event);
    },

}
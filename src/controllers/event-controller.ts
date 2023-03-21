import { eventType } from '@prisma/client';
import { Request, Response } from "express"
import eventService from "../services/events/event-service";
import Logger from "../utils/logger";

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

}
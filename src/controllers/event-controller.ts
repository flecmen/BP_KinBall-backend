import { UserOnEventStatus, postType } from '@prisma/client';
import { Request, Response } from "express"
import eventService from "../services/events/event-service";
import postService from '../services/posts/post-service';
import Logger from "../utils/logger";
import userService from "../services/user-service";

export default {
    getEvent: async (req: Request, res: Response) => {
        const eventId = parseInt(req.params.eventId);
        const event = await eventService.getEvent({ id: eventId });
        res.status(200).json(event)
    },
    getMultipleEvents: async (req: Request, res: Response) => {
        // Parse post ids from query
        const eventIds = (req.query.idArray as string).split(',').map((eventId: string) => parseInt(eventId));
        const events = await eventService.getMultipleEvents(eventIds);
        if (events?.length === 0) {
            return res.status(400).json({ error: 'Failed to load events' })
        }
        return res.status(200).json(events)
    },
    getMultipleEventsByPostIds: async (req: Request, res: Response) => {
        // Parse post ids from query
        if (req.query.idArray === undefined) return res.status(400).json({ error: 'Missing idArray' })
        const postIds = (req.query.idArray as string).split(',').map((postId: string) => parseInt(postId));
        const events = await eventService.getMultipleEventsByPostIds(postIds);
        if (events?.length === 0) {
            return res.status(400).json({ error: 'Failed to load events' })
        }
        return res.status(200).json(events)
    },
    getPaginatedCurrentEvents: async (req: Request, res: Response) => {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        const events = await eventService.getPaginatedCurrentEvents(skip, limit);
        if (events === undefined) {
            return res.status(400).json({
                error: `Failed to load events`
            });
        }
        if (events.length === 0) {
            return res.status(204).send('No more events available');
        }
        return res.status(200).json(events)
    },
    getEventsByOrganiser: async (req: Request, res: Response) => {
        const organiserId = parseInt(req.params.userId);
        const events = await eventService.getEvents({ organiserId: organiserId });
        if (events === undefined) {
            return res.status(400).json({
                error: `Failed to load events`
            });
        }
        return res.status(200).json(events)
    },
    createEvent: async (req: Request, res: Response) => {
        let event = req.body;

        if (!event) {
            res.status(400).json({
                error: `Missing or falsy mandatory fields`
            });
        }
        // Create a post first
        const post = await postService.createPost({
            heading: 'new training',
            type: postType.event,
            groups: { connect: event.groups.map(({ id }: { id: number }) => ({ id })) },
            author: { connect: { id: event.organiser.id } }
        });
        event.organiser = { connect: { id: event.organiser.id } }
        event.post = { connect: { id: post?.id } }
        event.groups = { connect: event.groups.map(({ id }: { id: number }) => ({ id })) }
        event.price = parseInt(event.price) ?? null;
        event.people_limit = parseInt(event.people_limit) ?? null;
        event.substitues_limit = parseInt(event.substitues_limit) ?? null;
        if (isNaN(event.price)) event.price = 0;
        if (isNaN(event.people_limit)) event.people_limit = 0;
        if (isNaN(event.substitues_limit)) event.substitues_limit = 0;

        const new_event = await eventService.createEvent(event);

        if (!new_event) {
            res.status(400).json({
                error: `Event failed to create`
            });
        }

        res.status(201).json(await eventService.getEvent({ id: new_event?.id }));
    },
    deleteEvent: async (req: Request, res: Response) => {
        const eventId = parseInt(req.params.eventId);
        await eventService.deleteEvent({ id: eventId });
        res.status(204).json({
            message: `Event deleted`
        });
    },
    editEvent: async (req: Request, res: Response) => {
        const eventId = parseInt(req.params.eventId);
        const event = req.body;
        // we do not update these here
        delete event.organiser
        delete event.players
        delete event.teams
        // format groups for prisma
        event.groups = { set: [], connect: event.groups.map(({ id }: { id: number }) => ({ id })) }
        event.price = parseInt(event.price) ?? null;
        event.people_limit = parseInt(event.people_limit) ?? null;
        event.substitues_limit = parseInt(event.substitues_limit) ?? null;


        const new_event = await eventService.editEvent({ id: eventId }, event);
        if (!new_event) {
            res.status(400).json({
                error: `Event failed to edit`
            });
        }
        res.status(200).json(new_event)
    },
    changeUserOnEventStatus: async (req: Request, res: Response) => {
        const userId = parseInt(req.params.userId);
        const eventId = parseInt(req.params.eventId);
        const userOnEventStatus = req.params.userOnEventStatus as UserOnEventStatus

        // Check the boolValue
        let boolValue = JSON.parse(req.params.boolValue);

        if (!(userOnEventStatus in UserOnEventStatus)) {
            return res.status(400).json({
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
import { User, UserOnEventStatus, postType, Group, role, Event, Prisma, eventType } from '@prisma/client';
import { Request, Response } from "express"
import eventService from "../services/event-service";
import postService from '../services/post-service';
import userService from "../services/user-service";
import rewardService from '../services/reward-service';
import EventAttendance from '../types/eventAttendance';
import groupCheck from "../utils/group-check";
import Logger from '../utils/logger';

export default {
    getEvent: async (req: Request, res: Response) => {
        const eventId = parseInt(req.params.eventId);
        const event = await eventService.getEvent({ id: eventId });

        // Check if event and user have a group in common
        const user = req.user as User & { groups: Group[] };
        if (!groupCheck(event?.groups, user.groups))
            return res.status(403).json({ error: 'Forbidden' })

        res.status(200).json(event)
    },
    // example params : { idArray: [1,2,3,4,5]}
    getMultipleEvents: async (req: Request, res: Response) => {
        // Parse post ids from query
        if (req.query.idArray === undefined)
            return res.status(400).json({ error: 'Missing idArray' })

        const eventIds = (req.query.idArray as string).split(',').map((eventId: string) => parseInt(eventId));
        const events = await eventService.getEvents({ id: { in: eventIds } });

        if (events?.length === 0) {
            return res.status(400).json({ error: 'Failed to load events' })
        }

        // return only events that have a group in common with the user
        const user = req.user as User & { groups: Group[] };
        events?.forEach(
            event => {
                if (!groupCheck(event.groups, user.groups))
                    events.splice(events.indexOf(event), 1)
            }
        )

        return res.status(200).json(events)
    },

    // This means that user loaded posts, which contain an event. Posts are already group-checked, so we don't have to check groups again
    getMultipleEventsByPostIds: async (req: Request, res: Response) => {
        // Parse post ids from query
        const idArrayQuery = req.query.idArray
        if (idArrayQuery === undefined) return res.status(400).json({ error: 'Missing idArray' })
        const postIds = (idArrayQuery as string).split(',').map((postId: string) => parseInt(postId));
        const events = await eventService.getEvents({ postId: { in: postIds } })
        if (events?.length === 0) {
            return res.status(400).json({ error: 'Failed to load events' })
        }
        return res.status(200).json(events)
    },

    // Paginated upcoming events (right column on home page)
    getPaginatedCurrentEvents: async (req: Request, res: Response) => {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;
        const user = req.user as User & { groups: Group[] };

        const events = await eventService.getPaginatedCurrentEvents(skip, limit, user.groups);
        if (events === undefined) {
            return res.status(400).json({
                error: `Failed to load events`
            });
        }
        if (events.length === 0) {
            return res.status(204).json({ message: 'No more events available' });
        }
        return res.status(200).json(events)
    },

    // Only for trainers and admins, doesnt need group check
    // Filter can be null | today | future | past
    getEventsByOrganiser: async (req: Request, res: Response) => {
        const organiserId = parseInt(req.params.userId);
        const filter = req.params.filter as string | undefined;
        let eventWhereInput: Prisma.EventWhereInput = {}
        Logger.debug(`Filter: ${filter}`)
        if (filter) {
            switch (filter) {
                case ('today'): eventWhereInput = { organiserId: organiserId, time: { gte: new Date(new Date().setHours(0, 0, 0, 0)), lte: new Date(new Date().setHours(23, 59, 59, 999)) } }
                case ('future'): eventWhereInput = { organiserId: organiserId, time: { gte: new Date() } }
                case ('past'): eventWhereInput = { organiserId: organiserId, time: { lte: new Date() } }
            }
        } else {
            eventWhereInput = { organiserId: organiserId }
        }
        const events = await eventService.getEvents(eventWhereInput);

        if (events === undefined) {
            return res.status(400).json({
                error: `Failed to load events`
            });
        }
        return res.status(200).json(events)
    },
    createEvent: async (req: Request, res: Response) => {
        let event = req.body;

        // check if all mandatory fields are present
        if (!event || !event.organiser || !event.groups || !event.time || !event.type) {
            return res.status(400).json({
                error: `Missing or falsy mandatory fields`
            });
        }
        // Create a post first
        const post = await postService.createPost({
            heading: 'Trénink',
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

        // if type is kurz_pro_mladez, we will sign up all users in the group automatically
        if (event.type === eventType.kurz_pro_mladez) {

            //TODO:
        }

        const new_event = await eventService.createEvent(event);

        if (!new_event) {
            res.status(400).json({
                error: `Event failed to create`
            });
        }

        res.status(201).json(new_event);
    },

    deleteEvent: async (req: Request, res: Response) => {
        const eventId = parseInt(req.params.eventId);
        const event = await eventService.getEvent({ id: eventId });

        // event is deleted on cascade
        await postService.deletePost({ id: event?.postId });
        return res.status(204).json({
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

        // Check if the user is already reacted on the event
        const reaction = event?.players.find(p => p.user.id === userId)

        if (reaction !== undefined) {
            // reacted the same way, do nothing
            if (reaction.status === userOnEventStatus && boolValue)
                return res.status(200).json({ message: 'User already reacted with this status' });

            // smažeme body, pokud minulá reakce byla 'going'
            if (reaction.status === UserOnEventStatus.going) await rewardService.removeEventSignupReward([userId]);
            // smažeme reakci
            await eventService.editEvent({ id: eventId }, { players: { delete: { userId_eventId: { userId: userId, eventId: eventId } } } });
        }
        // reagoval pozitivně na jinou reakci?
        if (boolValue) {
            // reagoval, vytvoříme novou reakci
            await eventService.editEvent({ id: eventId }, { players: { create: { user: { connect: { id: userId } }, status: userOnEventStatus } } });
        }
        const updated_event = await eventService.getEvent({ id: eventId })
        return res.status(201).json(updated_event);
    },

    /*
    *   example data:
    * req.body = {
    * data: {userId: number, present: boolean}[]
    * }
    */
    changeUserAttendance: async (req: Request, res: Response) => {
        const eventId = parseInt(req.params.eventId);
        const data: EventAttendance[] = req.body.data;

        if (!data) {
            return res.status(400).json({
                error: `Missing or falsy mandatory fields`
            });
        }

        const eventWithUpdatedAttendance = await eventService.setEventAttendance(eventId, data);

        // Fail check
        if (!eventWithUpdatedAttendance) {
            return res.status(400).json({
                error: `Failed to update attendance`
            });
        }

        await rewardService.addAttendanceReward(data.filter(attendance => attendance.present).map(attendance => attendance.userId));
        await rewardService.removeAttendanceReward(data.filter(attendance => !attendance.present).map(attendance => attendance.userId));

        return res.status(200).json(eventWithUpdatedAttendance);
    },
}
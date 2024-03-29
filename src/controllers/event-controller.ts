import { Event, Group, Prisma, User, UserOnEventStatus, eventType, postType } from '@prisma/client';
import { Request, Response } from "express";
import groupCheck from "../helpers/group-check";
import eventService from "../services/event-service";
import postService from '../services/post-service';
import rewardService from '../services/reward-service';
import userService from "../services/user-service";
import newEventDTO from '../types/DTO/newEventDTO';
import EventAttendance from '../types/eventAttendance';
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
        let event: newEventDTO = req.body;

        // check if all mandatory fields are present
        if (!event || !event.organiser || !event.groups || !event.time || !event.type || !("organiser" in event) || !("groups" in event) || !("time" in event) || !("type" in event)) {
            return res.status(400).json({
                error: `Missing or falsy mandatory fields`
            });
        }
        // Create a post first
        const post = await postService.createPost({
            heading: 'Trénink',
            type: postType.event,
            groups: { connect: event.groups.map(({ id }: { id: number }) => ({ id })) },
            author: { connect: { id: event.organiser.id } },
            reaction_deadline: event.reaction_deadline
        });

        if (!post) {
            return res.status(400).json({
                error: `Failed to create event's post, hence the event itself was not created.`
            });
        }
        delete event.reaction_deadline;
        delete event.heading;

        let newEvent: Prisma.EventCreateInput = {
            ...event,
            organiser: { connect: { id: event.organiser.id } },
            post: { connect: { id: post.id } },
            groups: { connect: event.groups.map(({ id }: { id: number }) => ({ id })) },
            price: event.price ? parseInt(event.price) ?? 0 : 0,
            people_limit: Number.isNaN(parseInt(event.people_limit)) ? 0 : parseInt(event.people_limit) ?? 0,
            substitues_limit: Number.isNaN(parseInt(event.substitues_limit)) ? 0 : parseInt(event.substitues_limit) ?? 0,
        };


        // if type is kurz_pro_mladez, we will sign up all users in the group automatically
        if (newEvent.type === eventType.kurz_pro_mladez) {
            const users = await userService.getUsers({ groups: { some: { id: event.groups[0].id } } });
            // Pokud je limit moc malý pro počet lidí v kurzu, limit zvýšíme
            if (newEvent.people_limit !== 0 && newEvent.people_limit < users.length) newEvent.people_limit = users.length;

            newEvent.players = { create: users.map(({ id }: { id: number }) => ({ user: { connect: { id: id } }, status: UserOnEventStatus.going })) };
        }

        const created_event = await eventService.createEvent(newEvent);

        if (!created_event) {
            res.status(400).json({
                error: `Event failed to create`
            });
        }

        res.status(201).json(created_event);
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
            return res.status(400).json({
                error: `User not found`
            });
        }
        if (!event) {
            return res.status(400).json({
                error: `Event not found`
            });
        }

        // Check reaction deadline
        const post = await postService.getPost({ id: event.postId });
        if (post && post.reaction_deadline && post.reaction_deadline < new Date()) {
            return res.status(400).json({
                error: `Reaction deadline has passed`
            });
        }

        // Check if the user has already reacted on the event
        const reaction = event?.players.find(p => p.user.id === userId)

        // Has he reacted the same way?
        if ((reaction?.status === userOnEventStatus) && boolValue)
            // Yes, do nothing
            return res.status(200).json({ message: 'User already reacted with this status' });


        // Reagoval pozitivně
        if (boolValue) {
            //smažeme starou reakci, pokud existuje
            if (reaction) await eventService.editEvent({ id: eventId }, { players: { delete: { userId_eventId: { userId: userId, eventId: eventId } } } });
            // smažeme body, pokud minulá reakce byla 'going'
            if (reaction?.status === UserOnEventStatus.going) await rewardService.removeEventSignupReward([userId]);
            // Pokud reagoval going
            if (userOnEventStatus === UserOnEventStatus.going) {
                // Je termín plný?
                if (event?.people_limit && event?.people_limit !== 0 && event?.players.filter(p => p.status === UserOnEventStatus.going).length === event?.people_limit) {
                    // pokud je plný i počet záložníků, vrátíme chybu
                    if (event?.players.filter(p => p.status === UserOnEventStatus.substitute).length === event?.substitues_limit) return res.status(400).json({ error: 'Event is full' });
                    // u záložníků je místo, přidáme ho tam
                    const updated_event = await eventService.editEvent({ id: eventId }, { players: { create: { user: { connect: { id: userId } }, status: UserOnEventStatus.substitute } } });
                    return res.status(201).json(updated_event);
                    // na termínu je místo
                } else {
                    // termín plný není, přídáme mezi going 
                    const updated_event = await eventService.editEvent({ id: eventId }, { players: { create: { user: { connect: { id: userId } }, status: UserOnEventStatus.going } } });
                    // a přičteme body
                    await rewardService.addEventSignupReward([userId]);
                    return res.status(201).json(updated_event);
                }
            }
            // uživatel reagoval jinak pozitivně
            const updated_event = await eventService.editEvent({ id: eventId }, { players: { create: { user: { connect: { id: userId } }, status: userOnEventStatus } } });
            return res.status(201).json(updated_event);

        } else {
            // Reagoval negativně
            // smažeme reakci
            const updated_event = await eventService.editEvent({ id: eventId }, { players: { delete: { userId_eventId: { userId: userId, eventId: eventId } } } });
            // pokud byl předtím going, odečteme body
            if (reaction?.status === UserOnEventStatus.going) await rewardService.removeEventSignupReward([userId]);
            return res.status(201).json(updated_event);
        }
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
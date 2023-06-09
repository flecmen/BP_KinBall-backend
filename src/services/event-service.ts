import { Event, Group, Post, Prisma, PrismaClient } from "@prisma/client";
import { eventIncludes } from "../helpers/queryIncludes";
import EventAttendance from "../types/eventAttendance";
import Logger from "../utils/logger";

const prisma = new PrismaClient();

export default {
    async getEvent(eventWhereUniqueInput: Prisma.EventWhereUniqueInput) {
        try {
            return await prisma.event.findUnique({
                where: eventWhereUniqueInput,
                include: eventIncludes
            })
        } catch (e) {
            Logger.error(`event-service.getEvent: ${e}`)
        }
    },
    async getEvents(eventWhereInput: Prisma.EventWhereInput) {
        try {
            return await prisma.event.findMany({
                where: eventWhereInput,
                include: eventIncludes
            })
        } catch (e) {
            Logger.error(`event-service.getEvents: ${e}`)
        }
    },
    async getPaginatedCurrentEvents(skip: number, limit: number, userGroups: Group[]) {
        try {
            return await prisma.event.findMany({
                where: {
                    // only upcoming events
                    time: {
                        gte: new Date()
                    },
                    // only in groups that the user is in
                    groups: {
                        some: {
                            id: {
                                in: userGroups.map(group => group.id)
                            }
                        }
                    }
                },
                skip,
                take: limit,
                orderBy: { time: 'asc' },
                include: eventIncludes,
            })
        } catch (e) {
            Logger.error(`event-service.getPaginatedEvents: ${e}`)
        }
        return
    },
    async createEvent(data: Prisma.EventCreateInput) {
        try {
            return await prisma.event.create({
                data,
                include: eventIncludes
            })
        } catch (e) {
            Logger.error(`event-service.createEvent: ${e}`)
        }
    },
    async editEvent(eventWhereUniqueInput: Prisma.EventWhereUniqueInput, eventUpdateInput: Prisma.EventUpdateInput) {
        try {
            return await prisma.event.update({
                where: eventWhereUniqueInput,
                data: eventUpdateInput,
                include: eventIncludes
            })
        } catch (e) {
            Logger.error(`event-service.editEvent: ${e}, arugments: ${JSON.stringify({ eventWhereUniqueInput, eventUpdateInput })}`)
        }
    },
    async deleteEvent(eventWhereUniqueInput: Prisma.EventWhereUniqueInput) {
        try {
            return await prisma.event.delete({
                where: eventWhereUniqueInput
            })
        } catch (e) {
            Logger.error(`event-service.deleteEvent: ${e}`)
        }
    },
    async setEventAttendance(eventId: Event['id'], data: EventAttendance[]) {
        try {
            return await prisma.event.update({
                where: { id: eventId },
                data: {
                    players: {
                        updateMany: data.map(({ userId, present }) => ({
                            where: { userId },
                            data: { present }
                        }))
                    }
                },
                include: eventIncludes
            })
        } catch (e) {
            Logger.error(`event-service.setEventAttendance: ${e}`)
        }
    }
}


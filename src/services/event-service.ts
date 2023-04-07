import { Prisma, PrismaClient, Event, Post, User } from "@prisma/client";
import Logger from "../utils/logger";

const prisma = new PrismaClient();

export default {
    async getEvent(eventWhereUniqueInput: Prisma.EventWhereUniqueInput) {
        return await prisma.event.findUnique({
            where: eventWhereUniqueInput,
            include: eventIncludes
        })
    },
    async getEvents(eventWhereInput: Prisma.EventWhereInput) {
        return await prisma.event.findMany({
            where: eventWhereInput,
            include: eventIncludes
        })
    },
    async getMultipleEvents(idArray: Event['id'][]) {
        try {
            return await prisma.event.findMany({
                where: { id: { in: idArray } },
                include: eventIncludes,
            })
        } catch (e) {
            Logger.error(`event-service.getMultipleEvents: ${e}`)
        }
    },
    async getMultipleEventsByPostIds(postIdArray: Post['id'][]) {
        try {
            return await prisma.event.findMany({
                where: { postId: { in: postIdArray } },
                include: eventIncludes,
            })
        } catch (e) {
            Logger.error(`event-service.getMultipleEventsByPostIds: ${e}`)
        }
    },
    async getPaginatedCurrentEvents(skip: number, limit: number) {
        try {
            const events = await prisma.event.findMany({
                where: {
                    time: {
                        gte: new Date()
                    }
                },
                skip,
                take: limit,
                orderBy: { time: 'asc' },
                include: eventIncludes,
            })
            return events
        } catch (e) {
            Logger.error(`event-service.getPaginatedEvents: ${e}`)
        }
        return
    },
    async createEvent(data: Prisma.EventCreateInput) {
        try {
            Logger.debug(data)
            const event = await prisma.event.create({
                data
            })
            return await this.getEvent({ id: event.id })
        } catch (e) {
            Logger.error(`event-service.createEvent: ${e}`)
        }
    },
    async editEvent(eventWhereUniqueInput: Prisma.EventWhereUniqueInput, eventUpdateInput: Prisma.EventUpdateInput) {
        await prisma.event.update({
            where: eventWhereUniqueInput,
            data: eventUpdateInput
        })
        return this.getEvent(eventWhereUniqueInput)
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
    async setEventAttendance(eventId: Event['id'], data: { userId: User['id'], present: boolean }[]) {
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

const eventIncludes = {
    players: {
        include: {
            user: {
                include: { profile_picture: true }
            }
        }
    },
    organiser: {
        include: { profile_picture: true, }
    },
    teams: {
        include: {
            players: {
                include: { profile_picture: true }
            }
        }
    },
    groups: true,
}
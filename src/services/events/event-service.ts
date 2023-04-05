import { Prisma, PrismaClient, Event, Post } from "@prisma/client";
import Logger from "../../utils/logger";

const prisma = new PrismaClient();

export default {
    async getEvent(eventWhereUniqueInput: Prisma.EventWhereUniqueInput) {
        return await prisma.event.findUnique({
            where: eventWhereUniqueInput,
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
    getMultipleEventsByPostIds: async (postIdArray: Post['id'][]) => {
        try {
            return await prisma.event.findMany({
                where: { postId: { in: postIdArray } },
                include: eventIncludes,
            })
        } catch (e) {
            Logger.error(`event-service.getMultipleEventsByPostIds: ${e}`)
        }
    },
    async createEvent(data: Prisma.EventCreateInput) {
        const event = await prisma.event.create({
            data
        })
        return await this.getEvent({ id: event.id })
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
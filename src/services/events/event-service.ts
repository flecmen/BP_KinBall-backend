import { Prisma, PrismaClient, Post } from "@prisma/client";
import Logger from "../../utils/logger";

const prisma = new PrismaClient();

export default {
    async getEvent(eventWhereUniqueInput: Prisma.EventWhereUniqueInput) {
        return await prisma.event.findUnique({
            where: eventWhereUniqueInput,
            include: {
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
                }
            }
        })
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
    }
}
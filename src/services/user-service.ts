import { Prisma, PrismaClient } from "@prisma/client";
import Logger from "../utils/logger";
import { userInclude } from "../helpers/queryIncludes";

const prisma = new PrismaClient();

export default {
    async getUser(userWhereUniqueInput: Prisma.UserWhereUniqueInput) {
        return prisma.user.findUnique({
            where: userWhereUniqueInput,
            include: userInclude
        })
    },

    async getAllUsers() {
        return await prisma.user.findMany({
            include: userInclude
        });
    },

    async createUser(data: Prisma.UserCreateInput) {
        data.settings = { create: {} }
        data.reward_system = { create: {} }
        data.profile_picture = data.profile_picture ?? { connect: { id: 1 } }
        // Add user to default group "all"
        if (data.groups?.connect) {
            if (Array.isArray(data.groups.connect)) {
                data.groups.connect.push({ name: 'all' })
            }
        } else {
            data.groups = { connect: { name: 'all' } }
        }

        try {
            return await prisma.user.create({
                data,
                include: userInclude
            });
        } catch (e) {
            Logger.warn('createUser service: ' + e)
            return null
        }
    },

    async updateUser(userWhereUniqueInput: Prisma.UserWhereUniqueInput, userUpdateInput: Prisma.UserUpdateInput) {
        return await prisma.user.update({
            where: userWhereUniqueInput,
            data: userUpdateInput,
            include: userInclude,
        })
    },

    async deleteUser(userWhereUniqueInput: Prisma.UserWhereUniqueInput) {
        try {
            await prisma.user.delete({
                where: userWhereUniqueInput
            })
            return
        } catch (err) {
            Logger.error(`Failed to delete user ${userWhereUniqueInput.id}: ${err}`)
            return
        }

    },
}


import { Prisma, PrismaClient, User } from "@prisma/client";
import Logger from "../utils/logger";

const prisma = new PrismaClient();

export default {
    async getUser(userWhereUniqueInput: Prisma.UserWhereUniqueInput) {
        return prisma.user.findUnique({
            where: userWhereUniqueInput,
            include: {
                settings: true,
                reward_system: true,
                profile_picture: true,
                groups: true
            }
        })
    },

    async getAllUsers() {
        return await prisma.user.findMany({
            include: {
                groups: true,
                profile_picture: true,
            }
        });
    },

    async createUser(data: Prisma.UserCreateInput) {
        data.settings = { create: {} }
        data.reward_system = { create: {} }
        //TODO: přidat default profile_picture
        //přidat do defaultní skupniy "všichni"
        try {
            await prisma.user.create({
                data,
            });
        } catch (e) {
            Logger.warn('createUser service: ' + e)
            return null
        }
        return this.getUser({ email: data.email })
    },

    async updateUser(userId: User['id'], userUpdateInput: Prisma.UserUpdateInput) {
        let updatedUser = await prisma.user.update({
            where: {
                id: userId
            },
            data: userUpdateInput
        })

        return this.getUser({ email: userUpdateInput.email as string })
    },

    async updatePassword(userWhereUniqueInput: Prisma.UserWhereUniqueInput, password: User["password"]) {
        return prisma.user.update({
            where: userWhereUniqueInput,
            data: {
                password: password
            }
        })
    },

    async deleteUser(userWhereUniqueInput: Prisma.UserWhereUniqueInput): Promise<void> {
        try {
            await prisma.user.delete({
                where: userWhereUniqueInput
            })
        } catch (err) {
            Logger.error(`Failed to delete user ${userWhereUniqueInput.id}: ${err}`)
        }
        return
    },
}
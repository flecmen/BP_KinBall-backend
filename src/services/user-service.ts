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

    async createUser(data: Prisma.UserCreateInput): Promise<User> {
        return prisma.user.create({
            data,
        });
    },

    async updateUser(userId: User['id'], userUpdateInput: Prisma.UserUpdateInput): Promise<User> {
        let updatedUser = await prisma.user.update({
            where: {
                id: userId
            },
            data: userUpdateInput
        })

        return updatedUser
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
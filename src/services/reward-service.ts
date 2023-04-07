import { Prisma, PrismaClient, User } from "@prisma/client";
import userService from "./user-service";
import Logger from "../utils/logger";
import rewardPoints from "../config/rewardPoints";

const prisma = new PrismaClient();

async function removeXp(userIds: User['id'][], xp: number) {
    try {
        const query = Prisma.sql`
            UPDATE reward_system
            SET xp = GREATEST(xp - ${xp}, 0)
            WHERE userId IN (${Prisma.join(userIds, ', ')})
        `;
        await prisma.$executeRaw(query);
    } catch (err) {
        Logger.warn('rewardService[removeXp]: ' + err)
        return
    }
}

async function addXp(userIds: User['id'][], xp: number) {
    try {
        await prisma.reward_system.updateMany({
            where: { userId: { in: userIds } },
            data: {
                xp: {
                    increment: xp
                }
            }
        })
    } catch (err) {
        Logger.warn('rewardService[addXp]: ' + err)
        return
    }
}

export default {
    async addlikeReward(userId: User['id']) {
        try {
            await addXp([userId], rewardPoints.post.like)
        } catch (err) {
            Logger.warn('rewardService[likeReward]: ' + err)
            return
        }
    },
    async removeLikeReward(userId: User['id']) {
        try {
            await removeXp([userId], rewardPoints.post.like)
        } catch (err) {
            Logger.warn('rewardService[removeLikeReward]: ' + err)
            return
        }
    },
    async addEventSignupReward(userIds: User['id'][]) {
        try {
            await addXp(userIds, rewardPoints.event.signup)
        } catch (err) {
            Logger.warn('rewardService[addEventSignupReward]: ' + err)
            return
        }
    },
    async removeEventSignupReward(userIds: User['id'][]) {
        try {
            await removeXp(userIds, rewardPoints.event.signup)
        } catch (err) {
            Logger.warn('rewardService[removeEventSignupReward]: ' + err)
            return
        }
    },
    async addCommentReward(userId: User['id']) {
        try {
            await addXp([userId], rewardPoints.post.comment)
        } catch (err) {
            Logger.warn('rewardService[addCommentReward]: ' + err)
            return
        }
    },
    async removeCommentReward(userId: User['id']) {
        try {
            await removeXp([userId], rewardPoints.post.comment)
        } catch (err) {
            Logger.warn('rewardService[removeCommentReward]: ' + err)
            return
        }
    },
    async monthlyPunishment() {
        try {
            const userIds = (await userService.getAllUsers()).map(u => u.id)
            await removeXp(userIds, rewardPoints.punishment.monthly)
        } catch (err) {
            Logger.warn('rewardService[monthlyPunishment]: ' + err)
            return
        }
    },
}
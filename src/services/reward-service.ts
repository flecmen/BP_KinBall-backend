import { Prisma, PrismaClient, User } from "@prisma/client";
import userService from "./user-service";
import Logger from "../utils/logger";
import rewardPoints from "../config/rewardPoints";

const prisma = new PrismaClient();

async function removeXp(userIds: User['id'][], amount: number) {
    // If empty array is passed, return
    if (userIds.length === 0) return;
    try {
        await prisma.reward_system.updateMany({
            where: {
                userId: {
                    in: userIds
                }
            },
            data: {
                xp: {
                    decrement: amount
                }
            }
        });

        const reward_systems = await prisma.reward_system.findMany({
            where: {
                userId: { in: userIds }
            }
        })

        const negative_xps = reward_systems.filter(r => r.xp < 0)
        if (negative_xps.length > 0) {
            // all negative xp records are set to 0
            await prisma.reward_system.updateMany({
                where: {
                    userId: { in: negative_xps.map(n => n.userId) },
                },
                data: {
                    xp: { set: 0 }
                }
            })
        }

    } catch (err) {
        Logger.error('rewardService[removeXp]: ' + err)
        return
    }
}

async function addXp(userIds: User['id'][], xp: number) {
    if (userIds.length === 0) return;
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
        Logger.error('rewardService[addXp]: ' + err)
        return
    }
}

export default {
    async addlikeReward(userId: User['id']) {
        try {
            await addXp([userId], rewardPoints.post.like)
        } catch (err) {
            Logger.error('rewardService[likeReward]: ' + err)
            return
        }
    },
    async removeLikeReward(userId: User['id']) {
        try {
            await removeXp([userId], rewardPoints.post.like)
        } catch (err) {
            Logger.error('rewardService[removeLikeReward]: ' + err)
            return
        }
    },
    async addEventSignupReward(userIds: User['id'][]) {
        try {
            await addXp(userIds, rewardPoints.event.signup)
        } catch (err) {
            Logger.error('rewardService[addEventSignupReward]: ' + err)
            return
        }
    },
    async removeEventSignupReward(userIds: User['id'][]) {
        try {
            await removeXp(userIds, rewardPoints.event.signup)
        } catch (err) {
            Logger.error('rewardService[removeEventSignupReward]: ' + err)
            return
        }
    },
    async addCommentReward(userId: User['id']) {
        try {
            await addXp([userId], rewardPoints.post.comment)
        } catch (err) {
            Logger.error('rewardService[addCommentReward]: ' + err)
            return
        }
    },
    async removeCommentReward(userId: User['id']) {
        try {
            await removeXp([userId], rewardPoints.post.comment)
        } catch (err) {
            Logger.error('rewardService[removeCommentReward]: ' + err)
            return
        }
    },
    async monthlyPunishment() {
        try {
            const userIds = (await userService.getAllUsers()).map(u => u.id)
            await removeXp(userIds, rewardPoints.punishment.monthly)
        } catch (err) {
            Logger.error('rewardService[monthlyPunishment]: ' + err)
            return
        }
    },
    async addAttendanceReward(userIds: User['id'][]) {
        try {
            await addXp(userIds, rewardPoints.event.attendance)
        } catch (err) {
            Logger.error('rewardService[addAttendanceReward]: ' + err)
            return
        }
    },
    async removeAttendanceReward(userIds: User['id'][]) {
        try {
            // users not attending event they signed up for, will get removed points for attendance and points for signup
            await removeXp(userIds, rewardPoints.event.attendance + rewardPoints.event.signup)
        } catch (err) {
            Logger.error('rewardService[removeAttendanceReward]: ' + err)
            return
        }
    },
}
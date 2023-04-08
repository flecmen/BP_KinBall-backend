import { Prisma, PrismaClient } from "@prisma/client";
import { commentInclude } from "../types/queryIncludes";
import Logger from "../utils/logger";

const prisma = new PrismaClient();

export default {
    async getComment(post_commentWhereUniqueInput: Prisma.Post_commentWhereUniqueInput) {
        try {
            return await prisma.post_comment.findUnique({
                where: post_commentWhereUniqueInput,
                include: commentInclude
            })
        } catch (e) {
            Logger.error(`comment-service.getComment: ${e}`)
        }
    },
    async createComment(data: Prisma.Post_commentCreateInput) {
        try {
            return await prisma.post_comment.create({
                data,
                include: commentInclude
            })
        } catch (e) {
            Logger.error(`comment-service.createComment: ${e}`)
        }
    },
    async editComment(post_commentWhereUniqueInput: Prisma.Post_commentWhereUniqueInput, post_commentUpdateInput: Prisma.Post_commentUpdateInput) {
        try {
            return await prisma.post_comment.update({
                where: post_commentWhereUniqueInput,
                data: post_commentUpdateInput,
                include: commentInclude
            })
        } catch (e) {
            Logger.error(`comment-service.editComment: ${e}`)
        }
    }
}
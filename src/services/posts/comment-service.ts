import { Prisma, PrismaClient, Post } from "@prisma/client";
import Logger from "../../utils/logger";

const prisma = new PrismaClient();

export default {
    async getComment(post_commentWhereUniqueInput: Prisma.Post_commentWhereUniqueInput) {
        return await prisma.post_comment.findUnique({
            where: post_commentWhereUniqueInput,
            include: {
                author: true,
                likes: true,
            }
        })
    },
    async createComment(data: Prisma.Post_commentCreateInput) {
        const comment = await prisma.post_comment.create({
            data
        })
        return await this.getComment({ id: comment.id })
    },
    async editComment(post_commentWhereUniqueInput: Prisma.Post_commentWhereUniqueInput, post_commentUpdateInput: Prisma.Post_commentUpdateInput) {
        await prisma.post_comment.update({
            where: post_commentWhereUniqueInput,
            data: post_commentUpdateInput
        })
        return this.getComment(post_commentWhereUniqueInput)
    }
}
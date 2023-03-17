import { Prisma, PrismaClient, Post } from "@prisma/client";
import Logger from "../../utils/logger";

const prisma = new PrismaClient();

export default {
    async getComment(post_commentWhereUniqueInput: Prisma.Post_commentWhereUniqueInput) {
        return await prisma.post.findUnique({
            where: post_commentWhereUniqueInput,
            include: {
                author: true,
            }
        })
    },
    async createComment(data: Prisma.Post_commentCreateInput) {
        const comment = await prisma.post_comment.create({
            data
        })
        return await this.getComment({ id: comment.id })
    }
}
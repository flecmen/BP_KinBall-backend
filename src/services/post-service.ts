import { Prisma, PrismaClient, Post } from "@prisma/client";
import Logger from "../utils/logger";

const prisma = new PrismaClient();

export default {
    async getPost(postWhereUniqueInput: Prisma.PostWhereUniqueInput) {
        return prisma.post.findUnique({
            where: postWhereUniqueInput,
            include: {
                author: true,
                groups: true,
                event: true,
                images: true,
                likes: true,
                comments: true,
                survey_options: true,
                user_notification: true
            }
        })
    },

    async createPost(data: Prisma.PostCreateInput) {
        const new_post = await prisma.post.create({
            data,
        });
        return this.getPost({ id: new_post.id })
    },

    async editPost(postId: Post['id'], postUpdateInput: Prisma.PostUpdateInput) {
        await prisma.post.update({
            where: {
                id: postId
            },
            data: postUpdateInput
        })

        return this.getPost({ id: postId })
    },
}
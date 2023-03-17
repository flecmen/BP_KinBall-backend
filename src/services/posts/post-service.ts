import { Prisma, PrismaClient, Post } from "@prisma/client";
import Logger from "../../utils/logger";

const prisma = new PrismaClient();

export default {
    async getPost(postWhereUniqueInput: Prisma.PostWhereUniqueInput) {
        return await prisma.post.findUnique({
            where: postWhereUniqueInput,
            include: {
                author: true,
                groups: true,
                event: true,
                images: true,
                likes: true,
                comments: {
                    include: {
                        author: true,
                        likes: true,
                    }
                },
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

    async editPost(postWhereUniqueInput: Prisma.PostWhereUniqueInput, postUpdateInput: Prisma.PostUpdateInput) {
        try {
            console.log(1)
            await prisma.post.update({
                where: postWhereUniqueInput,
                data: postUpdateInput
            })
            console.log(2)
        } catch (err) {
            Logger.warn('postService[editPost]: ' + err)
            return
        }

        return this.getPost({ id: postWhereUniqueInput.id })
    },

    async getAllPosts() {
        return await prisma.post.findMany({
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
    async getComment(post_commentWhereUniqueInput: Prisma.Post_commentWhereUniqueInput) {
        return await prisma.post_comment.findUnique({
            where: post_commentWhereUniqueInput,
            include: {
                author: true,
            }
        })
    },

    async editComment(post_commentWhereUniqueInput: Prisma.Post_commentWhereUniqueInput, post_commentUpdateInput: Prisma.Post_commentUpdateInput) {
        await prisma.post_comment.update({
            where: post_commentWhereUniqueInput,
            data: post_commentUpdateInput
        })
        return this.getComment(post_commentWhereUniqueInput)
    }

}
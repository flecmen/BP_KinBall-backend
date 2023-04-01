import { Prisma, PrismaClient, Post } from "@prisma/client";
import Logger from "../../utils/logger";

const prisma = new PrismaClient();

export default {
    async getPost(postWhereUniqueInput: Prisma.PostWhereUniqueInput) {
        return await prisma.post.findUnique({
            where: postWhereUniqueInput,
            include: postIncludes
        })
    },
    async getPaginatedPosts(skip: number, limit: number) {
        try {
            const posts = await prisma.post.findMany({
                skip,
                take: limit,
                orderBy: { time_of_creation: 'desc' },
                include: postIncludes,
            });
            return posts;
        } catch (e) {
            Logger.error(`post-service.getPaginatedPosts: ${e}`)
        }
        return;
    },

    async createPost(data: Prisma.PostCreateInput) {
        const new_post = await prisma.post.create({
            data,
        });
        return this.getPost({ id: new_post.id })
    },

    async editPost(postWhereUniqueInput: Prisma.PostWhereUniqueInput, postUpdateInput: Prisma.PostUpdateInput) {
        try {
            await prisma.post.update({
                where: postWhereUniqueInput,
                data: postUpdateInput
            })
        } catch (err) {
            Logger.warn('postService[editPost]: ' + err)
            return
        }

        return this.getPost({ id: postWhereUniqueInput.id })
    },

    async getAllPosts() {
        return await prisma.post.findMany({
            include: postIncludes
        })
    },

    async deletePost(postWhereUniqueInput: Prisma.PostWhereUniqueInput) {
        try {
            return await prisma.post.delete({
                where: postWhereUniqueInput
            })
        } catch (e) {
            Logger.error(`post-service.deletePost: ${e}`)
        }
    },
}

const postIncludes = {
    author: {
        include: {
            profile_picture: true,
            groups: true,
        }
    },
    groups: true,
    event: {
        include: {
            organiser: {
                include: {
                    profile_picture: true,
                    groups: true,
                }
            },
            players: {
                include: {
                    user: {
                        include: {
                            profile_picture: true,
                        }
                    },
                }
            },
            teams: true,
        }
    },
    images: true,
    likes: true,
    comments: {
        include: {
            author: true,
            likes: true,
        }
    },
    survey_options: {
        include: {
            votes: true,
        }
    },
    user_notification: true
}
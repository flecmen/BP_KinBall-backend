import { Prisma, PrismaClient, Post } from "@prisma/client";
import Logger from "../utils/logger";
import { postIncludes } from "../types/queryIncludes";

const prisma = new PrismaClient();

export default {
    async getPost(postWhereUniqueInput: Prisma.PostWhereUniqueInput) {
        try {
            return await prisma.post.findUnique({
                where: postWhereUniqueInput,
                include: postIncludes
            })
        } catch (e) {
            Logger.error(`post-service.getPost: ${e}`)
        }
    },
    async getMultiplePosts(idArray: Post['id'][]) {
        try {
            return await prisma.post.findMany({
                where: { id: { in: idArray } },
                include: postIncludes,
            });
        } catch (e) {
            Logger.error(`post-service.getMultiplePosts: ${e}`)
        }
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
        try {
            return await prisma.post.create({
                data,
                include: postIncludes
            });
        } catch (e) {
            Logger.error(`post-service.createPost: ${e}`)
        }
    },

    async editPost(postWhereUniqueInput: Prisma.PostWhereUniqueInput, postUpdateInput: Prisma.PostUpdateInput) {
        try {
            return await prisma.post.update({
                where: postWhereUniqueInput,
                data: postUpdateInput,
                include: postIncludes
            })
        } catch (err) {
            Logger.warn('postService[editPost]: ' + err)
            return
        }
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


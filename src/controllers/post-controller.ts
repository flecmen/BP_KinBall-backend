import { Request, Response } from "express"
import postService from "../services/post-service";
import userService from "../services/user-service";
import commentService from "../services/comment-service";
import rewardService from '../services/reward-service';
import { postType, Group, User, role } from '@prisma/client';
import Logger from "../utils/logger";
import groupCheck from "../helpers/group-check";
import { UnauthorizedError } from "express-jwt";




export default {
    getPost: async (req: Request, res: Response) => {
        const postId = parseInt(req.params.postId);

        // get the post
        const post = await postService.getPost({ id: postId });

        // check if post and req.user.group have a group in common
        const user = req.user as User & { groups: Group[] };
        if (!groupCheck(post?.groups, user.groups))
            return res.status(403).json({ error: 'Forbidden' })

        res.status(200).json(post)
    },

    // example params : { idArray: [1,2,3,4,5]}
    getMultiplePosts: async (req: Request, res: Response) => {
        // Parse post ids from query
        if (req.query.idArray === undefined)
            return res.status(400).json({ error: 'Missing idArray' })

        const postIds = (req.query.idArray as string).split(',').map((postId: string) => parseInt(postId));
        const user = req.user as User & { groups: Group[] };
        const posts = await postService.getMultiplePosts(postIds);

        // return only posts that have a group in common with the user
        posts?.forEach(
            post => {
                if (!groupCheck(post.groups, user.groups))
                    posts.splice(posts.indexOf(post), 1)
            }
        )

        if (posts?.length === 0) return res.status(400).json({ error: 'Failed to load posts' })
        res.status(200).json(posts)
    },

    //Group filtered
    getPaginatedPosts: async (req: Request, res: Response) => {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        // Get user groups, to filter posts by them
        const user = req.user as User & { groups: Group[] };

        const posts = await postService.getPaginatedPosts(skip, limit, {
            groups: { some: { id: { in: user.groups.map(group => group.id) } } }
        });
        if (posts === undefined) {
            return res.status(400).json({
                error: `Failed to load posts`
            });
        }
        if (posts.length === 0) {
            return res.status(204).json({ message: 'No more posts available' });
        }
        res.status(200).json(posts)
    },

    createPost: async (req: Request, res: Response) => {
        let post = req.body;

        // Check if mandatory fields are present
        if (!post.author || !post.heading || !post.type) {
            return res.status(400).json({
                error: `Missing or falsy mandatory fields: ${post}`
            });
        }
        if (!post.groups || post.groups.length === 0) {
            res.status(400).json({
                error: `Missing groups`
            });
            return;
        }
        if (post.type === postType.survey && (!post.survey_options || post.survey_options.length === 0)) {
            res.status(400).json({
                error: 'Missing survey options'
            });
            return;
        }

        //Připojení existujících skupin
        post.groups = {
            connect: post.groups.map(({ id }: { id: number }) => ({ id }))
        }
        post.author = { connect: { id: post.author.id } }
        //přidání fotek
        if (post.images) {
            post.images = { createOrConnect: post.images }
        }
        //vytvoření survey options
        if (post.type === postType.survey) {
            post.survey_options = {
                create: post.survey_options
            }
        }
        // smazání survey options pokud nejde o anketu
        if (post.type !== postType.survey) {
            delete post.survey_options
        }

        const new_post = await postService.createPost(post);
        if (!new_post) {
            res.status(400).json({
                error: `Post could not be created`
            });
            return;
        }

        res.status(201).json(new_post)
    },

    editPost: async (req: Request, res: Response) => {
        const postId = parseInt(req.params.postId);
        const post = req.body;

        // We dont edit these here
        delete post.author
        delete post.likes
        delete post.comments

        post.groups = { set: [], connect: post.groups.map(({ id }: { id: number }) => ({ id })) }
        if (post.event) {
            post.event = { update: post.event }
        } else {
            delete post.event
        }
        if (post.images) {
            post.images = { connectOrCreate: post.images }
        }

        if (post.survey_options) {
            post.survey_options = { connectOrCreate: post.survey_options }
        }
        post.user_notification = { connectOrCreate: post.user_notification }

        if (!post) {
            res.status(400).json({ error: 'something is missing' })
            return;
        }
        const new_post = await postService.editPost({ id: postId }, post);
        if (!new_post) return res.status(400).json({ error: `Post could not be edited` });

        res.status(202).json(new_post)
    },
    deletePost: async (req: Request, res: Response) => {
        const postId = parseInt(req.params.postId);
        await postService.deletePost({ id: postId });
        res.status(204).json({
            message: `Post deleted`
        })
    },
    likePost: async (req: Request, res: Response) => {
        const postId = parseInt(req.params.postId);
        const userId = parseInt(req.params.userId);
        const post = await postService.editPost({ id: postId }, { likes: { connect: { id: userId } } })

        // Give reaction reward
        await rewardService.addlikeReward(userId);

        res.status(201).json(post)
    },
    deleteLikePost: async (req: Request, res: Response) => {
        const postId = parseInt(req.params.postId);
        const userId = parseInt(req.params.userId);

        // Kontrola existence zadaných dat
        const post_check = await postService.getPost({ id: postId })
        const user_check = await userService.getUser({ id: userId })
        if (!post_check || !user_check) {
            return res.status(204).send();
        }
        const post = await postService.editPost({ id: postId }, { likes: { disconnect: { id: userId } } })

        // Remove reaction reward
        await rewardService.removeLikeReward(userId);

        res.status(204).json(post)

        return
    },
    commentPost: async (req: Request, res: Response) => {
        const postId = parseInt(req.params.postId);
        const userId = parseInt(req.params.userId);
        const commentText = req.body.text;
        // Kontrola vstupů
        if (!commentText) {
            res.status(404).json({ message: "Invalid input" });
            Logger.warn('Comment text was not provided')
            return;
        }
        // Kontrola existence zadaných dat
        const user = await userService.getUser({ id: userId })
        const post = await postService.getPost({ id: postId })
        if (!user || !post) {
            res.status(404).json({ message: "Invalid input" });
            return;
        }
        const comment = await commentService.createComment({
            author: {
                connect: { id: userId }
            },
            post: {
                connect: { id: postId }
            },
            text: commentText
        })

        // Give comment reward
        await rewardService.addCommentReward(userId);

        res.status(201).json(comment)
        return;
    },
    deleteCommentPost: async (req: Request, res: Response) => {
        const postId = parseInt(req.params.postId);
        const commentId = parseInt(req.params.commentId);

        // Kontrola existence zadaných dat
        const post_check = await postService.getPost({ id: postId })
        const comment = await commentService.getComment({ id: commentId })
        if (!post_check || !comment) {
            res.status(204).json({ message: "Objects don't exist" });
            return;
        }

        // komentář může mazat jen autor nebo admin
        const user = req.user as User;
        if (comment.author.id !== user.id && user.role !== role.admin) res.status(403).json({ message: "Forbidden" });

        await postService.editPost({ id: postId },
            {
                comments: { delete: [{ id: commentId }] }
            }
        )

        // Remove comment reward
        await rewardService.removeCommentReward(comment.author.id);

        res.status(204).json({ message: "Objects don't exist" })
    },
    likeComment: async (req: Request, res: Response) => {
        const postId = parseInt(req.params.postId);
        const commentId = parseInt(req.params.commentId);
        const userId = parseInt(req.params.userId);

        const comment = await commentService.editComment({ id: commentId }, { likes: { connect: { id: userId } } })
        res.status(201).json(comment)
    },
    deleteLikeComment: async (req: Request, res: Response) => {
        const postId = parseInt(req.params.postId);
        const commentId = parseInt(req.params.commentId);
        const userId = parseInt(req.params.userId);

        await commentService.editComment({ id: commentId }, { likes: { disconnect: { id: userId } } })
        res.status(204).send();
    },
    changeSurveyOptionValue: async (req: Request, res: Response) => {
        const postId = parseInt(req.params.postId);
        const userId = parseInt(req.params.userId);
        const surveyOptionId = parseInt(req.params.survey_optionId);
        const boolValue: boolean = JSON.parse(req.params.boolValue);

        // User volbu zvolil
        if (boolValue) {
            await postService.editPost({ id: postId }, {
                survey_options: { update: { where: { id: surveyOptionId }, data: { votes: { connect: { id: userId } } } } }
            })
        } else {// User volbu zrušil
            await postService.editPost({ id: postId }, {
                survey_options: { update: { where: { id: surveyOptionId }, data: { votes: { disconnect: { id: userId } } } } }
            })
        }
        res.status(200).send();
    },

}
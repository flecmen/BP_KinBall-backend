import { Request, Response } from "express"
import postService from "../services/post-service";
import { Post, Post_comment, postType } from '@prisma/client';
import Logger from "../utils/logger";

// function isTruthy(post: Post): boolean {
//     const mandatoryFields = ['type', 'heading', 'authorId'];
//     const missingFields = mandatoryFields.filter(field => !post[field] && post[field] !== undefined && post[field] !== null);
//     if (missingFields.length > 0) {
//         Logger.warn(`Missing or falsy mandatory fields: ${missingFields.join(', ')}`)
//         return false
//     } else return true;
// }

export default {
    getPost: async (req: Request, res: Response) => {
        const postId = parseInt(req.params.postId);
        const post = await postService.getPost({ id: postId });
        res.status(200).json(post)
    },

    getAllPosts: async (req: Request, res: Response) => {
        const posts = await postService.getAllPosts();
        res.status(202).json(posts)
    },



    createPost: async (req: Request, res: Response) => {
        let post = req.body;

        // Check if mandatory fields are present and truthy
        //TODO: check the input of post
        if (post) {
            res.status(400).json({
                error: `Missing or falsy mandatory fields`
            });
        }

        //Připojení existujících skupin
        post.groups = { connect: post.groups }
        //přidání fotek
        if (post.images) {
            post.images = { createOrConnect: post.images }
        }
        //vytvoření survey options
        if (post.postType === postType.survey) {
            post.survey_options = { create: post.survey_options }
        }
        //Vytvoření eventu, pokud má existovat
        if (post.event) {
            post.event = { create: post.event }
        }

        const new_post = await postService.createPost(post);
        res.status(201).json(new_post)
    },

    editPost: async (req: Request, res: Response) => {
        const postId = parseInt(req.params.postId);
        const post = req.body;
        //TODO: check the input of post
        if (post) {
            res.status(400).send('something is missing')
            return;
        }
        const new_post = await postService.editPost({ id: postId }, post);
        res.status(202).json(new_post)
    },
    likePost: async (req: Request, res: Response) => {
        const postId = parseInt(req.params.postId);
        const userId = parseInt(req.params.userId);
        const post = await postService.editPost({ id: postId }, { likes: { connect: { id: userId } } })
        res.status(201).json(post)
    },
    deleteLikePost: async (req: Request, res: Response) => {
        const postId = parseInt(req.params.postId);
        const userId = parseInt(req.params.userId);
        const post = await postService.editPost({ id: postId }, { likes: { disconnect: { id: userId } } })
        res.status(204).json(post)
    },
    commentPost: async (req: Request, res: Response) => {
        const postId = parseInt(req.params.postId);
        const userId = parseInt(req.params.userId);
        const comment: Post_comment = req.body;
        const post = await postService.editPost({ id: postId },
            {
                comments: {
                    create: [
                        {
                            text: comment.text,
                            author: {
                                connect: {
                                    id: userId,
                                },
                            },
                        },
                    ],
                },
            })
        res.status(201).json(post)
    },
    deleteCommentPost: async (req: Request, res: Response) => {
        const postId = parseInt(req.params.postId);
        const commentId = parseInt(req.params.commentId);
        await postService.editPost({ id: postId },
            {
                comments: {
                    delete: [
                        {
                            id: commentId
                        }
                    ]
                }
            })
        res.status(204)
    },
    likeComment: async (req: Request, res: Response) => {
        const postId = parseInt(req.params.postId);
        const commentId = parseInt(req.params.commentId);
        const userId = parseInt(req.params.userId);
        const comment = await postService.editComment({ id: commentId }, { likes: { connect: { id: userId } } })
        res.status(201).json(comment)
    },
    deleteLikeComment: async (req: Request, res: Response) => {
        const postId = parseInt(req.params.postId);
        const commentId = parseInt(req.params.commentId);
        const userId = parseInt(req.params.userId);
        await postService.editComment({ id: commentId }, { likes: { delete: { id: userId } } })
        res.status(204)
    },


}
import { check } from 'express-validator';
import express from "express";
import postController from "../controllers/post-controller";
import { validateRequestSchema } from "../middleware/validateRequestSchema";
import checkParameters from '../helpers/parametersSchema';

const router = express.Router();

// Get post by Id
router.get('/:postId', checkParameters, validateRequestSchema, postController.getPost)

// Get posts 
// dev only
router.get('/', postController.getAllPosts)

//Create post
router.put('/', postController.createPost)
//Edit post
router.put('/:postId', checkParameters, validateRequestSchema, postController.editPost)

//Interact with post
// Create like post
router.post('/:postId/like/:userId', checkParameters, validateRequestSchema, postController.likePost)
// Delete like post
router.delete('/:postId/like/:userId', checkParameters, validateRequestSchema, postController.deleteLikePost)
// Create comment on Post
router.post('/:postId/comment/:userId', checkParameters, validateRequestSchema, postController.commentPost)
// Delete comment on a Post
router.delete('/:postId/comment/:commentId', checkParameters, validateRequestSchema, postController.deleteCommentPost)
// Like a comment
router.post('/:postId/comment/:commentId/like/:userId', checkParameters, validateRequestSchema, postController.likeComment)
// Delete comment like
router.delete('/:postId/comment/:commentId/like/:userId', checkParameters, validateRequestSchema, postController.deleteLikeComment)



export default router;
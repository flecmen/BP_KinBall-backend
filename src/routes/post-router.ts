import express from "express";
import { check } from 'express-validator';
import postController from "../controllers/post-controller";
import checkParameters from '../helpers/parametersSchema';
import { validateRequestSchema } from "../middleware/validateRequestSchema";
import { authorizePostAuthor } from './../middleware/authorize';

const router = express.Router();


// Get paginated posts 
router.get('/', postController.getPaginatedPosts)

//Create post
router.post('/', postController.createPost)

// Get post by Id
router.get('/:postId', checkParameters, validateRequestSchema, postController.getPost)

// ONLY AUTHOR OR ADMIN CAN EDIT OR DELETE POST (authorizePostAuthor middleware)
//Edit post
router.put('/:postId', checkParameters, validateRequestSchema, authorizePostAuthor, postController.editPost)

//Delete post
router.delete('/:postId', checkParameters, validateRequestSchema, authorizePostAuthor, postController.deletePost)

// GET multiple posts by Ids
router.get('/multiple', checkParameters, validateRequestSchema, postController.getMultiplePosts)

/*
 *Interact with post
 */

// Create like post
// TODO předělat na PUT ?
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

// surveys
// change the value of user vote for survey option. :value = boolean, "true"/"false"
router.post('/:postId/survey/:survey_optionId/user/:userId/:boolValue', checkParameters, validateRequestSchema, postController.changeSurveyOptionValue)



export default router;
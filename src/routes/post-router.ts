import { check } from 'express-validator';
import express from "express";
import postController from "../controllers/post-controller";
import { validateRequestSchema } from "../middleware/validateRequestSchema";
import checkParameters from '../helpers/parametersSchema';

const router = express.Router();


// GET multiple posts by Ids
router.get('/multiple', checkParameters, validateRequestSchema, postController.getMultiplePosts)
// Get post by Id
router.get('/:postId', checkParameters, validateRequestSchema, postController.getPost)

// Get paginated posts 
router.get('/', postController.getPaginatedPosts)

//Create post
router.post('/', postController.createPost)
//Edit post
router.put('/:postId', checkParameters, validateRequestSchema, postController.editPost)
//Delete post
router.delete('/:postId', checkParameters, validateRequestSchema, postController.deletePost)

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

// surveys
// change the value of user vote for survey option. :value = boolean, "true"/"false"
router.post('/:postId/survey/:survey_optionId/user/:userId/:boolValue', checkParameters, validateRequestSchema, postController.changeSurveyOptionValue)



export default router;
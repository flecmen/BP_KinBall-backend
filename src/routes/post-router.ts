import express from "express";
import postController from "../controllers/post-controller";

const router = express.Router();

// Get post by Id
router.get('/:postId', postController.getPost)

// Get posts 
// testing only
router.get('/', postController.getAllPosts)

//Create post
router.put('/', postController.createPost)
//Edit post
router.put('/:postId', postController.editPost)

//Interact with post
// Create like post
router.post('/:postId/like/:userId')
// Delete like post
router.delete('/:postId/like/:userId')
// Create comment on Post
router.post('/:postId/comment/:userId')
// Delete comment on a Post
router.delete('/:postId/comment/:commentId')
// Like a comment
router.post('/:postId/comment/:commentId/like/:userId')
// Delete comment like
router.delete('/:postId/comment/:commentId/like/:userId')



export default router;
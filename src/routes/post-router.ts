import express from "express";
import postController from "../controllers/post-controller";

const router = express.Router();

// Get post by Id
router.get('/:postId', postController.getPost)

// Get posts 
// dev only
router.get('/', postController.getAllPosts)

//Create post
router.put('/', postController.createPost)
//Edit post
router.put('/:postId', postController.editPost)

//Interact with post
// Create like post
router.post('/:postId/like/:userId', postController.likePost)
// Delete like post
router.delete('/:postId/like/:userId', postController.deleteLikePost)
// Create comment on Post
router.post('/:postId/comment/:userId', postController.commentPost)
// Delete comment on a Post
router.delete('/:postId/comment/:commentId', postController.deleteCommentPost),
    // Like a comment
    router.post('/:postId/comment/:commentId/like/:userId', postController.likeComment)
// Delete comment like
router.delete('/:postId/comment/:commentId/like/:userId', postController.deleteLikeComment)



export default router;
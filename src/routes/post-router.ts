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


export default router;
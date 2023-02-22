import express from "express";
import postController from "../controllers/post-controller";

const router = express.Router();


router.get('/:postId', postController.getPost)

//Create post
router.put('/', postController.createPost)
//Edit post
router.put('/:postId', postController.editPost)


export default router;
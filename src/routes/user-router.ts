import express from "express";
import userController from "../controllers/user-controller";

const router = express.Router();

/**
 * @swagger
 */
router.get('/', userController.getAllUsers)
router.get('/:userId', userController.getUser)

//Create user


export default router;
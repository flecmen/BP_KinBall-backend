import express from "express";
import userController from "../controllers/user-controller";
import jwtVerify from '../middleware/jwtVerify'
import { validateRequestSchema } from "../middleware/validateRequestSchema";
import checkParameters from '../helpers/parametersSchema';

const router = express.Router();

// GET all users
router.get('/', userController.getAllUsers)
// GET user by ID
router.get('/:userId', checkParameters, validateRequestSchema, userController.getUser)

//Create user
router.post('/', userController.createUser)

//edit user
router.put('/:userId', checkParameters, validateRequestSchema, userController.updateUser)

//change user password
router.put('/changePassword/:userId', checkParameters, validateRequestSchema, userController.changePassword) // to be tested

//delete user
//TODO: zkontrolovat -> admin || user sobě
router.delete('/:userId', checkParameters, validateRequestSchema, userController.deleteUser)

export default router;

import express from "express";
import userController from "../controllers/user-controller";
import { validateRequestSchema } from "../middleware/validateRequestSchema";
import checkParameters from '../helpers/parametersSchema';
import { authorizeRole, authorizeUserAdminTrener, userOnly } from "../middleware/authorize";
import { role } from "@prisma/client";

const router = express.Router();

// GET all users
router.get('/', authorizeRole([role.coach]), userController.getAllUsers)
// GET user by ID
router.get('/:userId', checkParameters, validateRequestSchema, userController.getUser)

//Create user
router.post('/', authorizeRole([role.coach]), userController.createUser)

//edit user
// only user, admin and trener can edit user
router.put('/:userId', checkParameters, validateRequestSchema, authorizeUserAdminTrener, userController.updateUser)

//change user password
// only user himself can change his password
router.put('/changePassword/:userId', checkParameters, validateRequestSchema, userOnly, userController.changePassword) // to be tested

//delete user
// only user, admin and trener can delete user
router.delete('/:userId', checkParameters, validateRequestSchema, authorizeUserAdminTrener, userController.deleteUser)

export default router;

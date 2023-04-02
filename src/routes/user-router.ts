import express from "express";
import userController from "../controllers/user-controller";
import jwtVerify from '../middleware/jwtVerify'
import { validateRequestSchema } from "../middleware/validateRequestSchema";
import checkParameters from '../helpers/parametersSchema';

const router = express.Router();

/**
 * @swagger
 * /user:
 *  get:
 *   description: Use to request all users
 *   responses:
 *    200: 
 *     description: A successful response
 */
router.get('/', userController.getAllUsers)

/**
 * @swagger
 * /user/{userId}:
 *  get:
 *   description: Use to request a single user by id
 *   parameters:
 *   - in: path
 *     name: userId
 *     schema:
 *      type: number
 *     required: true
 *     description: Numeric id of the user to get
 *   responseBody:
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *        id: number
 *   responses:
 *    200: 
 *     description: A successful response
 */
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

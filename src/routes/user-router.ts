import express from "express";
import userController from "../controllers/user-controller";
import jwtVerify from '../middleware/jwtVerify'

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
router.get('/:userId', userController.getUser)

//Create user
router.put('/', userController.createUser)

//edit user
//TODO: editovat zde i věci jako nastavení, přidání do groupy, nebo pro ně vytvořit vlastní endpoint?
router.put('/:userId', userController.updateUser)

//delete user
//TODO: zkontrolovat -> admin || user sobě
router.delete('/:userId', userController.deleteUser)

export default router;

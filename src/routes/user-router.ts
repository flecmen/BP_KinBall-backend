import express from "express";
import userController from "../controllers/user-controller";

const router = express.Router();

/**
 * @swagger
 * /user:
 *  get:
 *   description: Use to request all users
 *   responses:
 *    200: 
 *     description: A successful response
 *    schema:
 *     $ref: '#components/schemas/User'
 */
router.get('/', userController.getAllUsers)
router.get('/:userId', userController.getUser)

//Create user
router.put('/', userController.createUser)

//edit user
//TODO: editovat zde i věci jako nastavení, přidání do groupy, nebo pro ně vytvořit vlastní endpoint?
router.put('/:userId', userController.updateUser)

//delete user
//TODO: zkontrolovat -> admin || user sám
router.delete('/:userId', userController.deleteUser)

export default router;
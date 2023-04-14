import express from 'express';
import authController from '../controllers/auth-controller';
import { validateRequestSchema } from "../middleware/validateRequestSchema";
import checkParameters from '../helpers/parametersSchema';

const router = express.Router();

//login
router.post('/login', authController.login)

//Check email availability
router.get('/checkEmail/:email', checkParameters, validateRequestSchema, authController.checkEmailAvailability)

//Register user
router.post('/register', authController.register)



export default router;
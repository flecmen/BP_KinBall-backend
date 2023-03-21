import express from 'express';
import authController from '../controllers/auth-controller';

const router = express.Router();

//POST
router.post('/login', authController.login)


export default router;
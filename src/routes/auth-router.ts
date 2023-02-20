import express from 'express';
import authController from '../controllers/auth-controller';

const router = express.Router();

//POST
router.post('/login', authController.login)

//TODO: endpointy pro hlídání a obnovení životnosti tokenů

export default router;
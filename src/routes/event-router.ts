import express from 'express';
import eventController from '../controllers/event-controller';
import { validateRequestSchema } from "../middleware/validateRequestSchema";
import checkParameters from '../helpers/parametersSchema';

const router = express.Router();


router.get('/:eventId', checkParameters, validateRequestSchema, eventController.getEvent)


export default router;
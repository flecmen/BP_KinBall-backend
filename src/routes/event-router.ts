import express from 'express';
import eventController from '../controllers/event-controller';
import { validateRequestSchema } from "../middleware/validateRequestSchema";
import checkParameters from '../helpers/parametersSchema';

const router = express.Router();



// GET multiple posts by Ids
router.get('/multiple', checkParameters, validateRequestSchema)
// Get event by Id
router.get('/:eventId', checkParameters, validateRequestSchema, eventController.getEvent);
// Create event
router.post('/', eventController.createEvent);
// Delete event
router.delete('/:eventId', checkParameters, validateRequestSchema, eventController.deleteEvent);
// change user vote (going, don't know, not going)
router.post('/:eventId/user/:userId/status/:userOnEventStatus/:boolValue', checkParameters, validateRequestSchema, eventController.changeUserOnEventStatus);


export default router;
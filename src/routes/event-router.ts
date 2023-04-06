import express from 'express';
import eventController from '../controllers/event-controller';
import { validateRequestSchema } from "../middleware/validateRequestSchema";
import checkParameters from '../helpers/parametersSchema';

const router = express.Router();


//GET paginated events
router.get('/', eventController.getPaginatedCurrentEvents)
// GET multiple events by Ids
router.get('/multiple', checkParameters, validateRequestSchema, eventController.getMultipleEvents)
// GET multiple events by posIds
router.get('/multiple/byPostIds', checkParameters, validateRequestSchema, eventController.getMultipleEventsByPostIds)
// GET event by organiser 
router.get('/organiser/:userId', checkParameters, validateRequestSchema, eventController.getEventsByOrganiser)
// Get event by Id
router.get('/:eventId', checkParameters, validateRequestSchema, eventController.getEvent);
// Create event
router.post('/', eventController.createEvent);
// Delete event
router.delete('/:eventId', checkParameters, validateRequestSchema, eventController.deleteEvent);
// Edit event
router.put('/:eventId', checkParameters, validateRequestSchema, eventController.editEvent);
// change user vote (going, don't know, not going)
router.post('/:eventId/user/:userId/status/:userOnEventStatus/:boolValue', checkParameters, validateRequestSchema, eventController.changeUserOnEventStatus);


export default router;
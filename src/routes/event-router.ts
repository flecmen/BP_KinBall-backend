import { authorizeRole, authorizeEventAuthor } from './../middleware/authorize';
import express from 'express';
import eventController from '../controllers/event-controller';
import { validateRequestSchema } from "../middleware/validateRequestSchema";
import checkParameters from '../helpers/parametersSchema';
import { role } from '@prisma/client';

const router = express.Router();


//GET paginated events
router.get('/', eventController.getPaginatedCurrentEvents)
// GET multiple events by Ids
router.get('/multiple/:idArray', checkParameters, validateRequestSchema, eventController.getMultipleEvents) // TEST
// GET multiple events by posIds
router.get('/multiple/byPostIds/:idArray', checkParameters, validateRequestSchema, eventController.getMultipleEventsByPostIds) // TEST
// GET events by organiser 
// filter: today, future, past
router.get('/organiser/:userId/:filter', authorizeRole([role.trener]), checkParameters, validateRequestSchema, eventController.getEventsByOrganiser)
// Get event by Id
router.get('/:eventId', checkParameters, validateRequestSchema, eventController.getEvent);
// Create event
router.post('/', authorizeRole([role.trener]), eventController.createEvent);
// Delete event
router.delete('/:eventId', authorizeRole([role.trener]), authorizeEventAuthor, checkParameters, validateRequestSchema, eventController.deleteEvent);
// Edit event
router.put('/:eventId', authorizeRole([role.trener]), authorizeEventAuthor, checkParameters, validateRequestSchema, eventController.editEvent);
// change user vote (going, don't know, not going)
router.post('/:eventId/user/:userId/status/:userOnEventStatus/:boolValue', checkParameters, validateRequestSchema, eventController.changeUserOnEventStatus);
// do the attendance
router.post('/:eventId/attendance', authorizeRole([role.trener]), authorizeEventAuthor, checkParameters, validateRequestSchema, eventController.changeUserAttendance);


export default router;
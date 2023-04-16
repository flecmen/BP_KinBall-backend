import { authorizeRole, authorizeEventAuthor } from './../middleware/authorize';
import express from 'express';
import eventController from '../controllers/event-controller';
import { validateRequestSchema } from "../middleware/validateRequestSchema";
import checkParameters from '../helpers/parametersSchema';
import { role } from '@prisma/client';

const router = express.Router();



// GET multiple events by Ids
router.get('/multiple', checkParameters, validateRequestSchema, eventController.getMultipleEvents)
// GET multiple events by posIds
router.get('/multiple/byPostIds', checkParameters, validateRequestSchema, eventController.getMultipleEventsByPostIds)
// GET events by organiser 
// filter: today, future, past
router.get('/organiser/:userId/:filter', authorizeRole([role.coach]), checkParameters, validateRequestSchema, eventController.getEventsByOrganiser)
// Get event by Id
router.get('/id/:eventId', checkParameters, validateRequestSchema, eventController.getEvent);
//GET paginated events
router.get('/', eventController.getPaginatedCurrentEvents)
// Create event
router.post('/', authorizeRole([role.coach]), eventController.createEvent);
// Delete event
router.delete('/:eventId', authorizeRole([role.coach]), authorizeEventAuthor, checkParameters, validateRequestSchema, eventController.deleteEvent);
// Edit event
router.put('/:eventId', authorizeRole([role.coach]), authorizeEventAuthor, checkParameters, validateRequestSchema, eventController.editEvent);
// change user vote (going, don't know, not going)
router.post('/:eventId/user/:userId/status/:userOnEventStatus/:boolValue', checkParameters, validateRequestSchema, eventController.changeUserOnEventStatus);
// do the attendance
router.post('/:eventId/attendance', authorizeRole([role.coach]), authorizeEventAuthor, checkParameters, validateRequestSchema, eventController.changeUserAttendance);


export default router;
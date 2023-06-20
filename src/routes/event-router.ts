import { role } from '@prisma/client';
import express from 'express';
import eventController from '../controllers/event-controller';
import checkParameters from '../helpers/parametersSchema';
import { validateRequestSchema } from "../middleware/validateRequestSchema";
import { authorizeEventAuthor, authorizeRole } from './../middleware/authorize';

const router = express.Router();

//GET paginated events
router.get('/', eventController.getPaginatedCurrentEvents)

// Create event
router.post('/', authorizeRole([role.coach]), eventController.createEvent);

// GET multiple events by Ids
router.get('/multiple', checkParameters, validateRequestSchema, eventController.getMultipleEvents)

// GET multiple events by postIds
router.get('/multiple/byPostIds', checkParameters, validateRequestSchema, eventController.getMultipleEventsByPostIds)

// GET events by organiser 
// filter: today, future, past
router.get('/organiser/:userId/:filter', authorizeRole([role.coach]), checkParameters, validateRequestSchema, eventController.getEventsByOrganiser)

// Get event by Id
router.get('/:eventId', checkParameters, validateRequestSchema, eventController.getEvent);

// Edit event
router.put('/:eventId', authorizeRole([role.coach]), authorizeEventAuthor, checkParameters, validateRequestSchema, eventController.editEvent);

// Delete event
router.delete('/:eventId', authorizeRole([role.coach]), authorizeEventAuthor, checkParameters, validateRequestSchema, eventController.deleteEvent);

// change user reaction (going, don't know, not going)
router.post('/:eventId/user/:userId/status/:userOnEventStatus/:boolValue', checkParameters, validateRequestSchema, eventController.changeUserOnEventStatus);

// do the attendance
router.post('/:eventId/attendance', authorizeRole([role.coach]), authorizeEventAuthor, checkParameters, validateRequestSchema, eventController.changeUserAttendance);


export default router;
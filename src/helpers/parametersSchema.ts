import { check, param } from 'express-validator'
// Middleware to check inputs
const checkInputs = [
    param('postId').optional().isNumeric().withMessage('Post ID must be a number'),
    param('commentId').optional().isNumeric().withMessage('Comment ID must be a number'),
    param('userId').optional().isNumeric().withMessage('User ID must be a number'),
    param('eventId').optional().isNumeric().withMessage('Event ID must be a number'),
    param('survey_optionId').optional().isNumeric().withMessage('Survey_option ID must be a number'),

];

export default checkInputs
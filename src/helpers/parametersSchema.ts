import { param, query } from 'express-validator'
// Middleware to check inputs
const checkInputs = [
    param('postId').isNumeric().withMessage('Post ID must be a number').optional(),
    param('commentId').isNumeric().withMessage('Comment ID must be a number').optional(),
    param('userId').isNumeric().withMessage('User ID must be a number').optional(),
    param('eventId').isNumeric().withMessage('Event ID must be a number').optional(),
    param('groupId').isNumeric().withMessage('Group ID must be a number').optional(),
    param('survey_optionId').isNumeric().withMessage('Survey_option ID must be a number').optional(),
    param('boolValue').isBoolean().withMessage('Invalid boolValue value').optional(),
    param('filename').notEmpty().withMessage('Filename cannot be empty').optional(),
    query('idArray.*').isNumeric().withMessage('Id elements in array must be numbers').optional(),

];

export default checkInputs
import express from "express";
import groupController from "../controllers/group-controller";
import { validateRequestSchema } from "../middleware/validateRequestSchema";
import checkParameters from '../helpers/parametersSchema';

const router = express.Router();


router.get('/:group', checkParameters, validateRequestSchema, groupController.getGroup)

//Create group
router.post('/', groupController.createGroup)
//Edit group
router.put('/:groupId', checkParameters, validateRequestSchema, groupController.updateGroup)
//Delete group
router.delete('/:groupId', checkParameters, validateRequestSchema, groupController.deleteGroup)


export default router;
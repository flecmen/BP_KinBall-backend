import express from "express";
import groupController from "../controllers/group-controller";
import { validateRequestSchema } from "../middleware/validateRequestSchema";
import checkParameters from '../helpers/parametersSchema';
import { authorizeRole } from "../middleware/authorize";
import { role } from "@prisma/client";

const router = express.Router();

// Get group by id
router.get('/:group', checkParameters, validateRequestSchema, groupController.getGroup)
// GET all groups
router.get('/', groupController.getAllGroups)
//Create group
router.post('/', groupController.createGroup)
//Edit group
router.put('/:groupId', checkParameters, validateRequestSchema, authorizeRole([role.trener]), groupController.updateGroup)
//Delete group
router.delete('/:groupId', checkParameters, validateRequestSchema, authorizeRole([role.trener]), groupController.deleteGroup)


export default router;
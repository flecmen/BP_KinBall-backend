import { role } from "@prisma/client";
import express from "express";
import groupController from "../controllers/group-controller";
import checkParameters from '../helpers/parametersSchema';
import { authorizeRole } from "../middleware/authorize";
import { validateRequestSchema } from "../middleware/validateRequestSchema";

const router = express.Router();

// GET all groups
router.get('/', groupController.getAllGroups)

//Create group
router.post('/', authorizeRole([role.coach]), groupController.createGroup)

// Get group by id
router.get('/:group', checkParameters, validateRequestSchema, groupController.getGroup)

//Edit group
router.put('/:groupId', checkParameters, validateRequestSchema, authorizeRole([role.coach]), groupController.updateGroup)

//Delete group
router.delete('/:groupId', checkParameters, validateRequestSchema, authorizeRole([role.coach]), groupController.deleteGroup)


export default router;
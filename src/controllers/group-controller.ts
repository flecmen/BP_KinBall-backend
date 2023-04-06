import { Request, Response } from "express"
import groupService from "../services/group-service";
import { Group } from '@prisma/client';
import Logger from "../utils/logger";

export default {
    getGroup: async (req: Request, res: Response) => {
        const groupId = parseInt(req.params.groupId);
        const group = groupService.getGroup({ id: groupId });
        if (group === undefined) {
            return res.status(400).json({ error: 'group doesn\'t exist' });
        }
        res.status(200).json(group)
    },
    getAllGroups: async (req: Request, res: Response) => {
        const groups = await groupService.getAllGroups();
        if (groups === undefined) {
            return res.status(400).json({ error: 'Failed to load groups' });
        }
        res.status(200).json(groups)
    },
    createGroup: async (req: Request, res: Response) => {
        const group: Group = req.body;
        const result = await groupService.createGroup(group);
        if (result === undefined) {
            return res.status(400).json({ error: 'Failed to create group' });
        }
        res.status(201).json(result)
    },
    updateGroup: async (req: Request, res: Response) => {
        const groupId = parseInt(req.params.groupId);
        const group: Group = req.body;
        const result = await groupService.updateGroup(groupId, group);
        if (result === undefined) {
            return res.status(400).json({ error: 'Failed to update group' });
        }
        res.status(200).json(result)
    },
    deleteGroup: async (req: Request, res: Response) => {
        const groupId = parseInt(req.params.groupId);
        await groupService.deleteGroup(groupId);
        res.status(204).send();
    }
}
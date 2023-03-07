import { Request, Response } from "express"
import groupService from "../services/group-service";
import { Group } from '@prisma/client';
import Logger from "../utils/logger";

export default {
    getGroup: async (req: Request, res: Response) => {
        const groupId = parseInt(req.params.groupId);
        if (isNaN(groupId)) {
            res.status(400).send('groupId is NaN');
            return;
        }
        const group = groupService.getGroup({ id: groupId });
        if (group === null) {
            res.status(404).send('group doesn\'t exist');
            return;
        }
        res.status(202).json(group)
    },
}
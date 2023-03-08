import { Request, Response } from "express"
import { Prisma, User } from "@prisma/client";
import userService from "../services/user-service"
import Logger from "../utils/logger";

export default {
    getAllUsers: async (req: Request, res: Response) => {
        const users = await userService.getAllUsers();
        if (users === null) res.status(500).send('Users could not be found')
        res.json(users);
    },

    getUser: async (req: Request, res: Response) => {
        const userId: User["id"] = parseInt(req.params.userId);
        if (isNaN(userId)) {
            res.status(400).send('UserId is NaN');
            return;
        }
        const user = await userService.getUser({ id: userId });
        if (user === null) {
            res.status(404).send('User doesn\'t exist');
            return;
        }
        res.json(user);
    },

    createUser: async (req: Request, res: Response) => {
        const user = await userService.createUser(req.body)
        // is email taken?
        if (user === null) {
            res.status(403).send("email taken")
            return
        }
        res.status(201).json(user);
    },

    updateUser: async (req: Request, res: Response) => {
        const userId = parseInt(req.params.userId);

        if (isNaN(userId)) {
            res.status(400).send('UserId is NaN');
            return;
        }

        const updatedUser = await userService.updateUser({ id: userId }, req.body)
        res.status(200).json(updatedUser);
    },

    deleteUser: async (req: Request, res: Response) => {
        const userId = parseInt(req.params.userId);
        await userService.deleteUser({ id: userId });
        res.status(204);
    },
}
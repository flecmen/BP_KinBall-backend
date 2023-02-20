import { Request, Response } from "express"
import { User } from "@prisma/client";
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
        const user = await userService.getUser({ id: userId });
        if (user === null) res.status(404)
        res.json(user);
    },
    // příchozí: {user {}: User}
    createUser: async (req: Request, res: Response) => {
        const user = await userService.createUser(req.body.user)
        //Vytvořit settings a reward system
        //přiřadit default profile_picture
        //přidat do defaultní skupniy "všichni"
        res.json(user);
    },

}
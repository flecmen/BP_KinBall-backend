import { Request, Response } from "express"
import { Prisma, User } from "@prisma/client";
import userService from "../services/user-service"
import Logger from "../utils/logger";
import passwordGenerator from 'generate-password';
import authService from "../services/auth-service";
import emailController from "./email-controller";

export default {
    getAllUsers: async (req: Request, res: Response) => {
        const users = await userService.getAllUsers();
        if (!users) res.status(500).send('Users could not be found')
        res.json(users);
    },

    getUser: async (req: Request, res: Response) => {
        const userId = parseInt(req.params.userId);

        const user = await userService.getUser({ id: userId });
        if (!user) {
            res.status(404).send('User doesn\'t exist');
            return;
        }
        res.json(user);
    },
    // Creating user manually, this is NOT REGISTERING!!
    createUser: async (req: Request, res: Response) => {
        let user = req.body;
        const stringPassword = passwordGenerator.generate({
            length: 15,
            numbers: true,
        })
        Logger.debug(stringPassword)
        user.password = authService.hashPassword(stringPassword);
        const new_user = await userService.createUser(user)
        // is email taken?
        if (!new_user) {
            res.status(403).send("email taken")
            return
        }
        // send email with password
        user.password = stringPassword;
        emailController.sendNewAccountEmail(user);
        res.status(201).json(new_user);
    },

    updateUser: async (req: Request, res: Response) => {
        const userId = parseInt(req.params.userId);

        const updatedUser = await userService.updateUser({ id: userId }, req.body)
        res.status(200).json(updatedUser);
    },

    deleteUser: async (req: Request, res: Response) => {
        const userId = parseInt(req.params.userId);
        await userService.deleteUser({ id: userId });
        res.status(204).json({
            message: `User ${userId} deleted`
        });
    },
}
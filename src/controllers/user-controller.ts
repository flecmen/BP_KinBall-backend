import { Request, Response } from "express"
import userService from "../services/user-service"
import passwordGenerator from 'generate-password';
import authUtils from "../utils/auth-utils";
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
        user.password = authUtils.hashPassword(stringPassword);
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
        let user = req.body;

        // delete groups connections and connect new
        if (user.groups)
            user.groups = { set: [], connect: user.groups.map(({ id }: { id: number }) => ({ id })) }
        // we do not update profile_picture here
        delete user.profile_picture;
        // these ids would crash Prisma
        delete user.id;
        delete user.imageId;
        delete user.settings?.userId;
        delete user.reward_system?.userId;

        if (user.settings)
            user.settings = { update: user.settings }
        if (user.reward_system)
            user.reward_system = { update: user.reward_system }

        const updatedUser = await userService.updateUser({ id: userId }, user)
        res.status(200).json(updatedUser);
    },

    deleteUser: async (req: Request, res: Response) => {
        const userId = parseInt(req.params.userId);
        await userService.deleteUser({ id: userId });
        res.status(204).json({
            message: `User ${userId} deleted`
        });
    },
    changePassword: async (req: Request, res: Response) => {
        const userId = parseInt(req.params.userId);
        const password = req.body.password;
        if (!password || password.length < 8) {
            res.status(400).json({ error: 'Password must be at least 8 characters long' });
            return;
        }
        const hashedPassword = authUtils.hashPassword(password);
        const updatedUser = await userService.updateUser({ id: userId }, { password: hashedPassword })
        res.status(200).json(updatedUser);
    },
}
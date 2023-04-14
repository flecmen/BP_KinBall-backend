import { Request, Response } from "express"
import userService from "../services/user-service"
import authUtils from "../utils/auth-utils";
import { User, role } from '@prisma/client';

export default {
    login: async (req: Request, res: Response) => {
        // 1. verify input data, throw 400 if something is missing
        if (
            req.body.email == undefined || req.body.email === '' ||
            req.body.password == undefined || req.body.password === ''
        ) {
            res.status(400).json({ error: 'Something is missing' });
            return;
        }

        // 2. compare the password to the hash stored in the database, throw 401 or 403 if credentials incorrect
        const hashed_pw: String = authUtils.hashPassword(req.body.password)
        const user: User | null = await userService.getUser({ email: req.body.email });

        // kontrola existence uživatele
        if (!user) {
            res.status(401).json({ error: 'Invalid email' });
            return;
        }

        //kontrola hesla
        if (hashed_pw !== user.password) {
            res.status(401).json({ error: 'invalid credentials' })
            return;
        }

        //úspěšné přihlášení
        const response = {
            token: authUtils.generateToken(user),
            user: user
        };

        //Přidat nový čas přihlášení
        await userService.updateUser({ id: user.id }, { last_signed_in: new Date() });

        res.status(202).json(response)
    },

    checkEmailAvailability: async (req: Request, res: Response) => {
        const user: User | null = await userService.getUser({ email: req.params.email });
        if (user) {
            return res.status(200).json({ message: false })
        } else {
            return res.status(200).json({ message: true })
        }
    },

    register: async (req: Request, res: Response) => {
        const user = req.body;
        // check if all fields are filled
        if (!user.full_name || !user.email || !user.password || user.full_name === '' || user.email === '' || user.password === '') {
            res.status(400).json({ error: 'Something is missing' });
            return;
        }
        // Hash password
        const hashed_pw: String = authUtils.hashPassword(user.password)
        user.password = hashed_pw;

        // add to newcommer group
        user.groups = { connect: [{ name: 'newcommers' }] }

        user.role = role.player

        // Create user
        const new_user = await userService.createUser(user)

        if (!new_user) {
            res.status(403).json({ error: "email taken" })
            return
        }
        return res.status(201).json({ message: 'User created' });
    },

}
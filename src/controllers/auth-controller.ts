import { Request, Response } from "express"
import userService from "../services/user-service"
import authUtils from "../utils/auth-utils";
import { User } from '@prisma/client';

export default {
    login: async (req: Request, res: Response) => {
        // 1. verify input data, throw 400 if something is missing
        if (
            req.body.email == undefined || req.body.email === '' ||
            req.body.password == undefined || req.body.password === ''
        ) {
            res.status(400).json('Something is missing');
            return;
        }

        // 2. compare the password to the hash stored in the database, throw 401 or 403 if credentials incorrect
        const hashed_pw: String = authUtils.hashPassword(req.body.password)
        const user: User | null = await userService.getUser({ email: req.body.email });

        // kontrola existence uživatele
        if (!user) {
            res.status(401).json('Invalid email');
            return;
        }

        //kontrola hesla
        if (hashed_pw !== user.password) {
            res.status(401).json('invalid credentials')
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
    }

}
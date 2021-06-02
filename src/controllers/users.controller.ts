import express from "express";
import { User } from "../models/user.entity";
import { getRepository } from "typeorm";
import passport, { PassportLocal } from "../config/passport";


class UsersController {
    userRepository = getRepository(User)
    router = express.Router()
    path: string

    constructor(path: string) {
        this.path = path;
        this.mountRoutes();
    }

    mountRoutes() {
        new PassportLocal();
        this.router.post(`${this.path}/registration`, this.createUser);
        this.router.post(
            `${this.path}/login`,
            passport.authenticate(
                "local",
                { failureRedirect: "/login" }
            ),
            this.login
        );
        this.router.post(`${this.path}/logout`, this.logout);
    }

    createUser = async (req: express.Request, res: express.Response) => {
        const user = await this.userRepository.create(req.body);
        await this.userRepository.save(user);
        res.redirect("/");
    };
    login = (req: express.Request, res: express.Response) => {

        res.redirect("/");
    }
    logout = (req: express.Request, res: express.Response) => {
        req.logout();
        res.redirect("/");
    }
}

export default UsersController;
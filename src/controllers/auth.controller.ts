import express from "express";

class AuthController {
    router = express.Router()

    constructor() {
        this.mountRoutes();
    }

    mountRoutes() {
        this.router.get("/login", this.renderLogin);
        this.router.get("/registration", this.renderRegistration);
    }

    renderLogin = (req: express.Request, res: express.Response) => {
        res.render("login");
    }
    renderRegistration = (req: express.Request, res: express.Response) => {
        res.render("registration");
    }
}

export default AuthController;
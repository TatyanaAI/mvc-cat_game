import "reflect-metadata";
import config from "./config";
import { createConnection } from "typeorm";
import App from "./app";
import CatsController from "./controllers/cats.controller";
import UsersController from "./controllers/users.controller";
import AuthController from "./controllers/auth.controller";

const PORT = 8000;

createConnection(config.db).then(() => {
    const app = new App([
        new CatsController("/"),
        new UsersController("/users"),
        new AuthController()
    ], PORT);
    app.listen();
}).catch(console.log)

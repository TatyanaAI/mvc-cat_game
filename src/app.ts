import express from 'express';
import nunjucks from './config/NunjucksEnv';
import session from 'express-session';
import passport from './config/passport';
import path from 'path';

class App {
    private app: express.Application
    private readonly port: number
    private controllers: any[]

    constructor(controllers: any, port: number) {
        this.app = express();
        this.controllers = controllers;
        this.port = port;

        this.mountMiddleware();
        this.mountControllers();
        this.connectTemplateEngine();
    }

    private mountMiddleware(): void {
        this.app.use(express.urlencoded());
        this.app.use(
            "/static",
            express.static(path.join(__dirname, "../public/static"))
        );
        this.app.use(
            "/uploads",
            express.static(path.join(__dirname, "../public/uploads"))
        );
        this.app.use(session({secret: "foo"}));
        this.app.use(passport.initialize());
        this.app.use(passport.session());
        this.app.use((req, res, next)=> {
            nunjucks.addGlobal("user", req.user);
            next()
        });
    }

    private connectTemplateEngine(): void {
        this.app.engine("njk", nunjucks.render);
        this.app.set("views", path.join(__dirname, "views"));
        this.app.set("view engine", "njk");
        nunjucks.express(this.app);
    }

    private mountControllers(): void {
        this.controllers.forEach(controller => {
            this.app.use("/", controller.router);
        });
    }

    public listen(): void {
    this.app.listen(this.port, ()=> {
        console.log('Server started at ' + this.port + ' port' )
    })
    }
}

export default App;
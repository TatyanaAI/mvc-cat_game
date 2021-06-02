import express from "express";
import { getRepository } from "typeorm";
import { Cat } from "../models/cat.entity";

class CatsController {
    catRepository = getRepository(Cat);
    public router = express.Router();
    path: string;

    constructor(path: string) {
        this.path = path;
        this.mountRoutes();
    }

    mountRoutes(): void {
        this.router.get(this.path, this.getAllCats);
        this.router.get("/cats", this.getAllCats);
        this.router.post("/cats/new", this.createCat);
        this.router.get("/cats/:id", this.getCat);
        this.router.post("/cats/delete/:id", this.deleteCat);
        this.router.post("/cats/actions/:id", this.actionsCat);
    }

    getAllCats = async (
        req: express.Request,
        res: express.Response
    ): Promise<void> => {
        const cats = await this.catRepository.find({ where: { user: req.user }, relations: ["user"] });
        res.render("index", { cats });
    };

    createCat = async (
        req: express.Request,
        res: express.Response
    ): Promise<void> => {
        const user: any = req.user;
        if (user) {
            const cat = new Cat();
            cat.name = req.body.name;
            cat.age = Math.floor(Math.random() * (20 - 1 + 1)) + 1;
            cat.hungerLevel = 50;
            cat.happinessLevel = 50;
            cat.sleeping = false;
            cat.user = user;
            await this.catRepository.create(cat);
            await this.catRepository.save(cat);
        }
        res.redirect("/");
    }

    getCat = async (
        req: express.Request,
        res: express.Response
    ): Promise<void> => {
        const cat = await this.catRepository.findOne({ where: { id: req.params.id, user: req.user }, relations: ["user"] });
        if (cat) {
            return res.render("cats", { cat });
        } else {
            return res.redirect("/");
        }
    };

    actionsCat = async (
        req: express.Request,
        res: express.Response
    ): Promise<void> => {
        if (req.user) {
            const cat = await this.catRepository.findOne({ where: { id: req.params.id, user: req.user }, relations: ["user"] });
            if (cat) {
                switch (req.body.action) {
                    case "feed": { await this.feedCat(req, res, cat); break; }
                    case "play": { await this.playWithCat(req, res, cat); break; }
                    case "sleep": { await this.getSleepCat(req, res, cat); break; }
                    default: { }
                }
                return res.redirect("/cats/" + req.params.id);
            }
        }
        return res.redirect("/");
    }

    feedCat = async (
        req: express.Request,
        res: express.Response,
        cat: Cat
    ): Promise<void> => {
        if (!cat.sleeping) {
            let hungerLevel = cat.hungerLevel + 15;
            let happinessLevel = cat.happinessLevel + 5;
            if (hungerLevel > 100) {
                happinessLevel -= 30;
            }
            hungerLevel = Math.min(hungerLevel, 100);
            hungerLevel = Math.max(hungerLevel, 0);
            happinessLevel = Math.min(happinessLevel, 100);
            happinessLevel = Math.max(happinessLevel, 0);

            await this.catRepository.update(req.params.id, { hungerLevel: hungerLevel, happinessLevel: happinessLevel });
        }
    }

    playWithCat = async (
        req: express.Request,
        res: express.Response,
        cat: Cat
    ): Promise<void> => {
        let hungerLevel = cat.hungerLevel - 10;
        let happinessLevel = cat.happinessLevel + 15;
        let sleeping = cat.sleeping
        if (sleeping) {
            happinessLevel -= 5;
            sleeping = false;
        }
        if (Math.floor(Math.random() * 3) + 1 === 3) {
            happinessLevel = 0;
        }
        hungerLevel = Math.min(hungerLevel, 100);
        hungerLevel = Math.max(hungerLevel, 0);
        happinessLevel = Math.min(happinessLevel, 100);
        happinessLevel = Math.max(happinessLevel, 0);

        await this.catRepository.update(req.params.id, { hungerLevel: hungerLevel, happinessLevel: happinessLevel, sleeping: sleeping });
    }

    getSleepCat = async (
        req: express.Request,
        res: express.Response,
        cat: Cat
    ): Promise<void> => {
        await this.catRepository.update(req.params.id, { sleeping: true });
    }

    deleteCat = async (
        req: express.Request,
        res: express.Response
    ): Promise<void> => {
        const cat = await this.catRepository.findOne({ where: { id: req.params.id, user: req.user }, relations: ["user"] });
        if (cat) {
            await this.catRepository.delete(cat);
        }
        res.redirect("/");
    }
}

export default CatsController;
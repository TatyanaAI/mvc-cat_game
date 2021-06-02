import {User} from "../models/user.entity";
import {Strategy} from "passport-local";
import bcrypt from "bcrypt";
import passport from "passport";
import {getRepository} from "typeorm";

export class PassportLocal {
    userRepository = getRepository(User)

    constructor() {
        // @ts-ignore
        passport.serializeUser((user: User, cb: Function) => {
            cb(null, user.id);
        });
        passport.deserializeUser(async (id: number, cb: Function) => {
            const user = await this.userRepository.findOne(id);
            cb(null, user);
        });

        passport.use(new Strategy({
            usernameField: "username",
            passwordField: "password"
        }, this.verifyHandler));
    }

    verifyHandler = async (username: string, password: string, cb: Function) => {
        const user = await this.userRepository.findOne({username});
        if (!user) return cb(null, false, {message: "Username not found"});
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return cb(null, false, {message: "Invalid password"});
        return cb(null, user, {message: "Login successful"});
    };
}

export default passport;
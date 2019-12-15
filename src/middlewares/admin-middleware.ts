import {Request, Response, NextFunction} from "express";
import {User} from "../models";

const ensureAdmin = () => function(req: Request, res: Response, next: NextFunction) {
    if((req.user as User).isAdmin) {
        next();
    } else {
        res.redirect("/");
    }
};

export {ensureAdmin};
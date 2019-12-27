import {Request, Response, NextFunction} from "express";
import {User} from "../models";

/**
 * Ensures the user is an administrator
 */
const ensureAdmin = () => function(req: Request, res: Response, next: NextFunction) {
    if(req.user != null && (req.user as User).isAdmin) {
        next();
    } else {
        res.redirect("/");
    }
};

export {ensureAdmin};
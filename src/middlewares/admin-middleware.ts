import {Request, Response, NextFunction} from "express";
import {User} from "../models";

/**
 * Ensures the user is an administrator
 */
const ensureAdmin = () => function(req: Request, res: Response, next: NextFunction) {
    if(req.user != null && (req.user as User).isAdmin) {
        next();
    } else {
        res.status(403).redirect("/"); // Forbidden
    }
};

const ensureStudent = () => function(req: Request, res: Response, next: NextFunction) {
    if(req.user != null && (req.user as User).isAdmin) {
        res.status(403).redirect("/"); // Forbidden
    } else {
        next();
    }
};

export {ensureAdmin, ensureStudent};
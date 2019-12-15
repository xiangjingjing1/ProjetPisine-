import {Express, Request, Response} from "express";
import {ensureLoggedIn} from "connect-ensure-login";
import * as models from "../models";

function registerRoutes(app: Express) {
    app.get("/", ensureLoggedIn(), (req, res) => res.redirect("/board"));

    app.get("/board", ensureLoggedIn(), (req, res) => {
        let user = (req.user as models.User);
        if (user.isAdmin) {
            adminBoard(req, res);
        } else {
            studentBoard(req, res);
        }
    });
}

function studentBoard(req: Request, res: Response) {
    res.render("student-board", {name: "Tableau de bord"});
}

function adminBoard(req: Request, res: Response) {
    res.render("admin-board", {name: "Tableau de bord"});
}

export default registerRoutes;
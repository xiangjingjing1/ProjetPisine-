import {Request, Response} from "express";

function get(req: Request, res: Response) {
    res.render("session/list", {name: "Liste des sessions"});
}

export default {get};
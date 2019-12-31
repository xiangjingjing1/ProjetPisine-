import {Request, Response} from "express";

function get(req: Request, res: Response) {
    res.render("student/sessions-list", {name: "Liste des sessions"});
}

export default {get};
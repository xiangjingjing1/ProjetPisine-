import {Request, Response} from "express";

function get(req: Request, res: Response) {
    res.render("admin/admin-subjects-create", {"name": "Créer un sujet d'examen"});
}

function post(req: Request, res: Response) {
    res.render("admin/admin-subjects-create", {"name": "Créer un sujet d'examen"});
}

export default {get, post};
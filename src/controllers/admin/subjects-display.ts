import {Request, Response} from "express";
import * as models from "../../models";

function get(req: Request, res: Response) {

    models.Subject.findAll().then((subjects: models.Subject[]) => {
        res.render("admin/admin-subjects-display", {name: "Sujets d'examen", subjects});
    }).catch((err: any) => {
        console.error(err);
        res.render("admin/admin-subjects-display", {name: "Sujets d'examen", errors: ["Une erreur est survenue côté serbveur. Contactez un administrateur."]});
    });
}

function post(req: Request, res: Response) {
    res.send("OK !");
}

export default {get, post};
import {Request, Response} from "express";
import {ExamSession, Subject} from "../../models";

function get(req: Request, res: Response) {

    ExamSession.findAll({
        include: [Subject],
        order: [["state", "DESC"], ["date", "ASC"], [Subject, "name", "ASC"]],
    }).then((sessions: ExamSession[]) => {

        res.render("admin/admin-sessions-display", {
            name: "Liste des sessions d'examen",
            sessions,
        });

    }).catch((err: any) => {
        console.error(err);
        res.status(500).render("admin/admin-sessions-display", {
            name: "Liste des sessions d'examen",
            errors: ["Une erreur est survenue sur le serveur. Contactez un administrateur."]
        });
    });

}

export default {get};
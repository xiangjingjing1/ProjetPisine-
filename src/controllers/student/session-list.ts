import {Request, Response} from "express";
import * as models from "../../models";

const VIEW_PATH = "student/sessions-list";
const VIEW_NAME = "Liste des sessions";

function get(req: Request, res: Response) {

    models.ExamSession.findAll({
        include: [{
            model: models.Group,
            include: [models.User]
        }],
        where: {
            "$Groups.Users.id$": (req.user as models.User).id
        },
        order: [["state", "DESC"], ["date", "ASC"]]
    }).then((sessions: models.ExamSession[]) => {

        res.render(VIEW_PATH, {
            name: VIEW_NAME,
            sessions,
        });

    }).catch((err: any) => {
        console.error(err);
        res.render(VIEW_PATH, {
            name: VIEW_NAME,
            errors: ["Une erreur est survenue sur le serveur. Contactez un administrateur."]
        });
    });
}

export default {get};
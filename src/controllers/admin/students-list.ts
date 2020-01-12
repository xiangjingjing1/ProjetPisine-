import {Request, Response} from "express";
import {User} from "../../models";

function get(req: Request, res: Response) {
    User.findAll({
        where: {
            isAdmin: false,
        },
        order: [["lastname", "ASC"], ["firstname", "ASC"]],
    }).then((users) => {

        res.render("admin/admin-students-list", {
            name: "Liste des étudiants",
            users,
        });

    }).catch((err: any) => {
        console.error(err);
        res.render("admin/admin-students-list", {
            name: "Liste des étudiants",
            errors: ["Une erreur est sruvenue sur le serveur. Contactez un administrateur"],
        });
    });
}

export default {get};
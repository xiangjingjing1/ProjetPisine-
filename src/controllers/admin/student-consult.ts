import {Request, Response} from "express";
import {User, Group, Specialty} from "../../models";

const NOT_FOUND = new Error("Not found");

function get(req: Request, res: Response, otherData: object = {}) {
    
    User.findByPk(req.params.userId).then((user: User | null) => {

        /**
         * If the returned user is null, it means no user with the given id exists
         */
        if(user == null) {
            throw NOT_FOUND;
        }

        return Promise.all([
            Promise.resolve(user),
            Group.findOne({
                include: [{
                    model: Specialty,
                    as: "specialty"
                }, {
                    model: User,
                    where: {
                        id: user.id,
                    }
                }]
            }),
        ]);

    }).then(([user, group]: [User, Group | null]) => {

        res.render("admin/admin-student-stats", {
            name: "Profil étudiant",
            student: user,
            group,
            ...otherData,
        });

    }).catch((err: any) => {

        if(err == NOT_FOUND) {
            res.status(404).render("404", {name: "Page introuvable"});
            return;
        }

        console.error(err);
        res.status(500).render("admin/admin-student-stats", {
            name: "Profil étudiant",
            errors: ["Une erreur est survenue sur le serveur. Contactez un administrateur."],
        });

    });

}

function post(req: Request, res: Response) {

    User.findByPk(req.params.userId).then((user: User) => user.destroy()).then(() => {
        res.redirect("/admin/students/list");
    }).catch((err: any) => {
        console.error(err);
        get(req, res, {errors: ["L'utilisateur n'a pas pu être supprimé"]});
    });

}

export default {get, post};
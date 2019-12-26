import {Request, Response} from "express";
import {Subject} from "../../models";

function post(req: Request, res: Response) {

    Subject.findByPk(req.params.subjectId).then((subject: Subject | null) => {
        if(subject == null) {
            res.status(404).render("404", {
                name: "Introuvable",
                errors: ["Ce sujet n'existe pas"]
            });
            return;
        }

        subject.destroy().then(() => {

            // TODO: Display a page indicating subject is deleted
            res.redirect("/admin/subjects");

        }).catch((err: any) => {
            console.error(err);
            res.status(500).render("404", {
                name: "Erreur",
                errors: ["Une erreur est sruvenue côté serveur. Contactez un administrateur."]
            });
        });

    }).catch((err: any) => {
        console.error(err);
        res.status(404).render("404", {
            name: "Erreur",
            errors: ["Une erreur est sruvenue côté serveur. Contactez un administrateur."]
        });
    });

}

export default {post};
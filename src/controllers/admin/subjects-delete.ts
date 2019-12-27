import {Request, Response} from "express";
import {Subject} from "../../models";
import { parse } from "path";

/**
 * Handles the request which aims to delete a subject.
 * 
 * The request body must contains the following property:
 *  - `subjectId`: an integer corresponding to the id of the subject we want to delete
 */
function post(req: Request, res: Response) {

    /**
     * We check if the request body has a `subjectId` property
     */
    if(req.body.subjectId == undefined) {
        res.sendStatus(400); // Bad request
        return;
    }

    /**
     * We check if the given id in an integer
     */
    let subjectId = parseInt(req.body.subjectId);
    if(isNaN(subjectId)) {
        res.sendStatus(400); // Bad request
        return;
    }

    /**
     * We search for a subject with the given id
     */
    Subject.findByPk(subjectId).then((subject: Subject | null) => {

        /**
         * If the returned subject is null, it means no subject with the given id exists
         */
        if(subject == null) {
            res.status(404).render("404", {
                name: "Introuvable",
                errors: ["Ce sujet n'existe pas"]
            });
            return;
        }

        /**
         * We delete the subject
         */
        subject.destroy().then(() => {

            // TODO: Display a page indicating subject is deleted
            res.redirect("/admin/subjects");

        }).catch((err: any) => {
            console.error(err);
            res.status(500).render("404", {
                name: "Erreur",
                errors: ["Une erreur est survenue côté serveur. Contactez un administrateur."]
            });
        });

    }).catch((err: any) => {
        console.error(err);
        res.status(500).render("404", {
            name: "Erreur",
            errors: ["Une erreur est suevenue côté serveur. Contactez un administrateur."]
        });
    });

}

export default {post};
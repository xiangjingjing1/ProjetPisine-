import { Request, Response } from "express";
import * as models from "../../models";

function post(req: Request, res: Response) {

    switch(req.body.action) {
        case "addSpecialty":
            addSpecialty(req, res);
            break;
        case "deleteSpecialty":
            deleteSpecialty(req, res);
            break;
        default:
            get(req, res);
    }

}

function addSpecialty(req: Request, res: Response) {
    let query = req.body;
    
    if(query.specialtyName !== undefined && query.specialtyYear !== undefined) {

        var errors = [];

        if(query.specialtyName.length == 0) {
            errors.push("La nom de la spécialité ne peut pas être vide.");
        }

        let year = parseInt(query.specialtyYear);

        if(year == NaN) {
            errors.push("L'année doit être un nombre");
        } else if(year <= 0 || year > 5) {
            errors.push("L'année doit être comprise entre 1 et 5 (inclus)");
        }

        if(errors.length > 0) { // There's errors, we can't create specialty
            get(req, res, {errors});
            return;
        }

        const onCatch = (err: any) => {
            console.error(err);
            get(req, res, { errors: ["Une erreur est survenue sur le serveur. Contactez un administrateur."]});
        };

        models.Specialty.findOne({
            where: {
                name: query.specialtyName,
                year,
            }
        }).then((specialty) => {
            if(specialty == null) { // No specialty with the given name and the given year was find. We can create one.
                models.Specialty.create({
                    name: query.specialtyName,
                    year,
                }).then((spe) => {
                    get(req, res, {successes: [`La spécialité ${spe.name}${spe.year} a bien été créée.`]});
                }).catch(onCatch);
            } else {
                get(req, res, { errors: ["Cette spécialité existe déjà."] });
            }
        }).catch(onCatch);

    } else {
         get(req, res);
    }

}

function deleteSpecialty(req: Request, res: Response) {

    let query = req.body;

    if(query.id != undefined) {

        let id = parseInt(query.id);

        if (id == NaN) {
            get(req, res, { errors: ["Cette spécialité n'existe pas"] });
            return;
        }

        models.Specialty.destroy({
            where: {
                id
            }
        }).then((count) => {
            if(count == 0) {
                get(req, res, { errors: ["Cette spécialité n'existe pas"]});
            } else {
                get(req, res, { successes: [`La spécialité a bien été supprimée.`]});
            }
        }).catch((err) => {
            console.error(err);
            get(req, res, { errors: ["Une erreur est survenue sur le serveur. Contactez un administrateur."]});
        });

    } else {
        get(req, res);
    }
}

function get(req: Request, res: Response, otherData?: object) {

    const onCatch = (err: any) => {
        console.error(err);
        res.render("admin/admin-groups", { 
            name: "Groupes et spécialités", 
            errors: ["Une erreur est survenue sur le serveur."],
            ...otherData,
        });
    };

    models.Specialty.findAll({
        include: [models.Specialty.associations.groups],
        order: ["name", "year"],
    }).then((specialties) => {
        res.render("admin/admin-groups", {
            name: "Groupes et spécialités",
            specialties,
            ...otherData,
        });
    }).catch(onCatch);
}

export default { post, get };
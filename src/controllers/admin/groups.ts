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
        case "deleteGroup":
            deleteGroup(req, res);
            break;
        case "addGroup":
            addGroup(req, res);
            break;
        default:
            get(req, res);
    }

}

function addGroup(req: Request, res: Response) {
    let query = req.body;
    if(query.specialtyId != undefined && query.num != undefined) {

        let specialtyId = parseInt(query.specialtyId);
        if(isNaN(specialtyId)) {
            get(req, res, { errors: ["Ce numéro de spécialité n'est pas valide."] });
            return;
        }

        let num = parseInt(query.num);
        if(isNaN(num)) {
            get(req, res, { errors: ["Le numéro de groupe renseigné n'est pas un nombre."] });
            return;
        }

        const onCatch = (err: any) => {
            console.error(err);
            get(req, res, { errors: ["Une erreur est survenue sur le serveur. Contactez un administrateur."] });
        };

        models.Group.findOne({
            where: {
                specialtyId,
                num,
            },
        }).then((group: models.Group | null) => {

            if(group == null) {
                models.Group.create({
                    specialtyId,
                    num,
                }).then(() => {
                    get(req, res, { successes: ["La groupe a bien été créé."]});
                }).catch(onCatch);
            } else {
                get(req, res, { errors: ["Un groupe avec ce numéro existe déjà."] });
            }
        
        }).catch(onCatch);
    } else {
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

        if(isNaN(year)) {
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

        if (isNaN(id)) {
            get(req, res, { errors: ["Cette spécialité n'existe pas"] });
            return;
        }

        models.Specialty.destroy({
            where: {
                id
            },
        }).then((count: number) => {
            if(count == 0) {
                get(req, res, { errors: ["Cette spécialité n'existe pas"]});
            } else {
                get(req, res, { successes: [`La spécialité a bien été supprimée.`]});
            }
        }).catch((err: any) => {
            console.error(err);
            get(req, res, { errors: ["Une erreur est survenue sur le serveur. Contactez un administrateur."]});
        });

    } else {
        get(req, res);
    }
}

function deleteGroup(req: Request, res: Response) {
    
    let query = req.body;

    if(query.id != undefined) {

        let id = parseInt(query.id);

        if(isNaN(id)) {
            get(req, res, { errors: ["Ce groupe n'existe pas"] });
            return;
        }

        models.Group.destroy({
            where: {
                id,
            },
        }).then((count: number) => {
            if(count == 0) {
                get(req, res, { errors: ["Ce groupe n'existe pas"]});
            } else {
                get(req, res, { successes: [`Ce groupe a bien été supprimé.`]});
            }
        }).catch((err: any) => {
            console.error(err);
            get(req, res, { errors: ["Une erreur est survenue sur le serveur. Contactez un administrateur."]});
        });

    } else {
        get(req, res);
    }

}

// TODO: Fix warning : "a promise was created in a handler at internal/timers.js:439:21 but was not returned from it"
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
    }).then((specialties: models.Specialty[]) => {
        res.render("admin/admin-groups", {
            name: "Groupes et spécialités",
            specialties,
            ...otherData,
        });
    }).catch(onCatch);
}

export default { post, get };
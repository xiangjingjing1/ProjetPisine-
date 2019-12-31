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

/**
 * Handles the request which aims to add a group.
 * 
 * The request body must contain following properties :
 *  - `specialtyId`: an integer corresponding to the specialty we want to add the group
 *  - `num`: an integer corresponding to the number of the group
 * 
 * If the specialty with the given id already has a group with the given number,
 * the group isn't created.
 */
function addGroup(req: Request, res: Response) {
    let query = req.body;

    /**
     * We check the body has a `specialtyId` and a `num` property
     */
    if(query.specialtyId != undefined && query.num != undefined) {

        /**
         * We check if the `specialtyId` is an integer
         */
        let specialtyId = parseInt(query.specialtyId);
        if(isNaN(specialtyId)) {
            get(req, res, { errors: ["Ce numéro de spécialité n'est pas valide."] });
            return;
        }

        /**
         * We check if the `num` property is an integer
         */
        let num = parseInt(query.num);
        if(isNaN(num)) {
            get(req, res, { errors: ["Le numéro de groupe renseigné n'est pas un nombre."] });
            return;
        }

        /**
         * We define a callback that will be used to handle any internal error
         */
        const onCatch = (err: any) => {
            console.error(err);
            get(req, res, { errors: ["Une erreur est survenue sur le serveur. Contactez un administrateur."] });
        };

        /**
         * We try to find a group with the given number and referencing the specialty
         * with the given id
         */
        models.Group.findOne({
            where: {
                specialtyId,
                num,
            },
        }).then((group: models.Group | null) => {

            /**
             * If the returned group is null, it means no group matching the query
             * was find. Then we can create the group.
             */
            if(group == null) {
                
                // TODO: Will the request fail if the given `specialtyId` refers to no specialty ? We would it to fail.
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

/**
 * Handles the request which aims to create a specialty.
 * 
 * The request body must contain the following properties:
 *  - `specialtyName`: a non-empty string corresponding the name of the specialty we want to create
 *  - `specialtyYear`: an integer between 1 and 5 (both inclusives) corresponding to the year of the specialty we want to create
 * 
 * If a specialty with the given name and for the given year already exists, the specialty isn't created.
 */
function addSpecialty(req: Request, res: Response) {
    let query = req.body;
    
    /**
     * We check if the request body has a `specialtyName` and a `specialtyName` property
     */
    if(query.specialtyName !== undefined && query.specialtyYear !== undefined) {

        var errors = [];

        /**
         * We check if the given name is a non-empty string
         */
        if(query.specialtyName.length == 0) {
            errors.push("La nom de la spécialité ne peut pas être vide.");
        }

        /**
         * We check if the given year an integer between 1 and 5 (both inclusives)
         */
        let year = parseInt(query.specialtyYear);
        if(isNaN(year)) {
            errors.push("L'année doit être un nombre");
        } else if(year <= 0 || year > 5) {
            errors.push("L'année doit être comprise entre 1 et 5 (inclus)");
        }

        /**
         * If we met errors, we restituate them to user
         */
        if(errors.length > 0) {
            get(req, res, {errors});
            return;
        }

        /**
         * We define a callback that will be used to handle internal errors
         */
        const onCatch = (err: any) => {
            console.error(err);
            get(req, res, { errors: ["Une erreur est survenue sur le serveur. Contactez un administrateur."]});
        };

        /**
         * We search for a specialty with the given name for the give year.
         */
        models.Specialty.findOne({
            where: {
                name: query.specialtyName,
                year,
            }
        }).then((specialty: models.Specialty | null) => {

            /**
             * If the returned specialty is null, it means no specialty with the given name for the given year exists.
             * Then we can create a such specialty.
             */
            if(specialty == null) {

                models.Specialty.create({
                    name: query.specialtyName,
                    year,
                }).then((spe: models.Specialty) => {

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

/**
 * Handles the request which aims to delete a specialty.
 * 
 * The request body must contain the following property:
 *  - `id`: an integer correspond to the id of the specialty we want to delete
 * 
 */
function deleteSpecialty(req: Request, res: Response) {

    let query = req.body;

    /**
     * We check if the request body has the `id` property
     */
    if(query.id != undefined) {

        /**
         * We check if the given id is an integer
         */
        let id = parseInt(query.id);
        if (isNaN(id)) {
            get(req, res, { errors: ["Cette spécialité n'existe pas"] });
            return;
        }

        /**
         * We delete the specialty corresponding to the given id
         */
        models.Specialty.destroy({
            where: {
                id
            },
        }).then((deletedCount: number) => {

            /**
             * If no rows were deleted, it means no specialty with the given id exists
             */
            if(deletedCount == 0) {
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

/**
 * Handles the request which aims to delete a group.
 * 
 * The request body must contain the following property:
 *  - `id`: an integer corresponding to the id of the group we want to delete
 * 
 */
function deleteGroup(req: Request, res: Response) {
    
    let query = req.body;

    /**
     * We check if the request body has the `id` property
     */
    if(query.id != undefined) {

        /**
         * We check if the given id is an integer
         */
        let id = parseInt(query.id);
        if(isNaN(id)) {
            get(req, res, { errors: ["Ce groupe n'existe pas"] });
            return;
        }

        /**
         * We delete the group with the given id
         */
        models.Group.destroy({
            where: {
                id,
            },
        }).then((affectedCount: number) => {

            /**
             * If no rows were affected, it means no group has the given id
             */
            if(affectedCount == 0) {
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
import { Request, Response } from "express";
import * as models from "../../models";

/**
 * Handles the request which aims to register an user.
 * 
 * The request body must have the following properties:
 *  - `firstname`: a non-empty string, the first name of the user
 *  - `lastname`: a non-empty string, the last name of the user
 *  - `specialtyName`: a string, the name of the specialty the user belongs to
 *  - `specialtyYear`: an integer, the year of the specialty the user belongs to
 *  - `group`: an integer, the number of the group the user belongs to
 *  - `email`: a string, must be matching format `/^[^@]+@etu\.umontpellier\.fr$/`, the user's email
 *  - `password`: a string, minimum length of 10, the user's password
 *  - `passwordConfirm`: a string that must exactly match the `password` property
 */
function post(req: Request, res: Response) {
    let query = req.body;

    /**
     * We check if all required properties are present
     */
    if (
        query.firstname !== undefined &&
        query.lastname !== undefined &&
        query.specialtyName !== undefined &&
        query.specialtyYear !== undefined &&
        query.group !== undefined &&
        query.email !== undefined &&
        query.password !== undefined &&
        query.passwordConfirm !== undefined
    ) {
        let q = (query as UserRegisterRequest);
        var errors: Array<string> = [];

        /**
         * We check if both firstname and username are non-empty strings
         */
        if (q.firstname.length == 0) {
            errors.push("Le prénom ne peut pas être vide.");
        }
        if (q.lastname.length == 0) {
            errors.push("Le nom de famille ne peut pas être vide.");
        }

        /**
         * We check if the password is at least 10-characters long and the `passwordConfirm`
         * property matches the password
         */
        if (q.password.length < 10) {
            errors.push("Le mot de passe doit faire au moins 10 caractères.");
        } else if (q.password != q.passwordConfirm) {
            errors.push("Les deux mots de passes ne sont pas identiques.");
        }

        /**
         * We check if the email has the correct format
         */
        if (!/^[^@]+@etu\.umontpellier\.fr$/.test(q.email)) {
            errors.push("Votre email ne n'est pas un email universitaire.");
        }

        /**
         * If we encountered errors while checking properties, we return them to user.
         */
        if (errors.length > 0) {
            res.render("auth/register", { name: "S'inscrire", errors });
            return;
        }

        /**
         * We define a callback to use on internal errors
         */
        let onPromiseError = (err: any) => {
            console.error(err);
            res.render("auth/register", { name: "S'inscire", errors: ["Une erreur est survenue sur le serveur. Contactez un administrateur."]});
        };

        /**
         * The email must be unique, we then search for an user using the given email
         */
        models.User.findOne({
            where: {
                email: q.email
            }
        }).then((user: models.User | null) => {

            /**
             * If the returned user isn't null, it means an user with the given email already exists.
             * We don't create the user.
             */
            if (user != null) {
                res.render("auth/register", { 
                    name: "S'inscrire",  
                    errors: ["Un utilisateur avec cet email existe déjà. Si cet email est le votre, contactez un administrateur."] 
                });
                return;
            }

            /**
             * We search for a group matching the given specialty name, the given specialty year and the given group number
             */
            models.Group.findOne({
                where: {
                    num: q.group,
                },
                include: [{
                    model: models.Specialty,
                    as: "specialty",
                    where: {
                        name: q.specialtyName,
                        year: q.specialtyYear,
                    },
                }]
            }).then((group: models.Group | null) => {
                
                /**
                 * If the returned group is null, it means no group matching the given requirements exists.
                 * We can't create the user.
                 */
                if (group == null) {
                    res.render("auth/register", { name: "S'inscrire",  errors: ["Cette combinaison de section/année/groupe n'existe pas."] });
                    return;
                }

                /**
                 * All properties requirements are matched, we can create the user.
                 * We use `User#createSafe` so the password is hashed before being inserted in database.
                 */
                models.User.createSafe(q.firstname, q.lastname, q.password, q.email, false).then((user) => {

                    /**
                     * We add the user to the retrieved group
                     */
                    group.addUser(user).then(() => {
                        res.redirect("/login?fromRegister");
                    }).catch(async (err: any) => {
                        /**
                         * If an error occured when attempting to add the user to the group, we delete
                         * the user because we don't want a basic user to have no group
                         */
                        await user.destroy();
                        onPromiseError(err);
                    });
                    
                }).catch((err: any) => onPromiseError(err));
            }).catch((err: any) => onPromiseError(err));
        }).catch((err: any) => onPromiseError(err));

    } else {
        res.status(500).send("Missing data");
    }
}

function get(req: Request, res: Response) {
    res.render('auth/register', { name: "S'inscrire" });
}

interface UserRegisterRequest {
    firstname: string;
    lastname: string;
    specialtyName: string;
    specialtyYear: string;
    group: string;
    email: string;
    password: string;
    passwordConfirm: string;
}

export default {post, get};
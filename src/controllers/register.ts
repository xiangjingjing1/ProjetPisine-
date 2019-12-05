import { Request, Response } from "express";
import * as models from "../models";
import Sequelize from "sequelize";

function onUserRegister(req: Request, res: Response) {
    let query = req.body;
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

        // Check firstname and lastname
        if (q.firstname.length == 0) {
            errors.push("Le prénom ne peut pas être vide.");
        }
        if (q.lastname.length == 0) {
            errors.push("Le nom de famille ne peut pas être vide.");
        }

        // Check password
        if (q.password.length < 10) {
            errors.push("Le mot de passe doit faire au moins 10 caractères.");
        } else if (q.password != q.passwordConfirm) {
            errors.push("Les deux mots de passes ne sont pas identiques.");
        }

        // Check email
        if (!/^[^@]+@etu\.umontpellier\.fr$/.test(q.email)) {
            errors.push("Votre email ne n'est pas un email universitaire.");
        }

        // Something is invalid, we send errors back to user
        if (errors.length > 0) {
            res.render("register", { name: "S'inscrire", errors });
            return;
        }

        let onPromiseError = (err: any) => {
            console.error(err);
            res.render("register", { name: "S'inscire", errors: ["Une erreur est survenue sur le serveur. Contactez un administrateur."]});
        };

        // Searching for a user with the given email
        models.User.findOne({
            where: {
                email: q.email
            }
        }).then((user) => {

            // If a user with the given name exists, then we don't register the new user and send an error
            if (user != null) {
                res.render("register", { name: "S'inscrire",  errors: ["Un utilisateur avec cet email existe déjà. Si cet email est le votre, contactez un administrateur."] });
                return;
            }

            // We seach the group the user should be registered in
            models.Group.findOne({
                include: [{
                    model: models.Specialty,
                    as: "specialty",
                    where: {
                        name: q.specialtyName,
                        year: q.specialtyYear,
                        id: Sequelize.col("group.specialtyId")
                    }
                }]
            }).then((group) => {

                // We can't find the group, then we can't register the user
                if (group == null) {
                    res.render("register", { name: "S'inscrire",  errors: ["Cette combinaison de section/année/groupe n'existe pas."] });
                }

                // Everything is ok, we can register the user
                models.User.createSafe(q.firstname, q.lastname, q.password, q.email, false).then((user) => {

                    group.addUser(user).then(() => {
                        res.redirect("/login?fromRegister");
                    }).catch(async (err) => {
                        await user.destroy();
                        onPromiseError(err);
                    });
                    
                }).catch((err) => onPromiseError(err));
            }).catch((err) => onPromiseError(err));
        }).catch((err) => onPromiseError(err));

    } else {
        res.status(400).send("Missing data");
    }
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

export default onUserRegister;
import {Request, Response} from "express";
import * as models from "../../models";

function post(req: Request, res: Response) {
  let query = req.body;

}

function get(req: Request, res: Response) {
    res.render('student/updatepassword');

    let user = {
      oldPassword : req.query.oldPassword,
      newPassword : req.query.newPassword,
      againPassword : req.query.againPassword,
    }

    let _res = res;

    if (!user.oldPassword) {
        errors.push("Ancien mot de passe saisie incorrect");
    }
    if (!user.newPassword) {
        errors.push("Le mot de passe ne peut pas etre vide");
    }
    if (!user.againPassword || user.againPassword !== user.newPassword) {
        errors.push("Le mot de passe doit etre identiques");
    }
}

export default {get};

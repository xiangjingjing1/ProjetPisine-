import {Request, Response} from "express";
import * as models from "../../models";

function get(req: Request, res: Response) {
    let userId = parseInt(req.params.user);
    if(isNaN(userId)) {
        res.sendStatus(400);
        return;
    }

    models.ExamSession.findAll({
        attributes: ["date"],
        include:[{
            model: models.ExamResult,
            attributes: ["part", "score"]
        }],
        where: {
            "$ExamResults.UserId$": userId,
        },
        order: [["date", "ASC"]]
    }).then((results) => {

        res.json(results);

    }).catch((err: any) => {
        console.error(err);
        res.sendStatus(500);
    });

}

export default {get};
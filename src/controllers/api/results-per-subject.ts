import {Request, Response} from "express";
import * as models from "../../models";
import sq from "sequelize";
import sequelize from "../../models/connection";

function get(req: Request, res: Response) {

    sequelize.query(`SELECT AVG("score_sum") AS average, MIN("score_sum") AS min, MAX("score_sum") AS max, name
                    FROM (
                        SELECT SUM("score") AS score_sum, ExamSessionId
                        FROM ExamResults
                        GROUP BY ExamSessionId
                    )
                    INNER JOIN ExamSessions ES ON ES.id = ExamSessionId
                    INNER JOIN Subjects S on ES.SubjectId = S.id
                    GROUP BY S.id
    `, {
        raw: true,
    }).then((results) => {
        res.json(results[0]);
    }).catch((err: any) => {
        console.error(err);
        res.sendStatus(500);
    });
    
}

export default {get};
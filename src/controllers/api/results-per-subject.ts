import {Request, Response} from "express";
import * as models from "../../models";
import sq, { Model } from "sequelize";
import sequelize from "../../models/connection";

function get(req: Request, res: Response) {

    models.ExamResult.findAll({
        attributes: [[sq.fn("SUM", sq.col("score")), "score_sum"]],
        include: [{
            model: models.ExamSession,
            include: [{
                model: models.Subject,
                attributes: ["name"],
            }]
        }],
        group: ["ExamSession.id"]
    }).then((results: Array<any>) => {
        let prep_processed: any = results.map((result: any) => ({
            score_sum: result.dataValues.score_sum,
            name: result.ExamSession.Subject.name,
        })).reduce((acc: {[subjectName: string]: Array<{score_sum: number, name: string}>}, value: {score_sum: number, name: string}) => {
            (acc[value.name] = acc[value.name] || []).push(value);
            return acc;
        }, {});

        let processed = Object.values(prep_processed).map((values: Array<{score_sum: number, name: string}>) => ({
            average: values.reduce((acc, value) => acc + value.score_sum, 0) / values.length,
            max: Math.max(... values.map((value) => value.score_sum)),
            min: Math.min(... values.map((value) => value.score_sum)),
        }));

        res.json(processed);
    }).catch((err: any) => {
        console.error(err);
        res.sendStatus(500);
    });
    
}

export default {get};
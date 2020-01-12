import {Request, Response} from "express";
import * as models from "../../models";
import sq from "sequelize";

function get(req: Request, res: Response) {

    models.ExamResult.findAll({
        attributes: [[sq.fn("SUM", sq.col("score")), "score_sum"]],
        include: [{
            model: models.ExamSession,
            attributes: [],
            include: [{
                model: models.Subject,
                attributes: ["name"],
            }],
            where: {
                state: models.ExamSession.FINISHED,
            }
        }],
        group: ["ExamSession.id", "ExamSession.Subject.id", "UserId"],
        raw: true,
    }, ).then((results: Array<any>) => {

        let prep_processed: any = results.map((result: any) => ({
            score_sum: result.score_sum,
            name: result['ExamSession.Subject.name'],
        })).reduce((acc: {[subjectName: string]: Array<{score_sum: number, name: string}>}, value: {score_sum: number, name: string}) => {
            (acc[value.name] = acc[value.name] || []).push(value);
            return acc;
        }, {});

        let processed = Object.values(prep_processed).map((values: Array<{score_sum: string, name: string}>) => {
            let mappedToNumber: Array<number> = values.map((value) => parseInt(value.score_sum));
            return {
                average: mappedToNumber.reduce((acc, value) => acc + value, 0) / values.length,
                max: Math.max(... mappedToNumber),
                min: Math.min(... mappedToNumber),
                name: values[0].name,
            };
        });

        res.json(processed);
    }).catch((err: any) => {
        console.error(err);
        res.sendStatus(500);
    });
    
}

export default {get};
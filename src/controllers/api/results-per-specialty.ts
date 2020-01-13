import {Request, Response} from "express";
import { ExamResult, Group, User, Specialty } from "../../models";
import sq from "sequelize";

function get(req: Request, res: Response) {

    Promise.all([
        ExamResult.findAll({
            attributes: [[sq.fn("SUM", sq.col("score")), "score_sum"], ["UserId", "userId"]],
            group: ["UserId", "ExamSessionId"],
            raw: true,
        }),
        Group.findAll({
            include: [{
                model: Specialty,
                as: "specialty",
            }, 
            {
                model: User,
            }],
        })
    ]).then(([results, groups]: [Array<any>, Group[]]) => {

        var userIdToResults: {[userId: string]: Result[]} = {};
        results.forEach((result: Result) => {
            (userIdToResults[result.userId] = userIdToResults[result.userId] || []).push(result);
        });
        
        var speIdToSpe: {[speId: string]: Specialty} = {};
        var specialtyIdToResult: {[speId: string]: Result[]} = {};
        groups.forEach((group) => {
            group.Users.forEach((user: User) => {
                let userResults = userIdToResults[user.id];
                if(userResults != undefined) {
                    (specialtyIdToResult[group.specialty.id] = specialtyIdToResult[group.specialty.id] || []).push(... userResults);
                }
            });
            speIdToSpe[group.id] = group.specialty;
        });

        let resultsPerSpecialty = Object.keys(specialtyIdToResult).map((speId: string) => {
            let scores: Array<number> = specialtyIdToResult[speId].map((result: Result) => parseInt(result.score_sum));
            let average = scores.reduce((acc, el) => acc + el, 0) / scores.length;
            let min = Math.min(... scores);
            let max = Math.max(... scores);
            let spe = speIdToSpe[speId];
            return {
                min,
                average,
                max,
                name: spe.name,
                year: spe.year,
            };
        });

        res.json(resultsPerSpecialty);

    }).catch((err: any) => {
        console.error(err);
        res.sendStatus(500);
    });

}

interface Result {
    score_sum: string; userId: number;
}

export default {get};
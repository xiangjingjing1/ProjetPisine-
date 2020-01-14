import {Request, Response} from "express";
import { ExamResult, Group, User, ExamSession, Specialty } from "../../models";
import moment from "moment";
import sq from "sequelize";
import {readingScore, listeningScore} from "../../data/index";

function get(req: Request, res: Response) {

    Promise.all([
        ExamSession.findByPk(req.params.sessionId, {
            include: [{
                model: Group,
                include: [User, {
                    model: Specialty,
                    as: "specialty",
                }]
            }],
            order: [
                sq.col("Groups.specialty.name"),
                sq.col("Groups.specialty.year"),
                sq.col("Groups.Users.lastname"),
                sq.col("Groups.Users.firstname"),
            ],
        }),
        ExamResult.findAll({
            attributes: ["score", "UserId", "part"],
            where: {
                ExamSessionId: req.params.sessionId,
            },
        })
    ]).then(([session, results]: [ExamSession, ExamResult[]]) => {

        if(session.state != ExamSession.FINISHED) {
            res.sendStatus(403); // Forbidden
            return;
        }

        var perUserResults: {[userId: string]: {listening: number, reading: number}} = {};
        results.forEach((result) => {

            let total = perUserResults[result.UserId] || {listening: 0, reading: 0};

            // Listening parts
            if(result.part >= 1 && result.part <= 4) {
                total.listening += result.score;
            }

            // Reading parts
            if(result.part >= 5 && result.part <= 7) {
                total.reading += result.score;
            }

            perUserResults[result.UserId] = total;

        });

        var speIdToResults: {[speId: string]: Array<{
            firstname: string,
            lastname: string,
            result: {
                listening: number,
                reading: number;
            }
        }>} = {};

        var speIdToSpe: {[speId: string]: Specialty} = {};

        session.Groups.forEach((group) => {
            speIdToSpe[group.specialty.id] = group.specialty;
            speIdToResults[group.specialty.id] = group.Users.map((user) => {
                let result = perUserResults[user.id] || {listening: 0, reading: 0};
                return {
                    lastname: user.lastname,
                    firstname: user.firstname,
                    result: {
                        listening: listeningScore(result.listening),
                        reading: readingScore(result.reading),
                    }
                };
            });
        });

        console.log("perUserResults :");
        console.log(perUserResults);
        console.log();

        console.log("speIdToSpe:");
        console.log(speIdToSpe);

        var ret: any = {};
        ret["date"] = moment(session.date).locale("fr").format("DD-MM-YYYY HH:mm");
        ret["specialties"] = Object.values(speIdToSpe).map((spe) => ({
            name: `${spe.name}${spe.year}`,
            users: speIdToResults[spe.id],
        }));

        res.json(ret);

    }).catch((err: any) => {
        console.error(err);
        return res.sendStatus(500);
    });

}

export default {get};
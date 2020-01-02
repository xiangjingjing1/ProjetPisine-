import {Request, Response} from "express";
import {ExamSession, User, Group, Subject, CorrectAnswer, ExamResult} from "../../models";
import {findPartFromQuestion, parts, listeningScore, readingScore} from "../../data";

const VIEW_PATH = "student/sessions-display";
const VIEW_NAME = "Session d'examen";

const NotFound = new Error("Page introuvable");
const Unauthorized = new Error("Vous n'avez pas l'autorisation d'accéder à cette page");
const SessionEnded = new Error("La session est terminée. Vous ne pouvez plus soumettre vos réponses");
const BadRequest = new Error("Bad Request");

function get(req: Request, res: Response, otherData: object = {}) {
    getExamSession(req, res).then((session: ExamSession) => {

        if(session.state == ExamSession.FINISHED) {
            return Promise.all([
                Promise.resolve(session),
                ExamResult.findAll({
                    where: {
                        UserId: (req.user as User).id,
                        ExamSessionId: session.id,
                    },
                    order: [["part", "ASC"]]
                })
            ]);
        }

        return Promise.all([
            Promise.resolve(session),
            Promise.resolve([]),
        ]);
        
    }).then(([session, results]: [ExamSession, ExamResult[]]) => {

        var totals = {
            reading: {
                normal: 0,
                converted: 0,
            },
            listening: {
                normal: 0,
                converted: 0,
            }
        };
        var nextPart = 1;
        var completeResult: { part: number, score: number }[] = [];
        results.forEach((result) => {
            for(var i = nextPart; i < result.part; i++) {
                completeResult.push({
                    part: i,
                    score: 0,
                });
            }
            completeResult.push(result);
            
            if(result.part <= 4) {
                totals.listening.normal += result.score;
            } else {
                totals.reading.normal += result.score;
            }

            nextPart = result.part + 1;
        });
        for(var i = nextPart; i <= 7; i++) {
            completeResult.push({
                part: i,
                score: 0,
            });
        }

        totals.reading.converted = readingScore(totals.reading.normal);
        totals.listening.converted = listeningScore(totals.listening.normal);
        
        res.render(VIEW_PATH, { name: VIEW_NAME, session, results: completeResult, parts, totals, ...otherData });

    }).catch(catchError(req, res));
}

function post(req: Request, res: Response) {
    getExamSession(req, res).then((session: ExamSession) => {

        if(session.state != ExamSession.IN_PROGRESS) {
            return Promise.reject(SessionEnded);
        }

        return Promise.all([
            Promise.resolve(session),
            Subject.findByPk(session.SubjectId, {
                include: [Subject.associations.answers]
            })
        ]);

    }).then(([session, subject]: [ExamSession, Subject | null]) => {

        var scores: {[part: string]: number} = {};

        subject.answers.forEach((answer: CorrectAnswer) => {
            let sentAnswer = req.body[`question${answer.num}`];
            if(sentAnswer != undefined && sentAnswer == answer.answer) {
                let part = findPartFromQuestion(answer.num);
                if(part != null) {
                    if(scores[part] == undefined) {
                        scores[part] = 0;
                    }
                    scores[part] += 1;
                }
            }
        });

        let scoreRecords = Object.keys(scores).map((part: string) => ({
            part,
            score: scores[part],
            UserId: (req.user as User).id,
            ExamSessionId: session.id,
        }));

        return ExamResult.bulkCreate(scoreRecords, {
            updateOnDuplicate: ["score"]
        });

    }).then(() => {

        get(req, res, {successes: ["Vos réponses ont bien été enregistrées"]});

    }).catch(catchError(req, res));
}

const catchError = (req: Request, res: Response) => (err: any) => {
    switch(err) {
        case NotFound:
            res.status(404).render("404", {name: err.message});
            break;
        case Unauthorized:
            res.sendStatus(401).render("401", {name: err.message});
            break;
        case SessionEnded:
            get(req, res, {errors: [err.message]});
            break;
        case BadRequest:
            res.sendStatus(400);
            break;
        default:
            console.error(err);
            res.render(VIEW_PATH, {name: VIEW_NAME, errors: ["Une erreur est survenue sur le serveur. Actualisez la page et ré-essayez. \
            Si l'erreur persiste, contactez un administrateur."]});
    }
};

async function getExamSession(req: Request, res: Response): Promise<ExamSession> {
    
    let sessionId = parseInt(req.params.id);
    if(isNaN(sessionId)) {
        return Promise.reject(NotFound);
    }

    return ExamSession.findOne({
        include: [{
            model: Group,
            include: [User]
        }],
        where: {
            "$Groups.Users.id$": (req.user as User).id,
            "id": sessionId,
        }
    }).then((session: ExamSession | null) => {

        /**
         * If the returned exam session is null, it means no exam session
         * with the given id exists the connected user can connect to
         */
        if(session == null) {
            return Promise.reject(NotFound);
        }

        return Promise.resolve(session);
    });

}

export default { get, post };
import {Request, Response} from "express";
import {ExamSession, User} from "../../models";
import bdd from "../../models/connection";

const NotFound = new Error("Not Found");
const Unauthorized = new Error("Unauthorized");
const BadRequest = new Error("Bad Request");

function get(req: Request, res: Response) {
    getExamSession(req, res).then((session: ExamSession) => {

        return Promise.all([
            Promise.resolve(session),
            bdd.query(`SELECT COUNT(*) FROM GroupParticipations, Groups, UserGroups
                        WHERE UserGroups.UserId = ${(req.user as User).id} AND
                              UserGroups.GroupId = Groups.id AND
                              Groups.id = GroupParticipations.GroupId AND
                              GroupParticipations.ExamSessionId = ${session.id}`, {
                                  raw: true,
                              })
        ]);

    }).then(([session, result]: [ExamSession, any]) => {
        if((result[0][0] as CountResult)['COUNT(*)'] == 1) {
            res.render("student/sessions-display", { name: "Session d'examen", session });
        } else {
            return Promise.reject(Unauthorized);
        }
    })
    .catch((err: any) => {
        switch(err) {
            case NotFound:
                res.status(404).render("404", {name: "Page non trouvée"});
                break;
            case Unauthorized:
                res.sendStatus(401);
                break;
            case BadRequest:
                res.sendStatus(400);
                break;
            default:
                res.sendStatus(500); // Internal serveur error
        }
    });
}

async function getExamSession(req: Request, res: Response): Promise<ExamSession> {
    
    let sessionId = parseInt(req.params.id);
    if(isNaN(sessionId)) {
        return Promise.reject(NotFound);
    }

    return ExamSession.findByPk(sessionId).then((session: ExamSession | null) => {

        /**
         * If the returned exam session is null, it means no exam session
         * with the given id exists
         */
        if(session == null) {
            return Promise.reject(NotFound);
        }

        return Promise.resolve(session);
    });

}

interface CountResult {
    "COUNT(*)": number;
}

export default { get };
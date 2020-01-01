import {Request, Response} from "express";
import {ExamSession, User, Group} from "../../models";

const NotFound = new Error("Not Found");
const Unauthorized = new Error("Unauthorized");
const BadRequest = new Error("Bad Request");

function get(req: Request, res: Response) {
    getExamSession(req, res).then((session: ExamSession) => {

        res.render("student/sessions-display", { name: "Session d'examen", session });

    }).catch((err: any) => {
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

export default { get };
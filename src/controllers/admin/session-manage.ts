import {Request, Response} from "express";
import {Subject, ExamSession, Group, Specialty, GroupParticipation} from "../../models";
import {checkSentData} from "./sessions-create";
import sq from "sequelize";

function get(req: Request, res: Response, otherData: object = {}) {

    getExamSession(req, res).then((session: ExamSession) => {

        const onCatch = (err: any) => {
            console.error(err);
            res.render("admin/admin-sessions-manage", {
                name: "Gérer une session d'examen",
                session,
                errors: ["Une erreur est survenue sur le serveur. Contactez un administrateur."]
            });
        };

        Promise.all([
            Subject.findAll({
                order: [["name", "ASC"]]
            }),
            Specialty.findAll({
                include: [Specialty.associations.groups],
                order: [["name", "ASC"], ["year", "ASC"]]
            })
        ]).then(([subjects, specialties]: [Subject[], Specialty[]]) => {
            
            res.render("admin/admin-sessions-manage", {
                name: "Gérer une session d'examen",
                session,
                subjects,
                specialties,
                ...otherData
            });

        }).catch(onCatch);

        return null;

    }).catch(() => {});
}

function post(req: Request, res: Response) {
    getExamSession(req, res).then((session: ExamSession) => {

        switch(req.body.action) {
            case "update":
                updateSession(req, res, session);
                break;
            default:
                res.sendStatus(500); // Bad request
        }

    }).catch(() => {});
}

function updateSession(req: Request, res: Response, session: ExamSession) {

    /**
     * An exam session should not be modified when running or once terminated.
     */
    if(session.state != ExamSession.WAITING) {
        get(req, res, {errors: ["La session est en cours ou terminée. Vous ne pouvez pas modifier ses propriétés."]});
        return;
    }

    /**
     * We check if the request body is ok
     */
    let data = checkSentData(req.body);
    if(typeof data == "string") {
        res.status(500).send(data); // Bad request
        return;
    }

    let {subjectId, date, groupsIds} = data;

    const onCatch = (err: any) => {
        console.error(err);
        res.render("admin/admin-sessions-manage", {
            name: "Gérer une session d'examen",
            errors: ["Une erreur est survenue sur le serveur. Contactez un administrateur."]
        });
    };

    Subject.findByPk(subjectId).then((subject: Subject | null) => {

        /**
         * If the returned subject is null, it means no subject with the given id exists
         */
        if(subject == null) {
            get(req, res, {errors: ["Ce sujet n'existe pas"]});
            return null;
        }

        GroupParticipation.destroy({
            where: {
                ExamSessionId: session.id,
            }
        }).then(() => {

            return Group.findAll({
                where: {
                    id: {
                        [sq.Op.in]: groupsIds
                    }
                }
            });

        }).then((groups: Group[]) => {

            var groupsObjects: object[] = [];
            groups.forEach((group) => 
                groupsObjects.push({
                    GroupId: group.id,
                    ExamSessionId: session.id,
                })
            );

            return GroupParticipation.bulkCreate(groupsObjects);

        }).then(() => {

            return session.update({
                SubjectId: subject.id,
                date,
            });

        }).then(() => {

            get(req, res, {successes: ["La session d'examen a bien été mis à jour"]});

        }).catch(onCatch);

        return null;

    }).catch(onCatch);

}

function getExamSession(req: Request, res: Response): Promise<ExamSession> {
    
    /**
     * We check if the session id given in URL is an integer
     */
    let sessionId = parseInt(req.params.sessionId);
    if(isNaN(sessionId)) {
        res.status(404).render("404", {name: "Page introuvable"});
        return Promise.reject();
    }

    return new Promise((resolve, reject) => {

        /**
         * We search for an exam session with the passed id
         */
        ExamSession.findByPk(sessionId, {
            include: [Subject, Group]
        }).then((session: ExamSession | null) => {

            /**
             * If the returned exam session is null, it means no session with the given
             * id exists.
             */
            if(session == null) {
                res.render("404", {name: "Page introuvable"});
                reject();
                return;
            }

            resolve(session);

        }).catch((err: any) => {
            console.error(err);
            res.sendStatus(500);
            reject();
        });

        return null;
    });
}

export default {get, post};
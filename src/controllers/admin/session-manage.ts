import {Request, Response} from "express";
import {Subject, ExamSession, Group, Specialty, GroupParticipation} from "../../models";
import {checkSentData} from "./sessions-create";
import sq from "sequelize";
import sequelize from "../../models/connection";
import {io} from "../../app";

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
            case "start":
                startSession(req, res, session);
                break;
            case "stop":
                stopSession(req, res, session);
                break;
            case "delete":
                deleteSession(req, res, session);
                break;
            default:
                res.sendStatus(400); // Bad request
        }

    }).catch(() => {});
}

function deleteSession(req: Request, res: Response, session: ExamSession) {

    if(session.state == ExamSession.IN_PROGRESS) {
        return get(req, res, {errors: ["Impossible de supprimer cette session d'examen. La session d'examen est en cours."]});
    }
    
    session.destroy().then(() => {

        res.redirect("/admin/sessions");

    }).catch((err: any) => {
        console.error(err);
        res.render("admin/admin-sessions-manage", {
            name: "Gérer une session d'examen",
            errors: ["Une erreur est survenue sur le serveur. Contactez un administrateur."]
        });
    });

}

function stopSession(req: Request, res: Response, session: ExamSession) {

    /**
     * To be stopped, an exam session must be in IN_PROGRESS state
     */
    if(session.state != ExamSession.IN_PROGRESS) {
        return get(req, res, {errors: ["Impossible d'arrêter une session d'examen qui ne soit pas en cours."]});
    }

    session.update({
        state: ExamSession.FINISHED,
    }).then(() => {

        io.of("/student").to(`session-${session.id}`).emit("end");
    
        get(req, res, {successes: ["La session d'examen est maintenant terminée."]});
        
    }).catch((err: any) => {
        console.error(err);
        res.render("admin/admin-sessions-manage", {
            name: "Gérer une session d'examen",
            errors: ["Une erreur est survenue sur le serveur. Contactez un administrateur."]
        });
    });

}

function startSession(req: Request, res: Response, session: ExamSession) {

    /**
     * To be started, an exam session must be in WAITING state
     */
    if(session.state != ExamSession.WAITING) {
        return get(req, res, {errors: ["Seules les sessions d'examen en attente peuvent être lancées."]});
    }

    /**
     * Delete all stored answers from previous exam sessions for all users participating to this
     * exam session
     */
    sequelize.query(`DELETE FROM StudentAnswers
                     WHERE StudentAnswers.UserId IN (
                        SELECT Users.id
                        FROM Users
                        INNER JOIN UserGroups ON Users.id = UserGroups.UserId
                        INNER JOIN Groups ON UserGroups.GroupId = Groups.id
                        INNER JOIN GroupParticipations ON Groups.id = GroupParticipations.GroupId
                        WHERE GroupParticipations.ExamSessionId = ${session.id}
                    )`, {
                            raw: true,
                        }
    ).then(() => {
        return session.update({
            state: ExamSession.IN_PROGRESS,
        });
    }).then(() => {
        io.of("/student").to(`session-${session.id}`).emit("start");
        get(req, res, {successes: ["La session d'examen a bien été lancée"]});
    }).catch((err: any) => {
        console.error(err);
        res.render("admin/admin-sessions-manage", {
            name: "Gérer une session d'examen",
            errors: ["Une erreur est survenue sur le serveur. Contactez un administrateur."]
        });
    });

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
        res.status(400).send(data); // Bad request
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
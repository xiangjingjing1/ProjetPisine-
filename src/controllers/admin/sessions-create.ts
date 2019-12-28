import {Request, Response} from "express";
import {Subject, Specialty, ExamSession, Group, GroupParticipation} from "../../models";
import sq from "sequelize";

const DATE_FORMAT = /^\d{4}-\d{2}-\d{2}$/;
const TIME_FORMAT = /^\d{2}:\d{2}$/;

function get(req: Request, res: Response, otherData: object = {}) {

    const onCatch = (err: any) => {
        console.error(err);
        res.status(500).render("admin/admin-sessions-create", {
            name: "Créer une session d'examen",
            errors: ["Une erreur est survenue sur le serveur. Contactez un administrateur"],
        });
    };

    Subject.findAll({
        order: [["name", "ASC"]]
    }).then((subjects: Subject[]) => {

        Specialty.findAll({
            include: [Specialty.associations.groups],
            order: [["name", "ASC"], ["year", "ASC"]]
        }).then((specialties: Specialty[]) => {

            res.render("admin/admin-sessions-create", {
                name: "Créer une session d'examen",
                subjects,
                specialties,
                ...otherData
            });
            
        }).catch(onCatch);
            
    }).catch(onCatch);

}

/**
 * Handles the request which aims to create an exam session.
 * 
 * The request body must contain the following properties:
 *  - `subjectId`: an integer, the id for the subject of the session we want to create
 *  - `date`: a string, matches the format YYYY-MM-DD, the date the session should start
 *  - `time`: a string, matches the format HH-MM, the time the session should start
 *  - `groups`: a string, comma separated integers corresponding to the ids of the groups that will participate to session
 */
function post(req: Request, res: Response) {

    let query = req.body;

    /**
     * We check the request body has the required properties
     */
    if(query.subjectId == undefined || query.date == undefined || query.time == undefined || query.groups == undefined) {
        res.sendStatus(500); // Bad request
        return;
    }

    /**
     * We check if the given subject id is an integer
     */
    let subjectId = parseInt(query.subjectId);
    if(isNaN(subjectId)) {
        res.status(500).send("Invalid subject id"); // Bad request
        return;
    }

    /**
     * We check if the given date has the correct format
     */
    if(!DATE_FORMAT.test(query.date)) {
        res.status(500).send("Invalid date format"); // Bad request
        return;
    }

    /**
     * We check if the given time has the correct format
     */
    if(!TIME_FORMAT.test(query.time)) {
        res.status(500).send("Invalid time format"); // Bad request
        return;
    }

    /**
     * We check the given date is correct
     */
    let date = new Date(`${query.date} ${query.time}`);
    if(isNaN(date.getTime())) {
        res.status(500).send("Invalid date");
        return;
    }

    /**
     * We check if the given `groups` string is a comma separated list of integers
     */

    let groupIds = (query.groups as string).split(',').map((v) => parseInt(v));
    if(groupIds.find(isNaN) != undefined) {
        res.status(500).send("Invalid groups");
        return;
    }

    /**
     * We define a callback that will be used on internal errors
     */
    const onCatch = (err: any) => {
        console.error(err);
        get(req, res, {errors: ["Une erreur est survenue sur le serveur. Contactez un administrateur."]});
    };

    Subject.findByPk(subjectId).then((subject: Subject | null) => {

        /**
         * If the returned subject is null, it means no subject with the given id exists.
         * We don't create the session.
         */
        if(subject == null) {
            get(req, res, {errors: ["Ce sujet n'existe pas"]});
            return;
        }

        /**
         * We search the groups that have to participate to the session
         */
        Group.findAll({
            where: {
                id: {
                    [sq.Op.in]: groupIds
                }
            }
        }).then((groups: Group[]) => {
            
            /**
             * We create the exam session and setting its state to the default WAITING state
             */
            ExamSession.create({
                date,
                state: 0, // WAITING
                SubjectId: subjectId,
            }).then((exam: ExamSession) => {

                /**
                 * Mapping groups to their corresponding partipation object to
                 * create all rows in a single query
                 */
                let participations = groups.map((group) => ({
                    GroupId: group.id,
                    ExamSessionId: exam.id,
                }));

                GroupParticipation.bulkCreate(participations).then(() => {

                    res.redirect("/admin/sessions");

                }).catch(onCatch);

            }).catch(onCatch);

        }).catch(onCatch);

    }).catch(onCatch);

}

export default {get, post};
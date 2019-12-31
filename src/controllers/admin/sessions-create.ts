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

    Promise.all([
        Subject.findAll({
            order: [["name", "ASC"]]
        }),
        Specialty.findAll({
            include: [Specialty.associations.groups],
            order: [["name", "ASC"], ["year", "ASC"]]
        })
    ]).then(([subjects, specialties]: [Subject[], Specialty[]]) => {
        res.render("admin/admin-sessions-create", {
            name: "Créer une session d'examen",
            subjects,
            specialties,
            ...otherData
        });
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
     * We check the request body is ok
     */
    let data = checkSentData(query);
    if(typeof data == "string") {
        res.status(400).send(data); // Bad request
        return;
    }

    let {subjectId, date, groupsIds} = data;

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
            return null;
        }

        
        /**
         * We search the groups that have to participate to the session.
         * We create the exam session and setting its state to the default WAITING state.
         */
        Promise.all([
            Group.findAll({
                where: {
                    id: {
                        [sq.Op.in]: groupsIds
                    }
                }
            }),
            ExamSession.create({
                date,
                state: ExamSession.WAITING,
                SubjectId: subjectId,
            })
        ]).then(([groups, exam]: [Group[], ExamSession]) => {

            /**
             * Mapping groups to their corresponding partipation object to
             * create all rows in a single query
             */
            let participations = groups.map((group) => ({
                GroupId: group.id,
                ExamSessionId: exam.id,
            }));

            return Promise.all([Promise.resolve(exam.id), GroupParticipation.bulkCreate(participations)]);

        }).then(([id, _]) => {

            res.redirect(`/admin/sessions/${id}/manage`);

        }).catch(onCatch);

        return null;

    }).catch(onCatch);

}

/**
 * Checks if the data in the request body matches expectations
 * 
 * @returns the formatted data if everything's correct, else a string containing the error message
 */
function checkSentData(query: any): { subjectId: number, date: Date, groupsIds: number[] } | string {
    /**
     * We check the request body has the required properties
     */
    if(query.subjectId == undefined || query.date == undefined || query.time == undefined || query.groups == undefined) {
        return "Missing property";
    }

    /**
     * We check if the given subject id is an integer
     */
    let subjectId = parseInt(query.subjectId);
    if(isNaN(subjectId)) {
        return "Invalid subject id";
    }

    /**
     * We check if the given date has the correct format
     */
    if(!DATE_FORMAT.test(query.date)) {
        return "Invalid date format";
    }

    /**
     * We check if the given time has the correct format
     */
    if(!TIME_FORMAT.test(query.time)) {
        return "Invalid time format";
    }

    /**
     * We check the given date is correct
     */
    let date = new Date(`${query.date} ${query.time}`);
    if(isNaN(date.getTime())) {
        return "Invalid date";
    }

    /**
     * We check if the given `groups` string is a comma separated list of integers
     */

    var groupsIds: number[] = [];
    if(query.groups.length > 0) {
        groupsIds = (query.groups as string).split(',').map((v) => parseInt(v));
        if(groupsIds.find(isNaN) != undefined) {
            return "Invalid groups";
        }
    }

    return {
        subjectId,
        date,
        groupsIds
    };
}

export default {get, post};
export {checkSentData};
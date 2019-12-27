import {Request, Response} from "express";
import {Subject, CorrectAnswer} from "../../models";
import {checkQuestionsData, QUESTIONS_COUNT} from "./subjects-create";

function get(req: Request, res: Response, other: object = {}) {
    getSubject(req, res).then((subject: Subject) => {
        res.render("admin/admin-subjects-edit", {name: "Editer un sujet", subject, ...other});
    }).catch(() => {});
}

/**
 * Handles the request which aims to update a subject (its name and/or its answers).
 * 
 * The request body must containt the following properties:
 *  - `subjectName`: a non-empty string corresponding to the (new ?) subject's name
 *  for `X = 1` to `QUESTIONS_COUNT` (inclusive):
 *      - `questionX`: a integer corresponding to the correct answer for the question X for the subject we want to edit
 */
function post(req: Request, res: Response) {

    /**
     * We retrieve the subject using the id in the URL used to query this page
     */
    getSubject(req, res).then((subject: Subject) => {

        let query = req.body;

        /**
         * We check if the request body has the required properties
         */
        let result = checkQuestionsData(query);

        /**
         * If the check function returned a string and not `true`, it means
         * an error occured when checking request body properties
         */
        if(typeof result == "string") {
            get(req, res, {errors: [result]});
            return;
        }

        let newName = query.subjectName;

        /**
         * If the given name is different from the current subject's name, it means the name must be changed.
         * We then need to check if no other subject has the new name.
         */
        if(subject.name != newName) {

            /**
             * We try to find a subject with the given new name
             */
            Subject.findOne({
                where: {
                    name: newName,
                }
            }).then((otherSubject: Subject | null) => {

                /**
                 * If the returned subject is null, it means no subject with the new name exists.
                 */
                if(otherSubject == null) {

                    /**
                     * We update subject's name
                     */
                    subject.update({
                        name: newName
                    }).then(() => {

                        /**
                         * We update correct answers
                         */
                        updateAnswers(req, res, subject);

                    }).catch((err: any) => {
                        console.error(err);
                        get(req, res, {errors: ["Une erreur est survenue côté serveur. Contactez un administrateur."]}); 
                    });
                } else {
                    get(req, res, {errors: [`Le nom ${newName} existe déjà.`]});
                }
            });
        } else {

            /**
             * If subject's name doesn't require to be changed, we just need to update answers
             */
           updateAnswers(req, res, subject);

        }

    }).catch(() => {});
}

/**
 * This functions updates the answers for given subject. 
 */
function updateAnswers(req: Request, res: Response, subject: Subject) {

    /**
     * We collect in a list all values for answers rows to update all of them
     * in a single query
     */
    var answers: object[] = [];
    for(var i = 1; i <= QUESTIONS_COUNT; i++) {
        let value = req.body[`question${i}`];
        answers.push({
            num: i,
            answer: parseInt(value),
            subjectId: subject.id,
        });
    }

    /**
     * We update all answers in a single query.
     */
    CorrectAnswer.bulkCreate(answers, {
        updateOnDuplicate: ["answer"]
    }).then(() => {
        get(req, res, {successes: ["Le sujet a bien été mis à jour."]});
    }).catch((err: any) => {
        console.error(err);
        get(req, res, {errors: ["Une erreur est survenue côté serveur. Contactez un administrateur."]});  
    });
}

/**
 * Retrieves the subject we want to update or display.
 * 
 * To retrieve the subject it uses the `subjectId` parameter in the queried URL.
 */
function getSubject(req: Request, res: Response): Promise<Subject> {

    return new Promise((resolve, reject) => {

        /**
         * We check if the given id in the URL is an integer
         */
        let subjectId = parseInt(req.params.subjectId);
        if(isNaN(subjectId)) {
            res.sendStatus(400); // Bad request
            return reject();
        }

        /**
         * We search for a subject with the given id.
         */
        Subject.findOne({
            where: {
                id: subjectId
            },
            include: [Subject.associations.answers],
            order: [[{model: CorrectAnswer, as: "answers"}, "num", "ASC"]]
        }).then((subject: Subject) => {

            /**
             * If the returned subject is null, it means no subject with the given id exists
             */
            if(subject == null) {
                res.status(404).render("404", {name: "Page introuvable", errors: ["Ce sujet n'existe pas."]});
                return reject();
            }

            resolve(subject);

        }).catch((err: any) => {
            console.error(err);
            res.status(500).render("404", {name: "Page introuvable", errors: ["Une erreur est survenue sur le serveur. Contactez un administrateur."]});
            return reject();
        });
    });
}

export default {get, post};
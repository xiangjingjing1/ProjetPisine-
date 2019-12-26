import {Request, Response} from "express";
import {Subject, CorrectAnswer} from "../../models";
import {checkQuestionsData, QUESTIONS_COUNT} from "./subjects-create";

function get(req: Request, res: Response, other: object = {}) {
    getSubject(req, res).then((subject: Subject) => {
        res.render("admin/admin-subjects-edit", {name: "Editer un sujet", subject, ...other});
    }).catch(() => {});
}

function post(req: Request, res: Response) {
    getSubject(req, res).then((subject: Subject) => {

        let query = req.body;
        let result = checkQuestionsData(query);

        if(typeof result == "string") {
            get(req, res, {errors: [result]});
            return;
        }

        let newName = query.subjectName;

        if(subject.name != newName) { // Admin wants to change subject name
            Subject.findOne({
                where: {
                    name: newName,
                }
            }).then((otherSubject: Subject) => {
                if(otherSubject == null) { // No subject with the new name exists
                    subject.update({
                        name: newName
                    }).then(() => {
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
           updateAnswers(req, res, subject);
        }

    }).catch(() => {});
}

function updateAnswers(req: Request, res: Response, subject: Subject) {
    var answers: object[] = [];
    for(var i = 1; i <= QUESTIONS_COUNT; i++) {
        let value = req.body[`question${i}`];
        answers.push({
            num: i,
            answer: parseInt(value),
            subjectId: subject.id,
        });
    }
    CorrectAnswer.bulkCreate(answers, {
        updateOnDuplicate: ["answer"]
    }).then(() => {
        get(req, res, {successes: ["Le sujet a bien été mis à jour."]});
    }).catch((err: any) => {
        console.error(err);
        get(req, res, {errors: ["Une erreur est survenue côté serveur. Contactez un administrateur."]});  
    });
}

function getSubject(req: Request, res: Response): Promise<Subject> {

    return new Promise((resolve, reject) => {

        let subjectId = parseInt(req.params.subjectId);
        if(isNaN(subjectId)) {
            res.status(404).render("404", {name: "Page introuvable", errors: ["Ce sujet n'existe pas."]});
            return reject();
        }

        Subject.findOne({
            where: {
                id: subjectId
            },
            include: [Subject.associations.answers],
            order: [[{model: CorrectAnswer, as: "answers"}, "num", "ASC"]]
        }).then((subject: Subject) => {

            if(subject == null) {
                res.status(404).render("404", {name: "Page introuvable", errors: ["Ce sujet n'existe pas."]});
                return reject();
            }

            resolve(subject);

        }).catch((err: any) => {
            console.error(err);
            res.status(404).render("404", {name: "Page introuvable", errors: ["Une erreur est survenue sur le serveur. Contactez un administrateur."]});
            return reject();
        });
    });
}

export default {get, post};
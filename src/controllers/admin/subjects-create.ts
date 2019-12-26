import {Request, Response} from "express";
import {Subject, CorrectAnswer} from "../../models";

const QUESTIONS_COUNT = 5; // TODO: Change questions count

function get(req: Request, res: Response, other: object = {}) {
    res.render("admin/admin-subjects-create", {"name": "Créer un sujet d'examen", ...other});
}

function post(req: Request, res: Response) {

    let query = req.body;
    let result: true | string = checkQuestionsData(query);
    
    if(typeof result == "string") {
        get(req, res, {errors: [result]});
        return;
    }

    const onCatch = (err: any) => {
        console.error(err);
        get(req, res, {errors: ["Une erreur est survenue côté serveur. Contactez un administrateur."]});  
    };

    Subject.findOne({
        where: {
            name: query.subjectName
        }
    }).then((subject: Subject) => {
        
        if(subject != null) { // A subject with this name already exists 
            get(req, res, {errors: [`Un sujet avec le nom ${query.subjectName} existe déjà. Veuillez choisir un autre nom.`]});
            return;
        }

        return Subject.create({
            name: query.subjectName,
        }).then((subject: Subject) => {
            
            var answers: object[] = [];
            for(var i = 1; i <= QUESTIONS_COUNT; i++) {
                let value = query[`question${i}`];
                answers.push({
                    num: i,
                    answer: parseInt(value),
                    subjectId: subject.id,
                });
            }

            
            CorrectAnswer.bulkCreate(answers).then(() => {

                res.redirect("/admin/subjects");

            }).catch((err: any) => {
                subject.destroy()
                .then(() => onCatch(err))
                .catch((e: any) => {
                    console.error(e);
                    onCatch(err);
                });
            });

        }).catch(onCatch);

    }).catch(onCatch);
}

function checkQuestionsData(data: any): true | string {
    var i = 1;
    var missingQuestion = false;
    let query = data;
    
    while(!missingQuestion && i <= QUESTIONS_COUNT) {
        let data = query[`question${i}`];
        if(data == undefined) {
            missingQuestion = true;
        } else {
            let value = parseInt(data);
            if(isNaN(value) || value < 1 || value > 4) { // Provided answer is incorrect (not a number or an invalid number)
                missingQuestion = true;
            }
        }
        i++;
    }

    if(missingQuestion) {
        return "Au moins une réponse à une question n'a pas été indiquée.";
    }

    if(query["subjectName"] == undefined || query["subjectName"].length == 0) {
        return "Il faut indiquer un nom au sujet.";
    }

    return true;
}

export default {get, post};
export {QUESTIONS_COUNT, checkQuestionsData};
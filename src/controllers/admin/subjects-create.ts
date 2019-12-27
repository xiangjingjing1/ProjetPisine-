import {Request, Response} from "express";
import {Subject, CorrectAnswer} from "../../models";

const QUESTIONS_COUNT = 5; // TODO: Change questions count

function get(req: Request, res: Response, other: object = {}) {
    res.render("admin/admin-subjects-create", {"name": "Créer un sujet d'examen", ...other});
}

/**
 * Handles the request which aims to create a subject.
 * 
 * The request body must containt the following properties:
 *  - `subjectName`: a non-empty string corresponding to the subject's name
 *  for `X = 1` to `QUESTIONS_COUNT` (inclusive):
 *      - `questionX`: a integer corresponding to the correct answer for the question X for the subject we want to create
 */
function post(req: Request, res: Response) {

    let query = req.body;

    /**
     * We check if the request body contains the required properties
     */
    let result: true | string = checkQuestionsData(query);
    
    /**
     * If the check function returned a string and not `true`, it means
     * some errors occured when inspecting request body properties
     */
    if(typeof result == "string") {
        get(req, res, {errors: [result]});
        return;
    }

    /**
     * We define a callback that will be called on internal errors
     */
    const onCatch = (err: any) => {
        console.error(err);
        get(req, res, {errors: ["Une erreur est survenue côté serveur. Contactez un administrateur."]});  
    };

    /**
     * We search for a subject with the given name
     */
    Subject.findOne({
        where: {
            name: query.subjectName
        }
    }).then((subject: Subject | null) => {
        
        /**
         * If the returned subject is not null, it means a subject with the given name
         * already exist, we want subjects name to be unique.
         */
        if(subject != null) {
            get(req, res, {errors: [`Un sujet avec le nom ${query.subjectName} existe déjà. Veuillez choisir un autre nom.`]});
            return;
        }

        /**
         * Returned subject is null, it means we can create a subject with the given name
         */
        Subject.create({
            name: query.subjectName,
        }).then((subject: Subject) => {
            
            /**
             * We collect correct answers in a list to create all rows in a single query.
             * For each answer we need to specify the number of the question (from 1 to QUESTIONS_COUNT both inclusives),
             * the correct answer (A, B, C or D, @see CorrectAnswer#answer for more info) and the subject id.
             */
            var answers: object[] = [];
            for(var i = 1; i <= QUESTIONS_COUNT; i++) {
                let value = query[`question${i}`];
                answers.push({
                    num: i,
                    answer: parseInt(value),
                    subjectId: subject.id,
                });
            }

            /**
             * We insert all correct answers using a single query
             */
            CorrectAnswer.bulkCreate(answers).then(() => {

                res.redirect("/admin/subjects");

            }).catch((err: any) => {

                /**
                 * If a problem occured when inserting rows, we want to delete the subject
                 */
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

/**
 * This function checks if the given data respect the constraints.
 * For more information on constraints @see post
 * 
 * @returns `true` if all constraints are validated, else returns an error message describing the problem
 */
function checkQuestionsData(data: any): true | string {
    var i = 1;
    var missingQuestion = false;
    let query = data;
    
    while(!missingQuestion && i <= QUESTIONS_COUNT) {
        let data = query[`question${i}`];

        /**
         * We check if the answer for the question `i` is present
         */
        if(data == undefined) {
            missingQuestion = true;
        } else {

            /**
             * We check if the answer for the question `i` is an integer between 1 and 4 (both inclusive)
             */
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

    /**
     * We check if the given subject name is present and is a non-empty string
     */
    if(query["subjectName"] == undefined || query["subjectName"].length == 0) {
        return "Il faut indiquer un nom au sujet.";
    }

    return true;
}

export default {get, post};
export {QUESTIONS_COUNT, checkQuestionsData};
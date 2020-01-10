import {Request, Response} from "express";

function get(req: Request, res: Response){
    res.render('student/student-progress',{
        name: 'Progression'
    });
}

export default {get};
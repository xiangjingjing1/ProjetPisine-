import {Request, Response} from "express";



function get(req:Request, res:Response){
    res.render('student/student-progress',{
        name: 'my progress'
    });
}

export default {get};
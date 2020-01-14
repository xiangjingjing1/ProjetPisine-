import {Request, Response} from "express";

function get(req: Request, res: Response) {
    res.render('student/profil');
}

export default {get};

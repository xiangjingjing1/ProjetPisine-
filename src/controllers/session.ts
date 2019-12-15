import {Request, Response} from "express";

function get(req: Request, res: Response) {
    res.render("session/student", { name: "Session d'examen" });
}

export default { get };
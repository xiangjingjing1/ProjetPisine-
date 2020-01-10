import {Request, Response} from "express";

function get(req: Request, res: Response) {
    res.render("admin/admin-stats", {name: "Statistiques"});
}

export default {get};
import {Request, Response} from "express";

function get(req: Request, res: Response) {
    res.render('admin/admin-index');
}

export default {get};

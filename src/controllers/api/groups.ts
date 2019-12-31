import {Request, Response} from "express";
import {Group} from "../../models";

function get(req: Request, res: Response) {
    Group.findAll().then((groups: Group[]) => {
        let json = groups.map((group) => {
            return { num: group.num, specialty: group.specialtyId, id: group.id};
        });
        res.json(json);
    }).catch((err: any) => {
        console.error(err);
        res.sendStatus(501);
    });
}

export default {get};
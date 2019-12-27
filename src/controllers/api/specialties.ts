import {Request, Response} from "express";
import {Specialty} from "../../models";

function get(req: Request, res: Response) {
    Specialty.findAll({
        order: [["name", "ASC"]]
    }).then((specialties: Specialty[]) => {
        let json = specialties.map((specialty) => {
            return { name: specialty.name, year: specialty.year, id: specialty.id };
        });
        res.json(json);
    }).catch((err: any) => {
        console.error(err);
        res.sendStatus(500);
    });
}

export default {get};
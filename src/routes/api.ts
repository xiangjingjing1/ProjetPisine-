import {Express} from "express";
import * as models from "../models";

function registerRoutes(app: Express) {
    // List all groups
    app.get('/api/groups/', (req, res) => {
        models.Group.findAll().then((groups) => {
            let json = groups.map((group) => {
                return { num: group.num, specialty: group.specialtyId, id: group.id};
            });
            res.json(json);
        });
    });


    // List all specialties
    app.get("/api/specialties", (req, res) => {
        models.Specialty.findAll({
            order: [["name", "ASC"]]
        }).then((specialties) => {
            let json = specialties.map((specialty) => {
                return { name: specialty.name, year: specialty.year, id: specialty.id };
            });
            res.json(json);
        });
    });
    
}

export default registerRoutes;
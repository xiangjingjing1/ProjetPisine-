import {Express} from "express";
import groups from "../controllers/admin/groups";

function registerRoutes(app: Express) {

    app.get("/admin/groups", (req, res) => groups.get(req, res));
    app.post("/admin/groups", (req, res) => groups.post(req, res));

}

export default registerRoutes;
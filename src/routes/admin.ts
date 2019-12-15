import {Express} from "express";
import groups from "../controllers/admin/groups";
import {ensureLoggedIn} from "connect-ensure-login";
import {ensureAdmin} from "../middlewares/admin-middleware";

function registerRoutes(app: Express) {

    app.get("/admin/groups", 
        ensureLoggedIn(), 
        ensureAdmin(), 
        (req, res) => groups.get(req, res)
    );
    app.post("/admin/groups", ensureLoggedIn(), ensureAdmin(), (req, res) => groups.post(req, res));

}

export default registerRoutes;
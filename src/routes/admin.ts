import {Express} from "express";
import groups from "../controllers/admin/groups";
import {ensureLoggedIn} from "connect-ensure-login";
import {ensureAdmin} from "../middlewares/admin-middleware";

function registerRoutes(app: Express) {

    app.get("/admin/groups", 
        ensureLoggedIn(), 
        ensureAdmin(), 
        groups.get
    );
    app.post("/admin/groups", ensureLoggedIn(), ensureAdmin(), groups.post);

}

export default registerRoutes;
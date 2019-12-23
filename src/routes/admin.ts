import {Express} from "express";
import groups from "../controllers/admin/groups";
import {ensureLoggedIn} from "connect-ensure-login";
import {ensureAdmin} from "../middlewares/admin-middleware";
import subjectsDisplay from "../controllers/admin/subjects-display";
import subjectsCreate from "../controllers/admin/subjects-create";

function registerRoutes(app: Express) {

    app.get("/admin/groups", ensureLoggedIn(), ensureAdmin(), groups.get);
    app.post("/admin/groups", ensureLoggedIn(), ensureAdmin(), groups.post);

    app.get("/admin/subjects", /*ensureLoggedIn(), ensureAdmin(), */subjectsDisplay.get);
    app.post("/admin/subjects",/* ensureLoggedIn(), ensureAdmin(),*/ subjectsDisplay.post);

    app.get("/admin/subjects/create", /*ensureLoggedIn(), ensureAdmin(), */subjectsCreate.get);
    app.post("/admin/subjects/create", /*ensureLoggedIn(), ensureAdmin(), */subjectsCreate.post);

}

export default registerRoutes;
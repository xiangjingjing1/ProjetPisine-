import {Express} from "express";
import groups from "../controllers/admin/groups";
import {ensureLoggedIn} from "connect-ensure-login";
import {ensureAdmin} from "../middlewares/admin-middleware";
import subjectsDisplay from "../controllers/admin/subjects-display";
import subjectsCreate from "../controllers/admin/subjects-create";
import subjectsEdit from "../controllers/admin/subjects-edit";
import subjectsDelete from "../controllers/admin/subjects-delete";

function registerRoutes(app: Express) {

    app.get("/admin/groups", ensureLoggedIn(), ensureAdmin(), groups.get);
    app.post("/admin/groups", ensureLoggedIn(), ensureAdmin(), groups.post);

    app.get("/admin/subjects", ensureLoggedIn(), ensureAdmin(), subjectsDisplay.get);
    app.post("/admin/subjects", ensureLoggedIn(), ensureAdmin(), subjectsDisplay.post);

    app.get("/admin/subjects/create", ensureLoggedIn(), ensureAdmin(), subjectsCreate.get);
    app.post("/admin/subjects/create", ensureLoggedIn(), ensureAdmin(), subjectsCreate.post);

    app.get("/admin/subjects/:subjectId/edit", ensureLoggedIn(), ensureAdmin(), subjectsEdit.get);
    app.post("/admin/subjects/:subjectId/edit", ensureLoggedIn(), ensureAdmin(), subjectsEdit.post);

    app.post("/admin/subjects/:subjectId/delete", ensureLoggedIn(), ensureAdmin(), subjectsDelete.post);

}

export default registerRoutes;
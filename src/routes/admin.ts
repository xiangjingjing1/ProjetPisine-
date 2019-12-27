import {Express} from "express";
import groups from "../controllers/admin/groups";
import {ensureLoggedIn} from "connect-ensure-login";
import {ensureAdmin} from "../middlewares/admin-middleware";
import subjectsDisplay from "../controllers/admin/subjects-display";
import subjectsCreate from "../controllers/admin/subjects-create";
import subjectsEdit from "../controllers/admin/subjects-edit";
import subjectsDelete from "../controllers/admin/subjects-delete";

/**
 * Registers all routes relative to administration.
 */
function registerRoutes(app: Express) {

    /**
     * These routes lead to pages to manage (create, delete, display) specialties and groups.
     */
    app.get("/admin/groups", ensureLoggedIn(), ensureAdmin(), groups.get);
    app.post("/admin/groups", ensureLoggedIn(), ensureAdmin(), groups.post);

    /**
     * This route leads to page displaying all existing subjects.
     */
    app.get("/admin/subjects", ensureLoggedIn(), ensureAdmin(), subjectsDisplay.get);

    /**
     * These routes allow to create a subject.
     */
    app.get("/admin/subjects/create", ensureLoggedIn(), ensureAdmin(), subjectsCreate.get);
    app.post("/admin/subjects/create", ensureLoggedIn(), ensureAdmin(), subjectsCreate.post);

    /**
     * These routes allow administrator to edit a subject (edit its name and its answers).
     */
    app.get("/admin/subjects/:subjectId/edit", ensureLoggedIn(), ensureAdmin(), subjectsEdit.get);
    app.post("/admin/subjects/:subjectId/edit", ensureLoggedIn(), ensureAdmin(), subjectsEdit.post);

    /**
     * These route is used to delete a subject.
     */
    app.post("/admin/subjects/:subjectId/delete", ensureLoggedIn(), ensureAdmin(), subjectsDelete.post);

}

export default registerRoutes;
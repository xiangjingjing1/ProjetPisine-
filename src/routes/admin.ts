import {Express, Router} from "express";
import groups from "../controllers/admin/groups";
import {ensureLoggedIn} from "connect-ensure-login";
import {ensureAdmin} from "../middlewares/admin-middleware";
import subjectsDisplay from "../controllers/admin/subjects-display";
import subjectsCreate from "../controllers/admin/subjects-create";
import subjectsEdit from "../controllers/admin/subjects-edit";
import subjectsDelete from "../controllers/admin/subjects-delete";
import sessionsDisplay from "../controllers/admin/sessions-display";
import sessionsCreate from "../controllers/admin/sessions-create";
import sessionManage from "../controllers/admin/session-manage";

/**
 * Registers all routes relative to administration.
 */
function registerRoutes(app: Express) {

    var router = Router();

    /**
     * All routes enduer /admin requires user to be logged in and to be an admin
     */
    router.use(ensureLoggedIn());
    router.use(ensureAdmin());

    /**
     * These routes lead to pages to manage (create, delete, display) specialties and groups.
     */
    router.get("/groups", groups.get);
    router.post("/groups", groups.post);

    /**
     * This route leads to page displaying all existing subjects.
     */
    router.get("/subjects", subjectsDisplay.get);

    /**
     * These routes allow to create a subject.
     */
    router.get("/subjects/create", subjectsCreate.get);
    router.post("/subjects/create", subjectsCreate.post);

    /**
     * These routes allow administrator to edit a subject (edit its name and its answers).
     */
    router.get("/subjects/:subjectId/edit", subjectsEdit.get);
    router.post("/subjects/:subjectId/edit", subjectsEdit.post);

    /**
     * This route is used to delete a subject.
     */
    router.post("/subjects/:subjectId/delete", subjectsDelete.post);

    /**
     * This route leads to page displaying all exam sessions.
     */
    router.get("/sessions", sessionsDisplay.get);

    /**
     * These routes allows administrator to create an exam session.
     */
    router.get("/sessions/create", sessionsCreate.get);
    router.post("/sessions/create", sessionsCreate.post);
    
    /**
     * These routes allows administrator to manage an exam session (modify subject, datetime, participating groups but
     * also starting, remove and stop it).
     */
    router.get("/sessions/:sessionId/manage", sessionManage.get);
    router.post("/sessions/:sessionId/manage", sessionManage.post);

    app.use("/admin", router);
}

export default registerRoutes;
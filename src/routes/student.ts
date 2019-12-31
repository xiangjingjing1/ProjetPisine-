import { Express, Router } from "express";
import sessionDisplay from "../controllers/student/session-display";
import sessionList from "../controllers/student/session-list";
import {ensureLoggedIn} from "connect-ensure-login";

/**
 * Registers routes used for exam sessions.
 */
function registerRoutes(app: Express) {

    let router = Router();

    /**
     * This route leads to a page which will list all sessions the user can participate or did participate.
     */
    router.get("/sessions", ensureLoggedIn(), sessionList.get);
    
    /**
     * This route leads to page where student can answer to questions.
     */
    router.get("/sessions/:id", ensureLoggedIn(), sessionDisplay.get);

    app.use("/student", router);
}

export default registerRoutes;
import { Express } from "express";
import sessionDisplay from "../controllers/session/session-display";
import sessionList from "../controllers/session/session-list";
import {ensureLoggedIn} from "connect-ensure-login";

/**
 * Registers routes used for exam sessions.
 */
function registerRoutes(app: Express) {

    /**
     * This route redirects user to the sessions list.
     */
    app.get("/", ensureLoggedIn(), (req, res) => res.redirect("/sessions"));

    /**
     * This route leads to a page which will list all sessions the user can participate or did participate.
     */
    app.get("/sessions", ensureLoggedIn(), sessionList.get);
    
    /**
     * This route leads to page where student can answer to questions.
     */
     app.get("/sessions/:id", ensureLoggedIn(), sessionDisplay.get);

}

export default registerRoutes;
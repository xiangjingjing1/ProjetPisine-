import { Express, Router } from "express";
import sessionDisplay from "../controllers/student/session-display";
import sessionList from "../controllers/student/session-list";
import {ensureLoggedIn} from "connect-ensure-login";
import {ensureStudent} from "../middlewares/admin-middleware";
import stats from "../controllers/student/stats-student";
import profil from "../controllers/student/student-index";
import updatepassword from "../controllers/student/profil-password";
/**
 * Registers routes used for exam sessions.
 */
function registerRoutes(app: Express) {

    let router = Router();

    /**
     * Set middlewares for students routes
     */
    router.use(ensureLoggedIn());
    router.use(ensureStudent());

    /**
     * This route leads to a page which will list all sessions the user can participate or did participate.
     */
    router.get("/sessions", sessionList.get);

    /**
     * This route leads to page where student can answer to questions.
     */
    router.get("/sessions/:id", sessionDisplay.get);
    router.post("/sessions/:id", sessionDisplay.post);

    router.get("/stats", stats.get);

    router.get("/profil", profil.get);
    /**
    * Modification password
    */
    router.get("/updatepassword", updatepassword.get);
    app.use("/student", router);

}

export default registerRoutes;

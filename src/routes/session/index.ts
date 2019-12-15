import { Express } from "express";
import session from "../../controllers/session";
import {ensureLoggedIn} from "connect-ensure-login";

function registerRoutes(app: Express) {
    app.get("/session/:id/", ensureLoggedIn(), (req, res) => session.get(req, res));
}

export default registerRoutes;
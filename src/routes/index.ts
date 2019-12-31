import { Express } from "express";
import authRoutes from "./auth";
import apiRoutes from "./api";
import studentRoutes from "./student";
import adminRoutes from "./admin";
import {ensureLoggedIn} from "connect-ensure-login";
import {User} from "../models";

function registerRoutes(app: Express) {

    app.get("/", ensureLoggedIn(), (req, res) => {
        if((req.user as User).isAdmin) {
            res.redirect("/admin/session");
        } else {
            res.redirect("/student/session");
        }
    });

    authRoutes(app);
    apiRoutes(app);
    studentRoutes(app);
    adminRoutes(app);
}

export default registerRoutes;
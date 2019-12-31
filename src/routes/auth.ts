import { Express } from "express";
import register from "../controllers/auth/register";
import login from "../controllers/auth/login";
import {ensureLoggedOut} from 'connect-ensure-login';

/**
 * Registers all routes relative to authentication.
 */
function registerRoutes(app: Express) {

    /**
     * These routes lead to a page allowing basic user to register.
     *  GET: will display page
     *  POST: will handle registering request
     */
    app.get('/register', ensureLoggedOut(), register.get);
    app.post("/register", ensureLoggedOut(), register.post);

    /**
     * Theses routes lead to a page allowing all users to log in.
     *  GET: will display page
     *  POST: will handle login request
     */
    app.get('/login', ensureLoggedOut(), login.get);
    app.post('/login', ensureLoggedOut(), login.post);

    /**
     * This route will logout the user if this one is connected.
     */
    app.get('/logout', (req, res) => {
        req.logout();
        res.redirect("/login");
    });

}

export default registerRoutes;
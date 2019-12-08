import { Express } from "express";
import passport from 'passport';
import onUserRegister from "../controllers/register";
import {ensureLoggedOut} from 'connect-ensure-login';

function registerRoutes(app: Express) {

    // Register routes
    app.get('/register', ensureLoggedOut(), (req, res) => {
        res.render('register', { name: "S'inscrire" });
    });

    app.post("/register", ensureLoggedOut(), (req, res) => {
        onUserRegister(req, res);
    });

    // Login routes
    app.get('/login', ensureLoggedOut(), (req, res) => {
        res.render('login', { 
            name: "Se connecter", 
            successes: req.query.fromRegister !== undefined ? ["Vous êtes inscrit. Vous pouvez maintenant vous connecter."] : [],
            errors: req.query.error !== undefined ? ["Mauvaise combinaison email/mot de passe. Ré-essayez."] : [],
        });
    });

    app.post('/login', ensureLoggedOut(), passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login?error'
    }));

    // Logout route
    app.get('/logout', (req, res) => {
        req.logout();
        res.redirect("/login");
    });

}

export default registerRoutes;
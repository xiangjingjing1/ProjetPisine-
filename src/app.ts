import express from "express";
import * as models from './models';
import passport from 'passport';
import exphbs from 'express-handlebars';
import setupMiddlewares from './middlewares';
import {ensureLoggedIn, ensureLoggedOut} from 'connect-ensure-login';
import helpers from "./helpers";
import onUserRegister from "./controllers/register";

const app = express();
const port = 8000;

models.init().then(() => {
    /**
     * Configurate server
     */
    app.engine('handlebars', exphbs({
        helpers,
    }));

    app.set('view engine', 'handlebars');
    app.set('views', __dirname + '/../src/views');

    setupMiddlewares(app);

    /**
     * Define routes
     */
    app.get('/', ensureLoggedIn(), (req, res) => res.render('index', { name: "Tableau de bord" }));

    app.get('/register', ensureLoggedOut(), (req, res) => {
        res.render('register', { name: "S'inscrire" });
    });
    app.post("/register", ensureLoggedOut(), (req, res) => {
        onUserRegister(req, res);
    });

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
<<<<<<< HEAD
    
    app.get('/logout', (req, res) => {
        req.logout();
        res.redirect("/login");
    });

    app.get('/profil', ensureLoggedIn(), (req, res) => res.render('profil', { name: "Profil" }));


    /////////////////////////////////
    ///////// API Routes ////////////
    /////////////////////////////////

    app.get('/api/groups/', (req, res) => {
        models.Group.findAll().then((groups) => {
            let json = groups.map((group) => {
                return { num: group.num, specialty: group.specialtyId, id: group.id};
            });
            res.json(json);
        });
    });

    app.get("/api/specialties", (req, res) => {
        models.Specialty.findAll({
            order: [["name", "ASC"]]
        }).then((specialties) => {
            let json = specialties.map((specialty) => {
                return { name: specialty.name, year: specialty.year, id: specialty.id };
            });
            res.json(json);
        });
    });

=======
    app.get('/login', ensureLoggedOut() ,(req, res) => res.render('login', { name: "Se connecter" }));
    app.get('/', ensureLoggedIn(), (req, res) => res.render('index', { name: "Tableau de bord" }));
    app.get('/profil', ensureLoggedIn(), (req, res) => res.render('profil', { name: "Profil", user: req.user }));
    app.get('/qcm', (req, res) => res.render('qcm', {
        name: "QCM",
        questions: [0, 1,2]
    }));
>>>>>>> lucas
    /**
     * Start server
     */

    app.listen(port, () => console.log(`Server listening on port ${port}`));
});

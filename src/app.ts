import express from "express";
import * as models from './models';
import passport from 'passport';
import exphbs from 'express-handlebars';
import setupMiddlewares from './middlewares';
import {ensureLoggedIn, ensureLoggedOut} from 'connect-ensure-login';

const app = express();
const port = 8000;

models.init().then(() => {
    /**
     * Configurate server
     */
    app.engine('handlebars', exphbs());

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

    app.get('/login', ensureLoggedOut(), (req, res) => res.render('login', { name: "Se connecter" }));
    app.post('/login', ensureLoggedOut(), passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login'
    }));
    
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

    /**
     * Start server
     */

    app.listen(port, () => console.log(`Server listening on port ${port}`));
});

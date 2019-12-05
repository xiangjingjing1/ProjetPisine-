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

    app.post('/login', ensureLoggedOut(), passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login'
    }));
    app.get('/login', ensureLoggedOut() ,(req, res) => res.render('login', { name: "Se connecter" }));
    app.get('/', ensureLoggedIn(), (req, res) => res.render('index', { name: "Tableau de bord" }));
    app.get('/profil', ensureLoggedIn(), (req, res) => res.render('profil', { name: "Profil", user: req.user }));
    app.get('/qcm', (req, res) => res.render('qcm', {
        name: "QCM",
        questions: [0, 1,2]
    }));
    /**
     * Start server
     */

    app.listen(port, () => console.log(`Server listening on port ${port}`));
});

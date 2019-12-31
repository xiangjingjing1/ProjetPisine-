import {Request, Response} from "express";
import passport from 'passport';

function get(req: Request, res: Response) {
    res.render('auth/login', { 
        name: "Se connecter", 
        successes: req.query.fromRegister !== undefined ? ["Vous êtes inscrit. Vous pouvez maintenant vous connecter."] : [],
        errors: req.query.error !== undefined ? ["Mauvaise combinaison email/mot de passe. Ré-essayez."] : [],
    });
}

function post(req: Request, res: Response) {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login?error'
    })(req, res);
}

export default {get, post};
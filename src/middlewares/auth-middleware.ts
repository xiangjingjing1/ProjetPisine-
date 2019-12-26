import {Express} from 'express';
import passport from 'passport';
import {Strategy as LocalStrategy} from 'passport-local';
import session from 'express-session';
import {User} from '../models';
import sequelize from "../models/connection";
import sqSessionStore from "connect-session-sequelize";

export default function setupAuthMiddleware(app: Express) {
    /**
     * Set strategy to check user credentials.
     */
    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
    }, (email, password, done) => {
        User.findOne({
            where: {
                email,
            }
        }).then((user: User) => {
            if(user != null && user.checkPassword(password)) {
                done(null, user);
            } else {
                done(null, false, {message: 'Incorrect email/password combination !'});
            }
        }).catch((err: any) => {
            done(err, false, {message: 'Internal error'});
        });
    }));
    
    /**
     * Indicates passport how to serialize and deserialize user. We use user id as identifier.
     */
    passport.serializeUser((user: User, done) => {
        done(null, user.id);
    });
    
    passport.deserializeUser((id: number, done) => {
        User.findByPk(id).then((user: User) => {
            done(null, user);
        }).catch((err: any) => {
            done(err, false);
        });
    });

    /**
     * Middleware allowing to store data on session
     * ie. :
     *  ```
     *  app.get('/foo', (req, res) => {
     *      if(!req.session.timesQueriedFoo) {
     *          req.session.timesQueriedFoo = 0
     *      }
     *      req.session.timesQueriedFoo += 1
     *  });
     *  ```
     */

    const SequelizeStore = sqSessionStore(session.Store);
    const store = new SequelizeStore({
        db: sequelize,
    });

    app.use(session({ 
        secret: 'secret_passphrase', // TODO : Load from config file or env variable
        resave: false, // When set to true, it forces session to be saved to the session store, even if the session was never modified during request
        saveUninitialized: false, // When to true, it forces uninitialized sessions (new session but not modified) to be saved to the store
        store: (store as session.Store),
    }));

    store.sync();

    /**
     * Indicate express to use passport middlewares
     */
    app.use(passport.initialize());
    app.use(passport.session());

    /**
     * Used to be able to access user object in template files
     */
    app.use((req, res, next) => {
        res.locals.user = req.user;
        next();
    });
}
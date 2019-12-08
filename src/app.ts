import express from "express";
import * as models from './models';
import exphbs from 'express-handlebars';
import setupMiddlewares from './middlewares';
import {ensureLoggedIn, ensureLoggedOut} from 'connect-ensure-login';
import helpers from "./helpers";
import registerRoutes from "./routes";

const app = express();
const port = 8000;

models.init().then(() => {

    /**
     * Configure server.
     * We define the template engine to use. We also tell where views files are located.
     */
    app.engine('handlebars', exphbs({
        helpers,
    }));

    app.set('view engine', 'handlebars');
    app.set('views', __dirname + '/../src/views');

    /**
     * Setup middlewares.
     * It defines middlewares that retrieves authed user, parses form body, serves static files.
     */

    setupMiddlewares(app);

    /**
     * Define routes.
     * It mainly defines routes for GET and POST methods.
     */

    registerRoutes(app);

    /**
     * Start server
     */

    app.listen(port, () => console.log(`Server listening on port ${port}`));
});

import express from "express";
import * as models from './models';
import exphbs from 'express-handlebars';
import setupMiddlewares from './middlewares';
import helpers from "./helpers";
import registerRoutes from "./routes";
import SocketIO from "socket.io";
import http from "http";
import wsController from "./controllers/ws";

const app = express();
const server = http.createServer(app);
const io = SocketIO(server);
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

    setupMiddlewares(app, io);

    /**
     * Define routes.
     * It mainly defines routes for GET and POST methods.
     */

    registerRoutes(app);

    /**
     * Define controllers for websocket
     */
    wsController.init(io);

    /**
     * Start server
     */

    server.listen(port, () => console.log(`Server listening on port ${port}`));
});

export {app, server, io};
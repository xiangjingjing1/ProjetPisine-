import {Express, static as staticMiddleware} from 'express';
import setAuthMiddlewares from './auth-middleware';
import setParserMiddlewares from './parser-middleware';
import helmet from "helmet";

export default function setupMiddlewares(app: Express) {
    app.set("trust proxy", 1);

    setParserMiddlewares(app);
    setAuthMiddlewares(app);

    /**
     * Middleware used to serve static files (css files, client js files, images, etc...) in an effective way
     */
    app.use('/static', staticMiddleware('public'));

    /**
     * Middleware responsible for setting headers that improve security
     */
    app.use(helmet());
}
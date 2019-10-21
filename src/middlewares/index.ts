import {Express, static as staticMiddleware} from 'express';
import setAuthMiddlewares from './auth-middleware';
import setParserMiddlewares from './parser-middleware';

export default function setupMiddlewares(app: Express) {
    setParserMiddlewares(app);
    setAuthMiddlewares(app);
    /**
     * Middleware used to serve static files (css files, client js files, images, etc...) in an effective way
     */
    app.use(staticMiddleware('public'));
}
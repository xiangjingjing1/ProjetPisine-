import {Express} from 'express';
import bodyParser from 'body-parser';

export default function setupParserMiddleware(app: Express) {
    /**
     * Used to parse form bodies sent using POST method
     */
    app.use(bodyParser.urlencoded({ extended: false}));
}
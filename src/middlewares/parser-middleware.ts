import {Express} from 'express';
import bodyParser from 'body-parser';
import cookieParser from "cookie-parser";

export default function setupParserMiddleware(app: Express) {

    /**
     * Used to parse cookies
     */
    app.use(cookieParser("secret_passphrase"));

    /**
     * Used to parse form bodies sent using POST method
     */
    app.use(bodyParser.urlencoded({ extended: false}));
}
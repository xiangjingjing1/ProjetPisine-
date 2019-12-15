import { Express } from "express";
import authRoutes from "./auth";
import apiRoutes from "./api";
import boardRoutes from "./board";
import sessionRoutes from "./session";

function registerRoutes(app: Express) {
    authRoutes(app);
    apiRoutes(app);
    boardRoutes(app);
    sessionRoutes(app);
}

export default registerRoutes;
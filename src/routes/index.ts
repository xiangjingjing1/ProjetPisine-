import { Express } from "express";
import authRoutes from "./auth";
import apiRoutes from "./api";
import boardRoutes from "./board";
import sessionRoutes from "./session";
import adminRoutes from "./admin";

function registerRoutes(app: Express) {
    authRoutes(app);
    apiRoutes(app);
    boardRoutes(app);
    sessionRoutes(app);
    adminRoutes(app);
}

export default registerRoutes;
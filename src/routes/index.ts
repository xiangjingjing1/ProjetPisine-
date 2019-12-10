import { Express } from "express";
import authRoutes from "./auth";
import apiRoutes from "./api";
import boardRoutes from "./board";

function registerRoutes(app: Express) {
    authRoutes(app);
    apiRoutes(app);
    boardRoutes(app);
}

export default registerRoutes;
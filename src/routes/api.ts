import {Express} from "express";
import groups from "../controllers/api/groups";
import specialties from "../controllers/api/specialties";

/**
 * Registers all routes relative to REST API.
 */
function registerRoutes(app: Express) {
    
    /**
     * This route is used to retrieve all known groups.
     */
    app.get('/api/groups/', groups.get);


    /**
     * This route is used to retrieve all known specialties.
     */
    app.get("/api/specialties", specialties.get);
    
}

export default registerRoutes;
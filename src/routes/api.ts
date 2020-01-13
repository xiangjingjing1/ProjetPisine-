import {Express, Router} from "express";
import groups from "../controllers/api/groups";
import specialties from "../controllers/api/specialties";
import results from "../controllers/api/results-for-user";
import resultsPerSubject from "../controllers/api/results-per-subject";
import resultsPerSpecialty from "../controllers/api/results-per-specialty";

/**
 * Registers all routes relative to REST API.
 */
function registerRoutes(app: Express) {

    var router = Router();
    
    /**
     * This route is used to retrieve all known groups.
     */
    router.get('/groups', groups.get);


    /**
     * This route is used to retrieve all known specialties.
     */
    router.get("/specialties", specialties.get);

    router.get("/results/for/:user", results.get);

    router.get("/results/per/subject", resultsPerSubject.get);

    router.get("/results/per/specialty", resultsPerSpecialty.get);

    app.use("/api", router);
}

export default registerRoutes;
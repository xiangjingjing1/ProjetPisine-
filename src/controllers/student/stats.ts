import {Request, Response} from "express";

function get(req: Request, res: Response) {
  res.render("student/student-stats", {name: "Statistiques"});
}

export default {
  get
};

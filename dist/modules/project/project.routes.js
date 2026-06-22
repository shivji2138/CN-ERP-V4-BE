import { createCrudController } from "../common/crud.controller.js";
import { crudRoutes } from "../common/crud.routes.js";
import { Project } from "./project.model.js";
export default crudRoutes("project", createCrudController(Project, "project"));

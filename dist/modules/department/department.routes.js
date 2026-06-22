import { createCrudController } from "../common/crud.controller.js";
import { crudRoutes } from "../common/crud.routes.js";
import { Department } from "./department.model.js";
export default crudRoutes("department", createCrudController(Department, "department"));

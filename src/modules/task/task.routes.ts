import { createCrudController } from "../common/crud.controller.js";
import { crudRoutes } from "../common/crud.routes.js";
import { Task } from "./task.model.js";

export default crudRoutes("task", createCrudController(Task, "task"));

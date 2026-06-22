import { createCrudController } from "../common/crud.controller.js";
import { crudRoutes } from "../common/crud.routes.js";
import { Discussion } from "./discussion.model.js";

export default crudRoutes("discussion", createCrudController(Discussion, "discussion"));

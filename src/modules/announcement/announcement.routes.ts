import { createCrudController } from "../common/crud.controller.js";
import { crudRoutes } from "../common/crud.routes.js";
import { Announcement } from "./announcement.model.js";

export default crudRoutes("announcement", createCrudController(Announcement, "announcement"));

import { createCrudController } from "../common/crud.controller.js";
import { crudRoutes } from "../common/crud.routes.js";
import { Event } from "./event.model.js";
export default crudRoutes("event", createCrudController(Event, "event"));

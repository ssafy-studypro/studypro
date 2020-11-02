import express from "express"
import routes from "../routes"
import {read_major_classes, read_minor_classes} from "../controllers/classController"

const classRouter = express.Router();

classRouter.get("/major", read_major_classes);
classRouter.get("/minor", read_minor_classes)


export default classRouter;


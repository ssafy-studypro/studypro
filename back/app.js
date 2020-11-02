import express from "express"
import morgan from "morgan"
import helmet from "helmet"
import cookieParser from "cookie-parser"
import { localsMiddelWare } from "./middleware"
import dotenv from "dotenv"
import cors from "cors"
import bodyParser from "body-parser"
import userRouter from "./routers/userRouter"
import studyRouter from "./routers/studyRouter"
import workRouter from "./routers/workRouter"
import commentRouter from "./routers/commentRouter"
import postRouter from "./routers/postRouter"
import applyRouter from "./routers/applyRouter"
import alarmRouter from "./routers/alarmRouter"
import classRouter from "./routers/classRouter"
import emailRouter from "./routers/emailRouter"
import routes from "./routes"
import path from "path"

const app = express()
dotenv.config();


app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(helmet()); // 보안을 위한 것
app.use(morgan("dev"));

app.use(localsMiddelWare)
app.use(routes.images, express.static(process.env.IMAGE_PATH));
app.use(routes.files, express.static(process.env.FILE_PATH));
app.use(routes.users, userRouter);
app.use(routes.studies, studyRouter);
app.use(routes.comments, commentRouter);
app.use(routes.posts, postRouter);
app.use(routes.works, workRouter);
app.use(routes.applies, applyRouter);
app.use(routes.alarms, alarmRouter);
app.use('/class', classRouter);
app.use(routes.email, emailRouter);

export default app;



import express from "express"
import routes from "../routes"
import {
    create_alarm, 
    delete_alarm, 
    read_alarms_all, 
    check_alarm, 
    number_alarm} from "../controllers/alarmController"

const alarmRouter = express.Router();

alarmRouter.post(routes.home, create_alarm)
alarmRouter.delete(routes.home, delete_alarm)
alarmRouter.get(routes.home, read_alarms_all)
alarmRouter.put(routes.home, check_alarm)
alarmRouter.get(routes.alarm_number, number_alarm)
//alarmRouter.get(routes.home, read_alarm)

export default alarmRouter;
import {alarms, users} from "../models"

export const number_alarm = async function(req, res) {
    try {
        const user = res.locals.user;
        if (user) {
            const num_alarm = await alarms.count({where:{to: user.id, check:0}})
            res.send({num_alarm})
        } else {
            res.send({detail:"not avaible token"})
        }
    } catch (err) {
        res.send('err')
    }
}


export const create_alarm = async function(req, res) {
    const from = res.locals.user.id;
    const {title, content, to} = req.body;

    const to_user = await users.findOne({where:{id:(to || -1)}});

    if (!to_user) {
        res.send({
        "state": "fail",
        "detail": "wrong user id"
        })
    } else {
        const result = await alarms.create_alarm({from, to, title, content})
        res.send(result)
    }
}

export const check_alarm = async function(req, res) {
    const {alarm_id} = req.body
    alarms.update({check:1}, {where:{id: alarm_id}})
    res.send({
        state:"success"
    })
}

export const delete_alarm = async function(req, res) {
    const user_id = res.locals.user.id;
    const alarm_id = req.query.alarm_id || -1;

    const result = await alarms.delete_alarm(alarm_id, user_id);
    res.send(result);
    
} 

export const read_alarm = async function(req, res) {
    const alarm_id = req.query.alarm_id || -1;

    const result = await alarms.read_alarm(alarm_id);
    res.send(result);
}

export const read_alarms_all = async function(req, res) {
    let from, to;
    const {direction} = req.query

    if (direction === "fromUser") {
        from = res.locals.user.id
        alarms.findAll({where:{from}, order:  [['created_date','DESC']]})
            .map(async (alarm) => {
                console.log(alarm.dataValues.created_date)

                to = alarm.dataValues.to
                const user = await users.findOne({where:{id:to}})
                delete user.dataValues.password
                delete user.dataValues.auth
                alarm.dataValues.to = user
                return alarm
            }).then(alarms=>{
                res.send(alarms)
            })
    } else if (direction === "toUser") {
        to = res.locals.user.id
        alarms.findAll({where:{to}, order:  [['created_date','DESC']]})
            .map(async (alarm) => {
                from = alarm.dataValues.from
                const user = await users.findOne({where:{id:from}})
                delete user.dataValues.password
                delete user.dataValues.auth
                alarm.dataValues.from = user
                return alarm
            }).then(alarms=>{
                res.send(alarms)
            })
    }
}
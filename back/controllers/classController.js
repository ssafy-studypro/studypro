import {major_classes, minor_classes} from "../models"

export const read_major_classes = function(req, res) {
    major_classes.findAll({})
        .then(major => {
            res.send(major)
        })
}


export const read_minor_classes = async function(req, res) {
    const major_id = req.query.major;
    minor_classes.findAll({where:{major_class_id:major_id}})
        .then(minor => {
            res.send(minor)
        })
}

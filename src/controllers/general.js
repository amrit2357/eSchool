/* 
    Author : Amritpal singh 
    Module : general controller
    Description : Control all the routes related to attendance
*/

import Common from "../commonLib/common"
let common = new Common()
export default class general {

    async allStudents(req, res) {
        try {
            var db = req.app.locals.db
            let [err, std] = await common.invoke(db.collection("students").find({}).sort({ first_Name: -1 }).toArray())
            if (err || common.isEmpty(std)) {
                res.json(common.getStandardResponse(false, "No Students", {}))
            } else {
                res.json(common.getStandardResponse(true, "Students list ", std))
            }
        } catch (ex) {
            res.json(common.getStandardResponse(false, "Exception", ex.message))
        }
    }

    async allTeachers(req , res) {
        try {
            var db = req.app.locals.db
            let [err, teacher] = await common.invoke(db.collection("teachers").find({}).sort({ first_Name: -1 }).toArray())
            if (err || common.isEmpty(teacher)) {
                res.json(common.getStandardResponse(false, "No Teacher found", {}))
            } else {
                res.json(common.getStandardResponse(true, "Teachers list ", teacher))
            }
        } catch (ex) {
            res.json(common.getStandardResponse(false, "Exception", ex.message))
        }


    }
}
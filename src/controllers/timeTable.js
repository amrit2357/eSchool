/* 
    Author : Amritpal singh 
    Module : Timetale controller
    Description : Control all the modules related to timTable
*/
import { timeTable_model } from '../models/timeTable_model'
import { ObjectID } from 'mongodb';
import Common from '../commonLib/common'

let common = new Common()

/* 
    Description : get the time table for All classes
*/

export default class timeTable {

    /* 
        Description : get the time table for All classes for given date
    */
    async getTimeTableDateAll(req, res) {
        try {
            let db = req.app.locals.db;
            var date = new Date();
            let queryTimeTable = {
                "date": !common.isEmpty(req.body.date) ? req.body.date : common.getDateString(date)
            }
            let [err, tt] = await common.invoke(db.collection("timeTable").find(queryTimeTable).toArray())
            if (err || common.isEmpty(tt)) {
                res.json(common.getStandardResponse(false, "No time table found", {}))
            } else {
                res.json(common.getStandardResponse(true, "Time table found", tt))
            }
        } catch (exception) {
            res.json(common.getStandardResponse(false, exception.message, {}))
        }
    }
    /* 
        Description : get the time table for particular class
    */
    async getTimeTableClass(req, res) {
        try {
            var date = new Date();
            req.body.date = !common.isEmpty(req.body.date) ? req.body.date : common.getDateString(date)
            let queryTimeTable = {
                "date": req.body.date,
                "class": req.body.class,
                "section": req.body.section
            }
            let db = req.app.locals.db;
            let [err, tt] = await common.invoke(db.collection("timeTable").find(queryTimeTable).toArray())
            if (err || common.isEmpty(tt)) {
                res.json(common.getStandardResponse(false, "No time table found", {}))
            } else {
                res.json(common.getStandardResponse(true, "Time table found", tt))
            }
        } catch (exception) {
            res.json(common.getStandardResponse(false, exception.message, {}))
            common.commonErrorCallback(exception)
        }
    }

    /* 
        Description : Set the time table for particular class
    */
    async setTimeTableClass(req, res) {
        try {
            let date = new Date()
            let queryTimeTable = {
                "date": !common.isEmpty(req.body.date) ? req.body.date : common.getDateString(date),
                "class": req.body.class,
                "section": req.body.section,
                "timeSlot": req.body.timeSlot
            }
            let timetable = timeTable_model
            timetable._id = ObjectID()
            timetable.subject = req.body.subject
            timetable.teacherId = req.body.teacherId
            timetable.attendence = ""
            timetable.modifiedAt = new Date()
            timetable.modifiedBy = "Admin";
            timetable.timestamp = new Date()
            timetable = { ...timetable, ...queryTimeTable }
            let db = req.app.locals.db;
            let [err, tt] = await common.invoke(db.collection("timeTable").find(queryTimeTable).toArray())
            if (err) {
                res.json(common.getStandardResponse(false, "No time table found", {}))
            } else if (common.isEmpty(tt)) {
                let [err, inserTT] = await common.invoke(db.collection("timeTable").insertOne(timetable))
                if (err || common.isEmpty(inserTT)) {
                    res.json(common.getStandardResponse(false, `Time Table Insertion failed`, {}))
                } else {
                    res.json(common.getStandardResponse(true, `Time Table Information Inserted`, {}))
                }
            }
        } catch (exception) {
            res.json(common.getStandardResponse(false, exception.message, {}))
        }
    }
    /* 
       Description : Set the teacher for time table for particular class
   */
    async setTeacherTimeTable(req, res) {

        try {
            let db = req.app.locals.db;
            let subject = req.body.subject
            // if the Subject isnot given in the query , then take the default value subject of the teacher
            if (common.isEmpty(subject)) {
                let [err, teacherId] = await common.invoke(db.collection("teachers").find({ "userId": req.body.userId }).toArray())
                if (!!common.isEmpty(err) || common.isEmpty(tt)) {
                    res.json(common.getStandardResponse(false, "No time table found", {}))
                } else {
                    subject = teacherId[0].subject
                }
            }
            var myquery = {
                date: req.body.date,
                timeSlot: req.body.timeSlot,
                class: req.body.class,
                section: req.body.section,
            };
            var newvalues = { $set: { teacher: req.body.teacherId, subject: subject, modifiedAt: new Date() } };
            let [error, tt] = await common.invoke(db.collection("timeTable").find(myquery).toArray())
            if (!common.isEmpty(tt)) {
                let [er, UpdateT] = await common.invoke(db.collection("timeTable").updateOne(myquery, newvalues))
                if (!common.isEmpty(er) || common.isEmpty(UpdateT)) {
                    res.json(common.getStandardResponse(false, `Time Table Not Updated`, {}))
                } else {
                    res.json(common.getStandardResponse(true, `Time Table Information Updated`, {}))
                }
            } else {
                myquery.teacher = req.body.teacherId
                myquery.subject = subject
                myquery.modifiedBy = "Admin"
                myquery.modifiedAt = new Date()
                myquery.attendence = ""
                let [errTT, insertTT] = await common.invoke(db.collection("timeTable").insertOne(myquery))
                if (errTT || common.isEmpty(insertTT)) {
                    res.json(common.getStandardResponse(true, `TimeTable Insertion Failed`, {}))
                } else {
                    res.json(common.getStandardResponse(true, `TimeTable Information inserted`, insertTT))
                }
            }
        } catch (exception) {
            res.json(common.getStandardResponse(false, exception.message, {}))
        }
    }
}
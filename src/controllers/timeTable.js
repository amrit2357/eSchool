/* 
    Author : Amritpal singh 
    Module : Timetale controller
    Description : Control all the modules related to timTable
*/
import express from 'express'
let router = express.Router();
import db_connect from '../models/dbInit'
import { timeTable_model } from '../models/timeTable_model'
import { ObjectID } from 'mongodb';
import colors from "colors"
import { json } from 'body-parser';
import Common from '../commonLib/common'

let common = new Common()

/* 
    Description : get the time table for All classes
*/

export default class timeTable {

    /* 
        Description : get the time table for All classes for given date
    */
    async getTimeTableDateAll(req,res){
        var date = new Date();
        let queryTimeTable = {
            "date": !common.isEmpty(req.body.date) ? req.body.date : common.getDateString(date)
        }
        try {
            let db = req.app.locals.db;
            let getTT = () => {
                return new Promise((resolve, reject) => {
                    db.collection("timeTable").find(queryTimeTable).toArray((err, resp) => {
                        if (err) {
                            throw err
                        }
                        if (!common.isEmpty(resp)) {
                            console.log(common.getStandardResponse(true, `Time Table for Date: ${queryTimeTable.date}`, resp))
                            resolve(common.getStandardResponse(true, `Time Table for Date: ${queryTimeTable.date}`, resp))
                        } else {
                            console.log(common.getStandardResponse(false, `No time Table set for Date ${queryTimeTable.date}`, {}))
                            reject(common.getStandardResponse(false, `No time Table set for Date ${queryTimeTable.date}`, {}))
                        }
                    })
                })
            }
            let fetchTT = await getTT()
            if (fetchTT.status) {
                res.json(fetchTT)
            }
        } catch (exception) {
            res.json(common.getStandardResponse(false, exception.message, {}))
            common.commonErrorCallback(exception)
        }
    }
    /* 
        Description : get the time table for particular class
    */
    async getTimeTableClass(req,res){
        var date = new Date();
    req.body.date = !common.isEmpty(req.body.date) ? req.body.date : common.getDateString(date)
    let queryTimeTable = {
        "date": req.body.date,
        "class": req.body.class,
        "section": req.body.section
    }
    // If there will any entry for that particular date  , class , section the show
    let db = req.app.locals.db;
    try {
        let getTTClass = () => {
            return new Promise((resolve, reject) => {
                db.collection("timeTable").find(queryTimeTable).toArray((err, resp) => {
                    if (err) {
                        console.error(`Error : ${err}`)
                        throw err;
                    }
                    if (!common.isEmpty(resp)) {
                        console.log(common.getStandardResponse(true, `Time Table :`, resp))
                        resolve(common.getStandardResponse(true, `Time table :`, resp))
                    } else {
                        console.log(common.getStandardResponse(false, `No time Table set for Class : `, {}))
                        reject(common.getStandardResponse(false, `No time Table set for Class :`, {}))
                    }
                })
            })
        }
        let fetchTT = await getTTClass()
        if (fetchTT.status) {
            res.json(fetchTT)
        }
    } catch (exception) {
        res.json(common.getStandardResponse(false, exception.message, {}))
        common.commonErrorCallback(exception)
    }
    }
    /* 
        Description : Set the time table for particular class
    */
    async setTimeTableClass(req,res){
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
    timetable.attendence = ""
    timetable.teacher = req.body.teacher
    timetable.modifiedAt = new Date()
    timetable.modifiedBy = "Admin";
    timetable.timestamp = new Date()
    timetable = { ...timetable, ...queryTimeTable }
    let db = req.app.locals.db;
    /* -----
        Checks : for particular day
        1 . slot is empty 
    */

    try {
        let getTT = () => {
            return new Promise((resolve, reject) => {
                db.collection("timeTable").find(queryTimeTable).toArray((err, resp) => {
                    if (err) {
                        console.error(`Error : ${err}`)
                        throw err;
                    }
                    if (!common.isEmpty(resp)) {
                        console.log(common.getStandardResponse(false, `Time Table Already Available :`, resp))
                        reject(common.getStandardResponse(false, `Time Table Already Available :`, resp))
                    } else {
                        console.log(common.getStandardResponse(true, `No time Table set for Class : `, {}))
                        resolve(common.getStandardResponse(true, `No time Table set for Class : `, {}))
                    }
                })
            })
        }
        let checkTT = await getTT()
        console.log(checkTT)
        if (checkTT.status) {
            db.collection("timeTable").insertOne(timetable, function (err, resp) {
                if (err) {
                    console.error(`Error : ${err}`)
                    throw err;
                }
                resp = resp.ops[0]
                console.log(`Time Table entity  for \nClass : ${resp.class + resp.section} \nTeacher : ${resp.teacher} \ntimeSlot : ${resp.timeSlot} \nSubject : ${resp.subject} \nInserted`);
                res.json(common.getStandardResponse(true, `Time Table Information Inserted`, resp))
            });
        }
    } catch (exception) {
        res.json(common.getStandardResponse(false, exception.message, {}))
        common.commonErrorCallback(exception)
    }
    }
     /* 
        Description : Set the teacher for time table for particular class
    */
    async setTeacherTimeTable(req,res){
        let db = req.app.locals.db;
    let date = new Date()
    let subject = req.body.subject
    /*
    check :
        1. If the time table is not yet created , create it
             else update the teacher with default subject
    */
    try {
        if (common.isEmpty(subject)) {
            db.collection("teachers").find({ "regisNumber": req.body.teacher }).toArray((err, subResp) => {
                if (err) {
                    console.error(`Error : ${err}`)
                    throw err;
                }
                if (!common.isEmpty(subResp)) {
                    subject = subResp[0].subject
                    console.log("Teacher subject is " + subResp[0].subject)
                }
            })
        }
        var myquery = {
            date: req.body.date,
            timeSlot: req.body.timeSlot,
            class: req.body.class,
            section: req.body.section,
        };
        var newvalues = { $set: { teacher: req.body.teacher, subject: subject, modifiedAt: new Date() } };
        let checkTT = () => {
            return new Promise((resolve, reject) => {
                db.collection("timeTable").find(myquery).toArray((err, timeT) => {
                    if (err) {
                        console.error(`Error : ${err}`)
                        throw err;
                    }
                    if (!common.isEmpty(timeT)) {
                        console.log(common.getStandardResponse(true, `Time Table Exists`, timeT))
                        resolve(common.getStandardResponse(true, `Time Table Exists`, timeT))
                    } else {
                        console.log(common.getStandardResponse(false, `Time Table Not Existed Need To create `, {}))
                        resolve(common.getStandardResponse(false, `Time Table Not Existed Need To create`, {}))
                    }
                })
            })
        }
        // if time Table Already existed then update the teacher data
        let check = await checkTT()
        if (check.status) {
            db.collection("timeTable").updateOne(myquery, newvalues, function (err, data) {
                if (err) {
                    console.error(`Error : ${err}`)
                    throw err;
                }
                if (!common.isEmpty(data) && data.result.nModified > 0) {
                    console.log(common.getStandardResponse(true, `Time Table Information Updated`, {}))
                    res.json(common.getStandardResponse(true, `Time Table Information Updated`, {}))
                } else {
                    console.log(common.getStandardResponse(false, `Time Table Not Updated`, {}))
                    res.json(common.getStandardResponse(false, `Time Table Not Updated`, {}))
                }
            });
        } else {
            // Create the new Time Table with given values
            myquery.teacher = req.body.teacher
            myquery.subject = subject
            myquery.modifiedBy = "Admin"
            myquery.modifiedAt = new Date()
            myquery.attendence = ""
            db.collection("timeTable").insertOne(myquery, function (err, response) {
                if (err) throw err;
                if (response) {
                    console.log(common.getStandardResponse(true, `TimeTable Information inserted`, response))
                    res.json(common.getStandardResponse(true, `TimeTable Information inserted`, response))
                }
            });
        }
    } catch (exception) {
        res.json(common.getStandardResponse(false, exception.message, {}))
        common.commonErrorCallback(exception)
    }
    }
}
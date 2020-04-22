/* 
    Author : Amritpal singh 
    Module : Teachers controller
    Description : Control all the modules related to Teachers
*/
import express, { response } from 'express'
let router = express.Router()
import { teacher_model } from '../models/teacher_model'
import { ObjectID } from 'mongodb'
import to from 'await-to-js';
import Common from '../commonLib/common'
import TimeTable from '../controllers/timeTable'
let timetable = new TimeTable()
let common = new Common()
import Users from './users'
let users = new Users();
export default class teachers {
    /*  
        Description : Add the teacher in the database
    */
    async addTeacher(req, res) {

        try {
            let userID = await users.getID(req, res, 2)
            if (userID.status) {

                let teacher = this.fetchTeacherDetails(req, res)
                let err, user
                [err, user] = await to(db.collection("teachers").insertOne(teacher));
                if (common.isEmpty(err)) {
                    res.json(common.getStandardResponse(true, "Teacher Inserted", user))
                    // After teacher insertion update the top value
                    let err, usedInsert
                    let query = { type: 2 }
                    [err, userInsert] = await to(db.collection("common").update(query, { $set: { userId : userID + 1 } }).toArray())
                    if (!common.isEmpty(err)) {
                        console.log(common.getStandardResponse(false, 'Error in Updating Top Id', err))
                        return common.getStandardResponse(false, 'Error in Updating Top Id', err)
                    } else {
                        console.log(common.getStandardResponse(true, 'Updated Id successfully', userInsert))
                        return common.getStandardResponse(true, 'Updated Id successfully', userInsert)
                    }
                } else {
                    res.json(common.getStandardResponse(false, "Teacher Insertion Failed", {}))
                }
            } else {
                res.json(common.getStandardResponse(false, "Teacher Insertion Failed.Please try again later", {}))
            }
        } catch (exception) {
            res.json(common.getStandardResponse(false, exception.message, {}))
            common.commonErrorCallback(exception)
        }

    }
    /*  
        Description : get the teacher details to store in db
    */
    fetchTeacherDetails(req, res) {

        var teacher = teacher_model;
        teacher.password = common.encrypt(req.body.mobile_number)
        teacher._id = ObjectID()
        teacher.userId = userID;
        teacher.subject = req.body.subject
        teacher.first_Name = req.body.first_Name; // req
        teacher.last_Name = req.body.last_Name;
        teacher.dob = req.body.dob;
        teacher.address = req.body.address;
        teacher.mobile_Number = req.body.mobile_Number;    
        teacher.created_At = new Date;
        teacher.modified_At = new Date;
        
        return teacher
    }
    /*  
        Description : get the time Table of the teacher for today
    */
    async getTimeTTeacher(req, res) {
        var userId = req.params.userId;
        // get the todays timeTable for teacher
        let db = req.app.locals.db;
        let err, response
        let query = {
            date: req.body.date ? req.body.date : common.getDateString(new Date()),
            teacher: parseInt(userId)
        }
        try {
            [err, response] = await to(db.collection("timeTable").find(query).toArray())
            if (!common.isEmpty(response)) {
                res.json(common.getStandardResponse(true, `Timetable of teacher ${query.teacher}`, response))
            } else {
                res.json(common.getStandardResponse(false, `No Timetable for teacher ${query.teacher} found`, {}))
            }
        } catch (exception) {
            res.json(common.getStandardResponse(false, exception.message, {}))
            common.commonErrorCallback(exception)
        }
    }
    //----------------------------------------------------------------- TO DO
    /*  
        Description : get the total attendance of a particular teacher
        On basis of present / absent
    */
    async getTeacherTotalAttendance(req, res) {

    }
    /*  
        Description : get the time Table of the teacher for currrent Month
    */
    async getTeacherAttendanceByMonth(req, res) {

    }
}


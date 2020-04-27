/* 
    Author : Amritpal singh 
    Module : Teachers controller
    Description : Control all the modules related to Teachers
*/
import { teacher_model } from '../models/teacher_model'
import { ObjectID } from 'mongodb'
import Common from '../commonLib/common'
let common = new Common()
import Users from './users'
let users = new Users();
export default class teachers {
    /*  
    Description : Add the teacher in the database
*/
    async addTeacher(req, res) {

        try {
            let teacher = this.fetchTeacherDetails(req, res)
            let userID = await users.getID(req, res, common.userType.typeTeacher)
            if (userID.status) {
                teacher.userId = userID.data
                let user = await users.userExists(req, res, teacher.userId);
                if (!user.status) {
                    this.addUserDbCall(req, res, std)
                } else {
                    res.json(common.getStandardResponse(false, "Error in adding Teacher. please try again later", {}))
                }
            } else {
                res.json(common.getStandardResponse(false, "Error in adding Teacher. please try again later", {}))
            }
        } catch (exception) {
            res.json(common.getStandardResponse(false, exception.message, {}))
        }
    }
    /*  
        Description : fetch the user details to add to db ( addStudent 1.1)
    */
    async fetchTeacherDetails(req) {

        var teacher = teacher_model;
        let pass = await common.encrypt(req.body.mobile_number)
        teacher._id = ObjectID()
        teacher.subject = req.body.subject
        teacher.first_Name = req.body.first_Name; // req
        teacher.last_Name = req.body.last_Name;
        teacher.dob = req.body.dob;
        teacher.address = req.body.address;
        teacher.mobile_Number = req.body.mobile_Number;
        teacher.password = pass;
        teacher.created_At = new Date;
        teacher.modified_At = new Date;

        return teacher
    }

    /*  
        Description : add user details to add to db ( addStudent 1.2)
    */
    async addUserDbCall(req, res, std) {
        let db = req.app.locals.db
        let queryInsert = {
            type: common.userType.typeTeacher,
            created_At: teacher.created_At,
            modified_At: teacher.modified_At,
            userId: teacher.userId,
            mobile_number: teacher.mobile_number,
            password: teacher.password
        }
        let error, teachInsert;
        [error, teachInsert] = await common.invoke(db.collection("teachers").insertOne(std))
        if (!common.isEmpty(error)) {
            res.json(common.getStandardResponse(false, `Student Information inserted failed`, {}))
        } else {
            let err, setUser;
            [err, setUser] = await common.invoke(db.collection("users").insertOne(queryInsert))
            if (err) {
                res.json(common.getStandardResponse(false, `Error in inserting user`, err))
            } else {
                res.json(common.getStandardResponse(true, `User Information inserted`, {}))
                // Increment the Top id
                let idUpdate = await users.updateID(req, res, common.userType.typeTeacher);
                if (idUpdate.status) {
                    console.log(idUpdate);
                }
            }
        }
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
            [err, response] = await common.invoke(db.collection("timeTable").find(query).toArray())
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


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
            let teacher = await this.fetchTeacherDetails(req, res)
            let userID = await users.getID(req, common.userType.typeTeacher)
            if (userID.status) {
                teacher.userId = userID.data
                let user = await users.userExists(req,  teacher.userId , common.userType.typeTeacher);
                if (!user.status) {
                    this.addUserDbCall(req, res, teacher)
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
        let pass = await common.encrypt(req.body.mobile_number)
        var teacher = teacher_model;
        teacher._id = ObjectID()
        teacher.subject = req.body.subject
        teacher.first_Name = req.body.first_Name; // req
        teacher.last_Name = req.body.last_Name;
        teacher.dob = req.body.dob;
        teacher.address = req.body.address;
        teacher.mobile_number = req.body.mobile_number;
        teacher.created_At = new Date;
        teacher.modified_At = new Date;
        teacher.password = pass;
        return teacher
    }

    /*  
        Description : add user details to add to db ( addStudent 1.2)
    */
    async addUserDbCall(req, res, teacher) {

        try{
        let db = req.app.locals.db
        let queryInsert = {
            type: common.userType.typeTeacher,
            created_At: teacher.created_At,
            modified_At: teacher.modified_At,
            userId: teacher.userId,
            mobile_number: teacher.mobile_number,
            password: teacher.password
        }
        let error, teachInsert
        [error, teachInsert] = await common.invoke(db.collection("teachers").insertOne(teacher))
        if (!common.isEmpty(error)) {
            res.json(common.getStandardResponse(false, `teacher Information inserted failed`, teacher))
        } else {
            let err, setUser;
            [err, setUser] = await common.invoke(db.collection("users").insertOne(queryInsert))
            if (err) {
                res.json(common.getStandardResponse(false, `Error in inserting user`, err))
            } else {
                res.json(common.getStandardResponse(true, `User Information inserted`, {}))
                let idUpdate = await users.updateID(req, common.userType.typeTeacher);
                if (idUpdate.status) {
                    console.log(idUpdate)
                }
            }
        }
    }catch(exception){
        res.json(common.getStandardResponse(false , exception.message , {}))
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
            teacherId: parseInt(userId)
        }
        try {
            [err, response] = await common.invoke(db.collection("timeTable").find(query).toArray())
            console.log(err + "-" + response)
            if(!common.isEmpty(response)){
                res.json(common.getStandardResponse(true, `Timetable of teacher ${query.teacherId}`, response))
            }else{
                res.json(common.getStandardResponse(false, `No Timetable for teacher ${query.teacherId} found`, {}))
            }
        } catch (exception) {
            res.json(common.getStandardResponse(false, exception.message, {}))
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


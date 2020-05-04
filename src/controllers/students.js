/* 
    Author : Amritpal singh 
    Module : Students controller
    Description : Control all the modules related to students
*/
import { student_model } from '../models/student_model'
import { ObjectID } from 'mongodb'
import Common from '../commonLib/common'
let common = new Common()
import Users from './users'
let users = new Users();

export default class students {
    /*  
        Description : Add the student in the database
    */
    async addStudent(req, res) {
        try {
            let std = await this.fetchUserDetails(req)
            let userID = await users.getID(req, common.userType.typeStudent)
            if (userID.status) {
                std.userId = userID.data
                let user = await users.userExists(req, std.userId, common.userType.typeStudent);
                if (!user.status) {
                    this.addUserDbCall(req, res, std)
                } else {
                    res.json(common.getStandardResponse(false, "Error in adding Student. please try again later", user))
                }
            } else {
                res.json(common.getStandardResponse(false, "Error in adding Student. please try again later", userID))
            }
        } catch (ex) {
            res.json(common.getStandardResponse(false, "Exception in addStudent", ex.message))
        }
    }
    /*  
        Description : fetch the user details to add to db ( addStudent 1.1)
    */
    async fetchUserDetails(req) {
        let response = await common.encrypt(req.body.mobile_number)
        var std = student_model
        std._id = ObjectID()
        std.first_Name = req.body.first_Name
        std.last_Name = req.body.last_Name
        std.dob = req.body.dob
        std.address = req.body.address
        std.class = req.body.class
        std.section = req.body.section
        std.mobile_number = req.body.mobile_number
        std.created_At = new Date
        std.modified_At = new Date
        std.password = response
        return std
    }
    /*  
        Description : add user details to add to db ( addStudent 1.2)
    */
    async addUserDbCall(req, res, std) {
        let db = req.app.locals.db
        let queryInsert = {
            type: common.userType.typeStudent,  // student
            created_At: std.created_At,
            modified_At: std.modified_At,
            userId: std.userId,
            mobile_number: std.mobile_number,
            password: std.password
        }
        let error, stdInsert;
        [error, stdInsert] = await common.invoke(db.collection("students").insertOne(std))
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
                let idUpdate = await users.updateID(req, common.userType.typeStudent);
                if (idUpdate.status) {
                    console.log(idUpdate);
                }
            }
        }
    }
    /* 
        Description : get the Time table for particular student with regisNumber
    */
    async getTimeTStudent(req, res) {
        let db = req.app.locals.db;
        let query = {
            date: req.body.date,
            class: "",
            section: ""
        }
        try {
            let [err, checkTT] = await common.invoke(db.collection("students").findOne({ "userId": parseInt(req.params.studentId) }))
            if (err || common.isEmpty(checkTT)) {
                res.json(common.getStandardResponse(false, `No student found`, {}))
            } else {
                console.log(checkTT)
                query.class = checkTT.class
                query.section = checkTT.section
            }
            let [error, check] = await common.invoke(db.collection("timeTable").find(query).toArray())
            if (error || common.isEmpty(check)) {
                res.json(common.getStandardResponse(false, `No time table found for Student`, {}))
            } else {
                res.json(common.getStandardResponse(true, `TimeTable`, check))
            }
        } catch (exception) {
            res.json(common.getStandardResponse(false, exception.message, {}))
        }
    }
    /* 
        Description : get the students for particular class
    */
    async getStudentsClass(req, res) {
        try {
            let db = req.app.locals.db
            let query = {
                class: req.params.class,
                section: req.params.section
            }
            let [err, checkTT] = await common.invoke(db.collection("students").find(query).toArray())
            if (!common.isEmpty(checkTT)) {
                res.json(common.getStandardResponse(true, `Students of class ${query.class} ${query.section}`, checkTT))
            } else {
                res.json(common.getStandardResponse(false, `No students found for ${query.class} ${query.section}`, {}))
            }
        } catch (exception) {
            res.json(common.getStandardResponse(false, exception.message, {}))
        }
    }
}
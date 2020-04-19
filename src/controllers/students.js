/* 
    Author : Amritpal singh 
    Module : Students controller
    Description : Control all the modules related to students
*/
import express, { response } from 'express'
let router = express.Router()
import { student_model } from '../models/student_model'
import { ObjectID } from 'mongodb'
import Common from '../commonLib/common'
let common = new Common()

export default class students {
    /*  
        Description : Add the student in the database
    */
    async addStudent(req, res) {
        try {
            var std = student_model;
            std._id = ObjectID()
            std.regisNumber = Math.round(Math.random() * 100)
            std.first_Name = req.body.first_Name;
            std.last_Name = req.body.last_Name;
            std.dob = req.body.dob;
            std.address = req.body.address;
            std.class = req.body.class;
            std.section = req.body.section;
            std.mobile_number = req.body.mobile_number;
            std.created_At = new Date;
            std.modified_At = new Date;
            let db = req.app.locals.db;
            /*
                Generate one registration number according to the required then show it to the portal
            */
            let queryInsert = {
                type: "student",
                created_At: std.created_At,
                modified_At: std.modified_At,
                mobile_number: req.body.mobile_number,
                password: common.encrypt(req.body.mobile_number)
            }
            let userfind = () => {
                return new Promise((resolve, reject) => {
                    db.collection("users").find({ mobile_number: req.body.mobile_number }).toArray((err, resp) => {
                        if (err) {
                            throw err
                        }
                        if (!common.isEmpty(resp)) {
                            console.log(common.getStandardResponse(false, `User found with Mobile Number ${req.body.mobile_number}`, resp))
                            reject(common.getStandardResponse(false, `User found with Mobile Number ${req.body.mobile_number}`, resp))
                        } else {
                            console.log(common.getStandardResponse(true, `User Not found with Mobile Number ${req.body.mobile_number}`, {}))
                            resolve(common.getStandardResponse(true, `User Not found with Mobile Number ${req.body.mobile_number}`, {}))
                        }
                    })
                })
            }
            let user = await userfind()
            if (user.status) {
                let setStudent = () => {
                    return new Promise((resolve, reject) => {
                        db.collection("students").insertOne(std, (err, response) => {
                            if (err) throw err;
                            if (common.isEmpty(response.ops)) {
                                reject(common.getStandardResponse(false, `Student Information inserted failed`, {}))
                            } else {
                                console.log(common.getStandardResponse(true, `Student Information inserted`, response.ops))
                                resolve(common.getStandardResponse(true, `Student Information inserted`, response.ops))
                            }
                        });
                    })
                }
                let inStudent = await setStudent()
                if (inStudent.status) {
                    let setUser = () => {
                        return new Promise((resolve, reject) => {
                            db.collection("users").insertOne(queryInsert, (err, response) => {
                                if (err) {
                                    reject(common.getStandardResponse(false, `Error in inserting user`, err))
                                }
                                if (!common.isEmpty(response.ops)) {
                                    console.log(common.getStandardResponse(true, `User Information inserted`, response.ops))
                                    resolve(common.getStandardResponse(true, `User Information inserted`, response.ops))
                                }
                                reject(common.getStandardResponse(false, `User Information inserted failed`, {}))
                            });
                        })
                    }
                    let setUserDb = await setUser()
                    res.json(setUserDb)
                }
            }
        } catch (ex) {
            res.json(ex)
            common.commonErrorCallback(ex)
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
            let checkTT = () => {
                return new Promise((resolve, reject) => {
                    db.collection("students").find({ "regisNumber": parseInt(req.params.studentId) }).toArray((err, response) => {
                        if (err) {
                            console.log(`Error in request ${err}`)
                            throw err
                        }
                        if (!common.isEmpty(response)) {
                            query.class = response[0].class
                            query.section = response[0].section
                            console.log(common.getStandardResponse(true, `Student found`, response))
                            resolve(common.getStandardResponse(true, `Student found`, response))
                        } else {
                            console.log(common.getStandardResponse(false, `No student found`, {}))
                            resolve(common.getStandardResponse(false, `No student found`, {}))
                        }
                    })
                })
            }
            let stdTime = await checkTT()
            if (stdTime.status) {
                db.collection("timeTable").find(query).toArray((err, timeT) => {
                    if (err) {
                        throw err
                    }
                    if (!common.isEmpty(timeT)) {
                        console.log(common.getStandardResponse(true, `TimeTable`, timeT))
                        res.json(common.getStandardResponse(true, `TimeTable`, timeT))
                    } else {
                        console.log(common.getStandardResponse(false, `No time table found for Student`, {}))
                        res.json(common.getStandardResponse(false, `No time table found for Student`, {}))
                    }
                })
            } else {
                res.json(stdTime)
            }
        } catch (exception) {
            res.json(common.getStandardResponse(false, exception.message, {}))
            common.commonErrorCallback(exception)
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
            let classStd = () => {
                return new Promise((resolve, reject) => {
                    db.collection("students").find(query).toArray((err, student) => {
                        if (err) throw err;
                        if (!common.isEmpty(student)) {
                            console.log(common.getStandardResponse(true, `Students of class ${query.class} ${query.section}`, student))
                            resolve(common.getStandardResponse(true, `Students of class ${query.class} ${query.section}`, student))
                        } else {
                            reject(common.getStandardResponse(false, `No students found for ${query.class} ${query.section}`, {}))
                        }
                    })
                })
            }
            let promiseStd = await classStd()
            if (promiseStd.status) {
                res.json(promiseStd)
            }
        } catch (ex) {
            res.json(ex)
            common.commonErrorCallback(ex)
        }
    }
// ----------------------------------------------------------------------------- TO DO
    /* 
        Description : get the total Attendance for particular Student
    */
   async getStudentTotalAttendance(req, res) {
    try {
        let db = req.app.locals.db
        let query = {
            class: req.params.class,
            section: req.params.section
        }
        let classStd = () => {
            return new Promise((resolve, reject) => {
                db.collection("students").find(query).toArray((err, student) => {
                    if (err) throw err;
                    if (!common.isEmpty(student)) {
                        console.log(common.getStandardResponse(true, `Students of class ${query.class} ${query.section}`, student))
                        resolve(common.getStandardResponse(true, `Students of class ${query.class} ${query.section}`, student))
                    } else {
                        reject(common.getStandardResponse(false, `No students found for ${query.class} ${query.section}`, {}))
                    }
                })
            })
        }
        let promiseStd = await classStd()
        if (promiseStd.status) {
            res.json(promiseStd)
        }
    } catch (ex) {
        res.json(ex)
        common.commonErrorCallback(ex)
    }
    }

     /* 
        Description : set the total Attendance for particular Student
    */
   async setStudentTotalAttendance(req, res) {
    try {
        let db = req.app.locals.db
        let query = {
            class: req.params.class,
            section: req.params.section
        }
        let classStd = () => {
            return new Promise((resolve, reject) => {
                db.collection("students").find(query).toArray((err, student) => {
                    if (err) throw err;
                    if (!common.isEmpty(student)) {
                        console.log(common.getStandardResponse(true, `Students of class ${query.class} ${query.section}`, student))
                        resolve(common.getStandardResponse(true, `Students of class ${query.class} ${query.section}`, student))
                    } else {
                        reject(common.getStandardResponse(false, `No students found for ${query.class} ${query.section}`, {}))
                    }
                })
            })
        }
        let promiseStd = await classStd()
        if (promiseStd.status) {
            res.json(promiseStd)
        }
    } catch (ex) {
        res.json(ex)
        common.commonErrorCallback(ex)
    }
    }

}
/* 
    Author : Amritpal singh 
    Module : attendance controller
    Description : Control all the modules related to timTable
*/
import express, { response } from 'express'
let router = express.Router();
import { ObjectID } from 'mongodb';
import colors from "colors"
import { json } from 'body-parser';
import to from 'await-to-js'
import Common from '../commonLib/common'
let common = new Common()

export default class attendance {
    /* 
        Description : get the attendance for particular class for timeSlot by teacher 
    */
    async getClassAttendance(req, res) {
        let db = req.app.locals.db
        let queryTimeTable = {
            "date": req.body.date,
            "class": req.body.class,
            "section": req.body.section,
            "timeSlot": req.body.timeSlot,
        }
        console.log(queryTimeTable)
        try {
            let TT = () => {
                return new Promise((resolve, reject) => {
                    db.collection("timeTable").find(queryTimeTable).toArray((err, resp) => {
                        if (err) {
                            console.error(`Error : ${err}`)
                            throw err;
                        }
                        if (!common.isEmpty(resp)) {
                            console.log(common.getStandardResponse(true, `Time Table found`, resp))
                            resolve(common.getStandardResponse(true, `Time Table found`, resp))
                        } else {
                            console.log(common.getStandardResponse(false, `No Time Table found`, {}))
                            resolve(common.getStandardResponse(false, `No Time Table found`, {}))
                        }
                    })
                })
            }

            let CheckTT = await TT()
            if (CheckTT.status) {
                let attendance = CheckTT.data[0].attendance
                db.collection("attendance").find({ "_id": attendance }).toArray((err, atten) => {
                    if (err) {
                        console.error(`Error : ${err}`)
                        throw err;
                    }
                    if (!common.isEmpty(atten)) {
                        console.log(common.getStandardResponse(true, `Attendance`, atten))
                        res.json(common.getStandardResponse(true, `Attendance`, atten))
                    } else {
                        console.log(common.getStandardResponse(false, `No Attendance found`, atten))
                        res.json(common.getStandardResponse(false, `No Attendance found`, atten))
                    }
                })
            } else {
                res.json(CheckTT)
            }
        } catch (exception) {
            common.commonErrorCallback(exception)
            res.json(common.getStandardResponse(false, exception.message, {}))
        }
    }
    /* 
        Description : Set the attendance for particular class for TimeSlot by teacher
    */
    async setClassAttendance(req, res) {

        try {
            let db = req.app.locals.db;
            let queryTimeTable = {
                "date": req.body.date,
                "class": req.body.class,
                "section": req.body.section,
                "timeSlot": req.body.timeSlot,
            }
            let query = { ...queryTimeTable };
            query.timeTable = ""
            query.totalCount = req.body.totalCount
            query.totalPresent = req.body.totalPresent
            query.present = req.body.present

            let tt = () => {
                return new Promise((resolve, reject) => {
                    db.collection("timeTable").find(queryTimeTable).toArray((err, resp) => {
                        if (err) {
                            console.error(`Error : ${err}`)
                            throw err;
                        }
                        if (!common.isEmpty(resp)) {
                            query.timeTable = resp[0]._id;
                            console.log(common.getStandardResponse(true, `Time table Exists`, resp))
                            resolve(common.getStandardResponse(true, `Time table Exists`, resp))
                        } else {
                            console.log(common.getStandardResponse(false, `Time table Not Exists`, {}))
                            resolve(common.getStandardResponse(false, `Time table Not Exists`, {}))
                        }
                    })
                })
            }
            let timeT = await tt()
            if (timeT.status) {
                // if time Table Exists insert the attendance
                let atten = () => {
                    return new Promise((resolve, reject) => {
                        db.collection("attendance").insertOne(query, (err, resp) => {
                            if (err) {
                                console.error(`Error : ${err}`)
                                throw err;
                            }
                            if (!common.isEmpty(resp.ops)) {
                                console.log(common.getStandardResponse(true, `Attendance Inserted`, resp.ops))
                                resolve(common.getStandardResponse(true, `Attendance Inserted`, resp.ops))
                            } else {
                                console.log(common.getStandardResponse(false, `Attendance Insertion failed`, {}))
                                resolve(common.getStandardResponse(false, `Attendance Insertion failed`, {}))
                            }
                        })
                    })
                }
                let checkAtten = await atten()
                if (checkAtten.status) {
                    // If the attendance inserted succesfully
                    let newValue = { $set: { "attendance": checkAtten.data[0]._id } }
                    db.collection("timeTable").updateOne(queryTimeTable, newValue, (err, response) => {
                        if (err) {
                            console.error(`Error : ${err}`)
                            throw err;
                        }
                        if (!common.isEmpty(response)) {
                            console.log(common.getStandardResponse(true, "Time Table Attendance Update Successfully", response))
                            res.send(common.getStandardResponse(true, "Time Table Attendance Update Successfully", response))
                        } else {
                            console.log(common.getStandardResponse(true, "Time Table Attendance Update failed", {}))
                            res.send(common.getStandardResponse(true, "Time Table Attendance Update failed", {}))
                        }
                    });
                } else {
                    res.send(checkAtten)
                }
            } else {
                res.json(timeT)
            }
        } catch (exception) {
            res.json(common.getStandardResponse(false, exception.message, {}))
            common.commonErrorCallback(exception)
        }
    }
    /* 
        Description : update the attendance for particular class for TimeSlot by teacher
    */
    async UpdateClassAttendance(req, res) {

        try {
            let db = req.app.locals.db;
            let queryTimeTable = {
                "date": req.body.date,
                "class": req.body.class,
                "section": req.body.section,
                "timeSlot": req.body.timeSlot,
            }
            let query = { ...queryTimeTable };
            query.timeTable = ""
            query.totalCount = req.body.totalCount
            query.totalPresent = req.body.totalPresent
            query.present = req.body.present

            let queryAttendance;

            let tt = () => {
                return new Promise((resolve, reject) => {
                    db.collection("timeTable").find(queryTimeTable).toArray((err, resp) => {
                        if (err) {
                            console.error(`Error : ${err}`)
                            throw err;
                        }
                        if (common.isEmpty(resp)) {
                            queryAttendance.timeTable = resp[0]._id;
                            resolve(common.getStandardResponse(true, `Time table Exists`, {}))
                        } else {
                            resolve(common.getStandardResponse(true, `Time table Exists`, {}))
                        }
                    })
                })
            }
            let timeT = await tt()

            if (timeT.status) {
                db.collection("attendance").insertOne(query, (err, resp) => {
                    if (err) {
                        console.error(`Error : ${err}`)
                        throw err;
                    }
                    if (common.isEmpty(resp)) {
                        let newValue = { $set: { "attendance": resp.ops[0]._id } }
                        db.collection("timeTable").updateOne(queryTimeTable, newValue, (err, response) => {
                            if (err) {
                                console.error(`Error : ${err}`)
                                throw err;
                            }
                            console.log("Attendence updated Successfully")
                            res.send("Attendence updated Successfully")
                        });
                    } else {
                        console.log("Failed to Update attendance")
                        res.send("Failed to update attendance")
                    }
                })
            }
        } catch (exception) {
            res.json(common.getStandardResponse(false, exception.message, {}))
            common.commonErrorCallback(exception)
        }
    }
    /* 
        Description : get the attendance for particular Student req( class , section ) by parents
    */
    async getStudentAttendance(req, res) {
        try {
            let db = req.app.locals.db
            let queryTimeTable = {
                "date": req.body.date,
                "class": req.body.class,
                "section": req.body.section
            }
            let regNo = req.params.studentId
            let err, timeT

            [err, timeT] = await to(db.collection("timeTable").find(queryTimeTable).toArray())
            if (common.isEmpty(err)) {
                console.log(common.getStandardResponse(true, 'Time table Found', timeT))
                let timeAtten = (timeT).filter(res => {
                    return !common.isEmpty(res.attendance)
                })
                // Now have attendance id and table id and student id
                let tablePresent = []
                let promice = (response) => {
                    return new Promise((resolve, reject) => {
                        db.collection("attendance").find({ _id: response }).toArray((err, resp) => {
                            if (err)
                                throw err
                            if (!common.isEmpty(resp)) {
                                resolve(resp[0])
                            } else {
                                reject()
                            }
                        })
                    })
                }
                timeAtten.forEach(value => {
                    tablePresent.push(promice(value.attendance))
                })
                let finalResponse = []
                Promise.all(tablePresent)
                    .then(response => {
                        response.forEach(value => {
                            let preOrNot = (value.present).filter(chk => {
                                return chk.userID == regNo
                            })
                            if (!common.isEmpty(preOrNot)) {
                                finalResponse.push({
                                    "attendace": value._id,
                                    "timeTable": value.timeTable,
                                    "active": preOrNot[0].active
                                })
                            }
                        })
                        res.json(common.getStandardResponse(true, 'Table Id and Active states', finalResponse))
                    }).catch((exception) => {
                        res.json(common.getStandardResponse(false, "exception" + exception, {}))
                    })
            } else {
                console.log(common.getStandardResponse(false, 'No Time table Found', {}))
                res.json(common.getStandardResponse(false, ' No Time Table found', {}))
            }
        } catch (exception) {
            res.json(common.getStandardResponse(false, exception, {}))
            common.commonErrorCallback(exception)
        }
    }
    /* 
    Description : get the attendance for particular Student req( class , section ) by parents
    */
    async getStudentAttendanceTotal(req, res) {
        try {
            let db = req.app.locals.db
            let queryTimeTable = {
                "date": req.body.date,
                "class": req.body.class,
                "section": req.body.section
            }
            let regNo = req.params.studentId
            let err, timeT

            [err, timeT] = await to(db.collection("timeTable").find(queryTimeTable).toArray())
            if (common.isEmpty(err)) {
                console.log(common.getStandardResponse(true, 'Time table Found', timeT))
                let timeAtten = (timeT).filter(res => {
                    return !common.isEmpty(res.attendance)
                })

                // Now have attendance id and table id and student id
                let error, preCheck
                let tablePresent = []
                let promice = (response) => {
                    return new Promise((resolve, reject) => {
                        db.collection("attendance").find({ _id: response }).toArray((err, resp) => {
                            if (err)
                                throw err
                            if (!common.isEmpty(resp)) {
                                resolve(resp[0])
                            } else {
                                reject()
                            }
                        })
                    })
                }
                timeAtten.forEach(value => {
                    tablePresent.push(promice(value.attendance))
                })
                let finalResponse = []
                Promise.all(tablePresent)
                    .then(response => {
                        response.forEach(value => {
                            let preOrNot = (value.present).filter(chk => {
                                return chk.userID == regNo
                            })
                            if (!common.isEmpty(preOrNot)) {
                                finalResponse.push({
                                    "attendace": value._id,
                                    "timeTable": value.timeTable,
                                    "active": preOrNot[0].active
                                })
                            }
                        })
                        res.json(common.getStandardResponse(true, 'Table Id and Active states', finalResponse))
                    }).catch((exception) => {
                        res.json(common.getStandardResponse(false, "exception" + exception, {}))
                    })
            } else {
                console.log(common.getStandardResponse(false, 'No Time table Found', {}))
                res.json(common.getStandardResponse(false, ' No Time Table found', {}))
            }
        } catch (exception) {
            res.json(common.getStandardResponse(false, exception, {}))
            common.commonErrorCallback(exception)
        }
    }
    /* 
    Description : get the attendance for particular Student req( class , section , timeslot) by parents / teachers
    */
    async getStudentAttendanceTimeslot(req, res) {
    try {
        let db = req.app.locals.db
        let queryTimeTable = {
            "date": req.body.date,
            "class": req.body.class,
            "section": req.body.section
        }
        let regNo = req.params.studentId
        let err, timeT

        [err, timeT] = await to(db.collection("timeTable").find(queryTimeTable).toArray())
        if (common.isEmpty(err)) {
            console.log(common.getStandardResponse(true, 'Time table Found', timeT))
            let timeAtten = (timeT).filter(res => {
                return !common.isEmpty(res.attendance)
            })

            // Now have attendance id and table id and student id
            let error, preCheck
            let tablePresent = []
            let promice = (response) => {
                return new Promise((resolve, reject) => {
                    db.collection("attendance").find({ _id: response }).toArray((err, resp) => {
                        if (err)
                            throw err
                        if (!common.isEmpty(resp)) {
                            resolve(resp[0])
                        } else {
                            reject()
                        }
                    })
                })
            }
            timeAtten.forEach(value => {
                tablePresent.push(promice(value.attendance))
            })
            let finalResponse = []
            Promise.all(tablePresent)
                .then(response => {
                    response.forEach(value => {
                        let preOrNot = (value.present).filter(chk => {
                            return chk.userID == regNo
                        })
                        if (!common.isEmpty(preOrNot)) {
                            finalResponse.push({
                                "attendace": value._id,
                                "timeTable": value.timeTable,
                                "active": preOrNot[0].active
                            })
                        }
                    })
                    res.json(common.getStandardResponse(true, 'Table Id and Active states', finalResponse))
                }).catch((exception) => {
                    res.json(common.getStandardResponse(false, "exception" + exception, {}))
                })
        } else {
            console.log(common.getStandardResponse(false, 'No Time table Found', {}))
            res.json(common.getStandardResponse(false, ' No Time Table found', {}))
        }
    } catch (exception) {
        res.json(common.getStandardResponse(false, exception, {}))
        common.commonErrorCallback(exception)
    }
   }

}
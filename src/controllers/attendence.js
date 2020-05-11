/* 
    Author : Amritpal singh 
    Module : attendance controller
    Description : Control all the modules related to timTable
*/
import Common from '../commonLib/common'
import { ObjectId } from "mongodb";
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
        try {
            let [err, TT] = await common.invoke(db.collection("timeTable").find(queryTimeTable).toArray())
            if (err || common.isEmpty(TT)) {
                res.json(common.getStandardResponse(false, "No Time Table found", {}))
            } else {
                let attendance = TT[0].attendance
                let [errAtten, atten] = await common.invoke(db.collection("attendance").find({ "_id": attendance }).toArray())
                if (errAtten) {
                    res.json(common.getStandardResponse(false, "No attendance Found", {}))
                } else {
                    res.json(common.getStandardResponse(true, `Attendance`, atten))
                }
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

            let [err, TT] = await common.invoke(db.collection("timeTable").find(queryTimeTable).toArray())
            if (err || common.isEmpty(TT)) {
                res.json(common.getStandardResponse(false, "No time table found", {}))
            } else {
                query.timeTable = TT[0]._id
                let [errAtten, atten] = await common.invoke(db.collection("attendance").insertOne(query))
                if (errAtten || common.isEmpty(atten)) {
                    res.json(common.getStandardResponse(true, `Attendance Insertion failed`, atten.ops))
                } else {
                    let newValue = { $set: { "attendance": atten.ops[0]._id } }
                    let [er, attenUpdate] = await common.invoke(db.collection("timeTable").updateOne(queryTimeTable, newValue))
                    if (er || common.isEmpty(attenUpdate)) {
                        res.json(common.getStandardResponse(true, "Attendance Inserted failed", {}))
                    } else {
                        // common.getStandardResponse(true, "Attendance Inserted Successfully", attenUpdate)

                        // tt[0].attendance attendace id - > for all the students of the class
                        // update the attendance column in student profile total ++ , attended ? ++ : same
                        this.updateStudentTotalCommonAttendance(req, res, query.present)
                    }
                }
            }
        } catch (exception) {
            res.json(common.getStandardResponse(false, exception.message, {}))
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
            let newValue = { ...queryTimeTable.date, ...queryTimeTable.timeSlot };
            newValue.totalCount = req.body.totalCount
            newValue.totalPresent = req.body.totalPresent
            newValue.present = req.body.present
            newValue.modifiedAt = new Date()

            let [err, tt] = await common.invoke(db.collection("timeTable").find(queryTimeTable)).toArray()
            if (err || common.isEmpty(tt)) {
                res.json(common.getStandardResponse(true, `No Time table Exists`, {}))
            } else {
                let [err, atten] = db.collection("attendance").updateOne(tt[0].attendance, newValue)
                if (err || common.isEmpty(atten)) {
                    res.json(common.getStandardResponse(false, "attendance update failed", {}))
                } else {
                    res.json(true, "Attendance updated", {})
                    // tt[0].attendance attendace id - > for all the students of the class
                    // only change will be update  not all the entries
                    // update the attendance column in student profile total ++ , attended ? ++ : same
                    this.updateStudentTotalCommonAttendance(req, res, newValue.present)
                }
            }
        } catch (exception) {
            res.json(common.getStandardResponse(false, exception.message, {}))
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
                "section": req.body.section,
                "timeSlot": req.body.timeSlot
            }
            let regNo = req.params.studentId
            let err, timeT

            [err, timeT] = await common.invoke(db.collection("timeTable").find(queryTimeTable).toArray())
            if (common.isEmpty(err)) {
                let timeAtten = (timeT).filter(res => {
                    return !common.isEmpty(res.attendance)
                })
                // get the attendance id for all the attendane in that day
                let tablePresent = []
                let promice = (response) => {
                    return new Promise((resolve, reject) => {
                        db.collection("attendance").find({ _id: response }).toArray((err, resp) => {
                            if (!common.isEmpty(resp)) {
                                resolve(resp[0])
                            } else {
                                reject(err)
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
                                return chk.userId == regNo  // current user name
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
                        res.json(common.getStandardResponse(false, "exception", exception))
                    })
            } else {
                res.json(common.getStandardResponse(false, ' No Time Table found', {}))
            }
        } catch (exception) {
            res.json(common.getStandardResponse(false, exception.message, {}))
        }
    }
    /* 
        Description : get the total attendance for particular Student req( class , section ) by parents
    */
    async getTotalStudentAttendance(req, res) {
        try {
            let db = req.app.locals.dbg
            let [err, tt] = await common.invoke(db.collection("students").find({ userId: parseInt(req.params.studentId) }).toArray())
            if (!common.isEmpty(err) || common.isEmpty(tt)) {
                res.json(common.getStandardResponse(false, `Error in finding student total attendance`, {}))
            } else {
                res.json(common.getStandardResponse(true, `Student Total Attendance Percentage`, tt[0].attendance.percentage))
            }
        } catch (exception) {
            res.json(common.getStandardResponse(false, exception.message, {}))
        }
    }
    /* 
        Description : update the total attendance for particular Student
    */
    async updateStudentTotalCommonAttendance(req, res, attenArr) {

        try {
            let db = req.app.locals.db
            let index = 0
            attenArr.forEach(async (obj, i) => {
                // userId for every student 
                // update the params of the student info
                let newValues = {
                    total: "",
                    attended: "",
                    percentage: ""
                }
                // put the task in queue until and unless its not succesed put it again and again
                let [error, userInfo] = await common.invoke(db.collection("students").find({ "_id": common.getObjId(obj._id)}).toArray())
                if (!common.isEmpty(error)) {
                    // alert the admin // put it in queue
                    res.json(common.getStandardResponse(false, "Error in Updating for Class attendance", error))
                } else {
                    let attendence = userInfo[0].attendance
                    if (obj.active) {
                        newValues.total = attendence.total + 1,
                        newValues.attended = attendence.attended + 1,
                        newValues.percentage = common.getPercentage(attendence.total + 1, attendence.attended + 1)
                    } else {
                        newValues.total = attendence.total + 1,
                        newValues.attended = attendence.attended;
                        newValues.percentage = common.getPercentage(attendence.total + 1, attendence.attended)
                    }
                    let [err, user] = await common.invoke(db.collection("students").updateOne({ userId: parseInt(obj.userId) }, { $set: { "attendance" : newValues} }))
                    if (!common.isEmpty(user) && user.result.n) {
                        index++;
                    } else {
                        // alert the admin // put it in queue
                        res.json(common.getStandardResponse(false, "Error in Updating for Class attendance", err))
                    }
                }
                if (i == attenArr.length - 1) {
                    if (index === attenArr.length) {
                        res.json(common.getStandardResponse(true, "Attendance Updated Successfully for all Students", {}))
                    } else {
                        res.json(common.getStandardResponse(false, "Attendance updation for all students failed" , {}))
                    }
                }
            })
            // fetch the array of attendance with userId
        } catch (exception) {
            res.json(common.getStandardResponse(false, exception.message, {}))
        }

    }
}
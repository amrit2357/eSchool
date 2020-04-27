/* 
    Author : Amritpal singh 
    Module : attendance controller
    Description : Control all the modules related to timTable
*/
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
            if(err || common.isEmpty(TT)){
                res.json(common.getStandardResponse(false , "No time table found" , {}))
            }else{
                let [errAtten, atten] = await common.invoke(db.collection("attendance").insertOne(query))
                if(errAtten ||  common.isEmpty(atten)){
                    res.json(common.getStandardResponse(true, `Attendance Insertion failed`, atten.ops))
                }else{
                    let newValue = { $set: { "attendance": atten._id } }
                    let [er, attenUpdate] = await common.invoke(db.collection("timeTable").updateOne(queryTimeTable, newValue))
                    if(er || common.isEmpty(attenUpdate)){
                        res.send(common.getStandardResponse(true, "Time Table Attendance Update failed", {}))
                    }else{
                        res.json(common.getStandardResponse(true, "Time Table Attendance Update Successfully", attenUpdate))
                    }
                }
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
            let newValue = { ...queryTimeTable.date , ...queryTimeTable.timeSlot };
            newValue.totalCount = req.body.totalCount
            newValue.totalPresent = req.body.totalPresent
            newValue.present = req.body.present
            newValue.modifiedAt = new Date()
            
            let [err, tt] = await common.invoke(db.collection("timeTable").find(queryTimeTable)).toArray()
            if(err || common.isEmpty(tt)){
                res.json(common.getStandardResponse(true, `No Time table Exists`, {}))
            }else{
                let [err, atten] =  db.collection("attendance").updateOne(tt[0].attendance, newValue)
                if(err || common.isEmpty(atten)){
                    res.json(common.getStandardResponse(false , "attendance update failed" , {}))
                }else{
                    res.json(true , "Attendance updaetd" , {})
                }     
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

            [err, timeT] = await common.invoke(db.collection("timeTable").find(queryTimeTable).toArray())
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

            [err, timeT] = await common.invoke(db.collection("timeTable").find(queryTimeTable).toArray())
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

            [err, timeT] = await common.invoke(db.collection("timeTable").find(queryTimeTable).toArray())
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
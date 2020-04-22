
/* 
    Author : Amritpal singh 
    Module : Common controller
    Description : Control all the modules related to Common
*/
import express from 'express'
let router = express.Router()
import Common from '../commonLib/common'
let common = new Common()
let middleWare  = require('./middleware')
/*
    Function : getAllSubjects
    Description : get all the subjects
*/
router.get('/subjects', middleWare.middlewareAuth , (req, res) => {

    console.log(`subjscts Are :" + ${common.subjects}`)
    res.json(common.getStandardResponse(true, "subjects", common.subjects))
})

router.get('/classes', middleWare.middlewareAuth,  (req, res) => {

    console.log(`classes Are :" + ${common.classes}`)
    res.json(common.getStandardResponse(true, "classes", common.classes))
})

router.get('/timeslots', middleWare.middlewareAuth , (req, res) => {

    console.log(`Time Slots Are :" + ${common.timeslots}`)
    res.json(common.getStandardResponse(true, "Available Time Slots", common.timeslots))
})

/*  Route : getAllStudents
    Description : Add the student in the database
*/
router.get('/students',  middleWare.middlewareAuth ,(req, res) => {
    // Add the student to the Database 
    // client side validation
    try {
        var db = req.app.locals.db
        db.collection("students").find({}).sort({ first_Name: -1 }).toArray((err, student) => {
            if (err) throw err;
            if (student.length) {
                console.log(common.getStandardResponse(true , "Students list ", student))
                res.json(common.getStandardResponse(true , "Students list ", student))   
            } else {
                console.log(common.getStandardResponse(false , "No Student Found",{}))
                res.json(common.getStandardResponse(false , "No Student Found",{}))
            }     
        });
    } catch (ex) {
        return common.commonErrorCallback(ex)
    }
})

/*  Route : getAllTeachers
    Description : all the teaches in the database
*/

router.get('/teachers', middleWare.middlewareAuth , (req, res) => {
    // Add the student to the Database 
    // client side validation
    var db = req.app.locals.db
    db.collection("teachers").find({}).sort({ first_Name: -1 }).toArray((err, teacher) => {
        if (err) throw err;
        if (teacher.length) {
            console.log(common.getStandardResponse(true , "Teachers list ",teacher))
            res.json(common.getStandardResponse(true , "Teachers list ",teacher))   
        } else {
            console.log(common.getStandardResponse(false , "No teacher Found",{}))
            res.json(common.getStandardResponse(false , "No teacher Found",{}))
        } 
    });
})

module.exports = router

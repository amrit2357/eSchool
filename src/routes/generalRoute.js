
/* 
    Author : Amritpal singh 
    Module : Common controller
    Description : Control all the modules related to Common
*/
import express from 'express'
let router = express.Router()
import Common from '../commonLib/common'
let common = new Common()
let middleWare = require('../controllers/middleware')
import gen from '../controllers/general'
let general = new gen()
/*
    Function : getAllSubjects
    Description : get all the subjects
*/
router.get('/subjects', (req, res) => {

    console.log(`subjects Are :" + ${common.subjects}`)
    res.json(common.getStandardResponse(true, "subjects", common.subjects))
})

router.get('/classes', (req, res) => {

    console.log(`classes Are :" + ${common.classes}`)
    res.json(common.getStandardResponse(true, "classes", common.classes))
})

router.get('/timeslots', (req, res) => {

    console.log(`Time Slots Are :" + ${common.timeslots}`)
    res.json(common.getStandardResponse(true, "Available Time Slots", common.timeslots))
})

/*  Route : getAllStudents
    Description : Add the student in the database
*/
router.get('/students', (req, res) => {
    
    general.allStudents(req , res)
})

/*  Route : getAllTeachers
    Description : all the teaches in the database
*/

router.get('/teachers', (req, res) => {
  
  general.allTeachers(req , res) 
})

module.exports = router

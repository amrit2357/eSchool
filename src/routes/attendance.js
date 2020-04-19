/* 
    Author : Amritpal singh 
    Module : attendance routes
    Description : Control all the routes related to attendance
*/
import express from 'express'
let router = express.Router();
import { ObjectID } from 'mongodb';
import colors from "colors"
import { json } from 'body-parser';
import Attendance from '../controllers/attendence'
import Common from '../commonLib/common'
let common = new Common()
let attendance = new Attendance()

/*
   Description : get the attendance for particular class by teacher
*/
router.get('/teacher/:teacherId', (req, res) => {

  attendance.getClassAttendance(req, res)
})
  /*
     Description : set the attendance for particular class by teacher
 */
  .post('/teacher/:teacherId', (req, res) => {

    attendance.setClassAttendance(req, res)
  })

/*
  Description : get the attendance for particular student by timeslot
*/
router.get('/student/timeslot/:studentId', (req, res) => {

  attendance.getStudentAttendance(req, res)
})

/*
  Description : get the total attendance for particular Student by parents / student
*/
router.get('/student/total/:studentId', (req, res) => {

  attendance.getStudentAttendance(req, res)
})

/*
   Description : get the attendance for particular Student by parents / student
*/
router.get('/student/:studentId', (req, res) => {

  attendance.getStudentAttendance(req, res)
})


module.exports = router
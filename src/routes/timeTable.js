/* 
    Author : Amritpal singh 
    Module : timeTable 
    Description : Control all the routes related to timeTables
*/
import express from 'express'
let router = express.Router();
import { ObjectID } from 'mongodb';
import { json } from 'body-parser';
import TimeTable from '../controllers/timeTable'
let timeTable = new TimeTable()

/* 
    Description : get the time Table for all classes for given date
*/
router.get('/getTTAll', (req, res) => {

    timeTable.getTimeTableDateAll(req,res)
})
/* 
    Description : get and set the time Table for particular class for given date
*/
router.post('/setTTClass', (req, res, next) => {

    timeTable.setTimeTableClass(req,res)
})
.get('/getTTClass', (req, res) => {

    timeTable.getTimeTableClass(req,res)
})
/* 
    Description : set the teacher for time Table for particular class for given date
*/
router.post('/setTTteacher', async (req, res) => {

    timeTable.setTeacherTimeTable(req,res)
})

module.exports = router;
/* 
    Author : Amritpal singh 
    Module : teachers routes
    Description : Control all the routes related to teachers
*/
import express from 'express'
let router = express.Router();
import { ObjectID } from 'mongodb';
import { json } from 'body-parser';
import Teachers from '../controllers/teachers'
let teachers = new Teachers()
/*  
    Description : Add the teacher in the database
*/
router.post('/addTeacher', async (req, res) => {

    teachers.addTeacher(req,res)
})
/*  
    Description : get the time table for teacher for particular day
*/
router.get('/:regisNumber/tt', async (req, res) => {
  
    teachers.getTimeTTeacher(req,res)
})
module.exports = router;
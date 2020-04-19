/* 
    Author : Amritpal singh 
    Module : stuudents 
    Description : Control all the routes related to students
*/
import express from 'express'
let router = express.Router();
import { ObjectID } from 'mongodb';
import { json } from 'body-parser';
import Student from '../controllers/students'
let student = new Student()

router.post('/addStudent', (req, res) => {

    student.addStudent(req,res)  
})
router.get('/get/tt/:studentId', (req, res) => {
   
    student.getTimeTStudent(req,res)  
})
router.get('/:class/:section', (req, res) => {

    student.getStudentsClass(req,res)   
})

module.exports = router
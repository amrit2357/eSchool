/* 
    Author : Amritpal singh 
    Module : marks 
    Description : Control all the routes related to marks
*/
import express from 'express'
let router = express.Router();
import Common from '../commonLib/common'
let common = new Common()
import Marks from '../controllers/marks'
let marks = new Marks()

/*   
    Description : create the test of particular class
*/ 

router.post('/createTest' , (req , res)=>{
    marks.createTest(req, res)
})
/*   
    Description : set the marks of particular test
*/

router.post('/setTestMarks' , (req , res)=>{
    marks.setTestMarks(req, res)
})

/*   
    Description : update the marks of particular test
*/

router.put('/updateTestMarks' , (req , res)=>{
    marks.updateTestMarks(req, res)
})

/*   
    Description : get the marks of particular test
*/
router.get('/getTestMarks' , (req , res)=>{
    marks.getTestMarks(req, res)
})

/*   
    Description : get all the test of particular class
*/
router.get('/getTestsList' , (req , res)=>{
    marks.getTestsList(req , res)
})
/*   
    Description : get all the test of particular class and subject ( both teacher and student )
*/
router.get('/getallTest/subject/:subjectCode' , (req , res)=>{
    marks.getTestClassSubject(req, res)
})
/*   
    Description : get all the test of particular student by parents
*/
router.get('/getallTest/result/student' , (req , res)=>{
    marks.getTestStudent(req, res)
})

/*   
    Description : get the total of all the test of particular student // total percentage Till now
*/

router.get('/getTotal/marks/result' , (req , res)=>{
    marks.getTestsResult(req, res)
})

/*   
    Description : delete the partiular test of particular class
*/

router.delete('/testMarks/delete/:testId' , (req , res)=>{
    marks.removeTest(req, res)
})


module.exports = router
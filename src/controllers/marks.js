/* 
    Author : Amritpal singh 
    Module : subjects controller
    Description : Control all the modules related to subjects
*/
import Common from '../commonLib/common'
let common = new Common()
import Users from './users'
let users = new Users();
export default class marks {
    /*   
        Description : create the test of particular class
    */
    async createTest(req, res) {

    }
    /*   
        Description : set the marks of particular test
    */
    async setTestMarks(req, res) {

    }
    /*   
        Description : update the marks of particular test
    */
    async updateTestMarks(req, res) {

    }
    /*   
        Description : get the marks of particular test
    */
    async getTestMarks(req, res) {

    }
    /*   
        Description : get all the test of particular class
    */
    async getTestsList(req, res) {

    }
    /*   
        Description : get all the test of particular student by parents
    */
    async getTestClassSubject(req, res) {

    }
    /*   
        Description : get all the test of particular student by parents
    */
    async getTestStudent(req, res) {

    }
    /*   
    Description : get the total of all the test of particular student // total percentage Till now
    */
    async getTestsResult(req, res) {

    }
    /*   
    Description : delete the partiular test of particular class
    */
    async removeTest(req, res) {

    }

}
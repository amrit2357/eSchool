/* 
    Author : Amritpal singh 
    Module : authentication routes
    Description : Control all the routes related to authentication
*/
import express from 'express'
let router = express.Router();
import Authentication from '../controllers/authentication'
let authentication = new Authentication()

router.get('/getToken', (req, res) => {

    authentication.getToken(req , res)
});


router.get('/validateToken', (req, res) => {
    
    authentication.validateToken(req , res)
});


router.get('/login' , (req, res)=>{

    authentication.validateUserCred(req , res)
});


module.exports = router
/* 
    Author : Amritpal singh 
    Module : authentication routes
    Description : Control all the routes related to authentication
*/
import express from 'express'
let router = express.Router();
import Authentication from '../controllers/authentication'
let authentication = new Authentication()


router.get('/validateToken', (req, res) => {
    
    authentication.validateToken(req , (response)=>{
        res.json(response)
    },(err)=>{
        res.json(err)
    })
});

router.get('/login' , (req, res)=>{

    authentication.validateUserCred(req , res)
});

module.exports = router
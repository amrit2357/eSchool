/* 
    Author : Amritpal singh 
    Module : authentication routes
    Description : Control all the routes related to authentication
*/
import express from 'express'
let router = express.Router();
import { ObjectID } from 'mongodb';
import { json } from 'body-parser';
import Authentication from '../controllers/authentication'
let authentication = new Authentication()

router.post('/sendMessage', (req, res) => {

    authentication.sendMessage(req,res)
});


router.post('sendMessage/validateOTP', (req, res) => {

    authentication.validateOTP(req,res)
});


module.exports = router
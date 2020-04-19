/* 
    Author : Amritpal singh 
    Module : marks 
    Description : Control all the routes related to marks
*/
import express from 'express'
let router = express.Router();
import { ObjectID } from 'mongodb';
import colors from "colors"
import { json } from 'body-parser';
import attendance from '../controllers/attendence'
import Common from '../commonLib/common'
let common = new Common()


module.exports = router
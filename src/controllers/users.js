/* 
    Author : Amritpal singh 
    Module : Users controller
    Description : Control all the modules related to Users
*/
import express from 'express'
let router = express.Router();
import db_connect from '../models/dbInit'
import { timeTable_model } from '../models/timeTable_model'
import { ObjectID } from 'mongodb';
import colors from "colors"
import to from 'await-to-js'
import { json } from 'body-parser';
import Common from '../commonLib/common'
let common = new Common()

export default class users {
    /* 
        Description : get the user info
    */
    async userExists(req, userID , type) {
        try {
            let db = req.app.locals.db
            let query = {
                "userId": parseInt(userID),
                "type" : type
            }
            let [err , res] = await common.invoke(db.collection("users").findOne(query))
            if (err || common.isEmpty(res)){
                return common.getStandardResponse(false, 'User Not found', {})
            } else {
                return common.getStandardResponse(true, 'User Found', res)            
            }      
        } catch (ex) {
            console.log(common.getStandardResponse(false , "Exception in userExists" , ex.message))
        }
    }
    /* 
        Description : add the user in the database ( admin)
    */
    async addUser(req, res) {
        // add the admin access for users
    }
    /* 
        Description : change the password for user
    */
    async passChange(req, res) {

    }


    async getID(req, typeId) {
        try {
            let db = req.app.locals.db
            let query = { type: `${typeId}` }
            let [err, userID] = await common.invoke(db.collection("commonEntity").find(query).toArray())
            if (common.isEmpty(err)) {
                return common.getStandardResponse(true, 'Returned Id', userID[0].ID)
            } else {  
                return common.getStandardResponse(false, 'Error in getting id', err)
            }
        } catch (ex) {
           return common.commonErrorCallback(ex)
        }
    }

    async updateID(req , typeId) {
        try {
            let db = req.app.locals.db
            let query = { type: `${typeId}` }
            let [err, userID] = await common.invoke(db.collection("commonEntity").find(query).toArray())
            if (err) {
                return common.getStandardResponse(false, 'Error in getting id', err)
            } else {
                [err, update] = await common.invoke(db.collection("commonEntity").updateOne(query , {$set : { ID : userID[0].ID + 1 }}))
                if(err){
                    return common.getStandardResponse(false, 'Error in updating user ID', err)
                }else{
                    return common.getStandardResponse(true, 'Updated Successfully', update)
                }
            }
        } catch (ex) {
            return common.getStandardResponse(false, 'Exception', common.commonErrorCallback(ex))
        }
    }
    /* 
        Description : if the user forgets the password
    */
    async forgotPassword(req, res) {

    }
}

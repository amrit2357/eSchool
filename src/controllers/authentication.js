/* 

Author : Amritpal singh 
Module : Authentication
Description : Sign In / Sign up 
                Using mobile Number + OTP
                            or
                Using moblile Number + Password  
/* 
Making Otp generation Secure with Sessions and Hashiging algorithms 
*/
require('dotenv').config()
import express from 'express'
let client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
import colors from 'colors'
import Common from '../commonLib/common'
let common = new Common()

export default class authentication {
  /* 
       Description : send the OTP to User mobile number
   */
  async sendMessage(req, res) {

    let db = req.app.locals.db;
    var currentOtp = generateOTP();
    try {
      let err, findUser
      client.messages
        .create({
          body: 'Your OTP for verification is' + currentOtp + ' .Please Do not Share OTP for security reasons',
          from: '+16103645161',
          to: '+91' + req.body.Mobile_Number
        })
        .then(async(message) => {

          [err, findUser] = await to(db.collection("users").findOne({ Mobile_Number: req.body.Mobile_Number }))
          if (err) {
            console.error('Not able to Update the OTP in Database' + err);
            res.json(common.getStandardResponse(false, err.message, {}))
          } else {
            let upd, error
            [error, upd] = await to(db.collection("users").updateOne({ Mobile_Number: req.body.Mobile_Number }, { $set: { "OTP": common.encrypt(currentOtp) } }))
            if (!common.isEmpty(err)) {
              console.log('OTP Updated')
              res.json(common.getStandardResponse(false, "OTP Updated", {}))
            }
          }
        })
    } catch (exception) {
      res.json(common.getStandardResponse(false, exception.message, {}))
      common.commonErrorCallback(exception)
    }
  }
  /* 
       Description : validate the OTP from User mobile number
   */
  async validateOTP(req, res) {
    try {

      let db = req.app.locals.db
      let users, err
      [err , users] = await to(db.collection("users").findOne({ Mobile_Number: req.body.Mobile_Number }))
      if (err) {
          console.log(common.getStandardResponse(false , err.message , {}))
          res.json(common.getStandardResponse(false , err.message , {}));
      }else{
          if (validateOTP(req.body.OTP, users.OTP)) {
            res.json(common.getStandardResponse(true , "User has Entered Correct OTP"))
          }else{
            res.json(common.getStandardResponse(false , `User has Entered Wrong OTP`))
          }
        }      
    } catch (e) {
      res.json(common.getStandardResponse(false , exception.message , {}))
      common.commonErrorCallback(exception)
    }
  }
    /* 
       Description : validate the User mobile number from Db
   */
  async validateUser(req , res){

  }
    /* 
       Description : validate the session if User
   */
  async validateSession(req , res){
    
  }
    /* 
       Description : validate the User is Auhenticated or not
   */
  async authenticate(req , res){

  }


}
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
let client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
import jwt from 'jsonwebtoken'
import Common from '../commonLib/common'
let common = new Common()
import Users from './users'
let users = new Users();
import to from 'await-to-js'
import bcrypt from 'bcryptjs'

export default class authentication {
  /* 
       Description : validate the User is Authenticated or not
   */
  async validateUserCred(req, res) {

    try {
      let pass = req.body.password;
      let userCheck = await users.userExists(req, res, req.body.userId);
      // Check that user id is present in or not
      // Can be 1 .admin , 2 .teacher , 3 .student 
      if (userCheck.status) {
        // user found
        let data = userCheck.data;
        let hash = data.password
        var self = this
        bcrypt.compare(`${pass}`, hash).then(async (result) => {

          if (result) {
            // fetch the details of the user with user if after authentication
            // token generate and send it to user
            // store the same token in redis with key pair
            let token = await self.getJWTToken(data._id);
            let dataOutput = {
              token: token,
              _id: data._id
            }
            res.json(common.getStandardResponse(true, "Backend Response", dataOutput));
            // store the same token in redis with key pair
          } else {
            res.json(common.getStandardResponse(false, "Enter the right password", {}))
          }
        });
      } else {
        res.json(userCheck)
      }
    } catch (ex) {
      console.log(common.getStandardResponse(false, "Exception", ex.message))
      return common.getStandardResponse(false, "Exception", ex.message)
    }
  }
  /* 
    Description : generate the json web token
  */

  async getJWTToken(_id) {
    try {
      var token = jwt.sign({ data: _id }, process.env.PRIVATEKEYJWT, { expiresIn: '1h' })
      return token;
    } catch (ex) {
      console.log(common.getStandardResponse(false, "Exception Occured", ex))
    }

  }

  /* 
    Description : validate the session is valid or not
  */
  async validateToken(req, success, failure) {
    try {
      let token = req.headers.token
      if (!common.isEmpty(token)) {
        jwt.verify(req.headers.token, process.env.PRIVATEKEYJWT, function (err, decoded) {
          if (err) {
            failure(common.getStandardResponse(false, "Error in session token validation", err.message))
          } else {
            // console.log(common.getStandardResponse(true, "Sesion Token", decoded.data))
            success(common.getStandardResponse(true, "Sesion Token", decoded.data))
          }
        })
      } else {
        failure(common.getStandardResponse(false, "No Authorizationn Token given", {}))
      }
    } catch (ex) {
      console.log(common.getStandardResponse(false, "Exception Occured", ex.message))
    }
  }
  //-----------------------------------------------------------------------------------------------
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
        .then(async (message) => {

          [err, findUser] = await common.invoke(db.collection("users").findOne({ Mobile_Number: req.body.Mobile_Number }))
          if (err) {
            console.error('Not able to Update the OTP in Database' + err);
            res.json(common.getStandardResponse(false, err.message, {}))
          } else {
            let upd, error
            [error, upd] = await common.invoke(db.collection("users").updateOne({ Mobile_Number: req.body.Mobile_Number }, { $set: { "OTP": common.encrypt(currentOtp) } }))
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
      [err, users] = await common.invoke(db.collection("users").findOne({ Mobile_Number: req.body.Mobile_Number }))
      if (err) {
        console.log(common.getStandardResponse(false, err.message, {}))
        res.json(common.getStandardResponse(false, err.message, {}));
      } else {
        if (validateOTP(req.body.OTP, users.OTP)) {
          res.json(common.getStandardResponse(true, "User has Entered Correct OTP"))
        } else {
          res.json(common.getStandardResponse(false, `User has Entered Wrong OTP`))
        }
      }
    } catch (e) {
      res.json(common.getStandardResponse(false, exception.message, {}))
      common.commonErrorCallback(exception)
    }
  }
}
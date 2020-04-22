/* 
    Author : Amritpal singh 
    Module : Common controller
    Description : Control all the modules related to Common
*/
require('dotenv').config()
import colors from 'colors'
import bcrypt from 'bcryptjs'

export default class Common {

    constructor() { }

    userType = [
        { typeId: 1, type: "admin" },
        { typeId: 2, type: "teacher" },
        { typeId: 3, type: "student" }
    ]

    timeslots = ["7-8", "9-10", "10-11", "11-12", "12-1", "1-2", "2-3", "3-4", "4-5"]

    subjects = [
        {
            "subjectName": "Punjabi",
            "subjectCode": "PUNB"
        },
        {
            "subjectName": "English",
            "subjectCode": "ENG"
        },
        {
            "subjectName": "Hindi",
            "subjectCode": "HIN"
        },
        {
            "subjectName": "Social Studies",
            "subjectCode": "SST"
        },
        {
            "subjectName": "Math",
            "subjectCode": "MTH"
        },
        {
            "subjectName": "Science",
            "subjectCode": "SCI"
        },
        {
            "subjectName": "Break",
            "subjectCode": "BRK"
        },
        {
            "subjectName": "Physical Education",
            "subjectCode": "PHEDU"
        },
        {
            "subjectName": "Physics",
            "subjectCode": "PHY"
        },
        {
            "subjectName": "Chemistry",
            "subjectCode": "CHE"
        },
        {
            "subjectName": "Computer",
            "subjectCode": "COMP",
        }
    ]

    classes = [
        {
            "section": "1",
            "subsection": ["A", "B", "C"]
        },
        {
            "section": "2",
            "subsection": ["A", "B", "C"]
        },
        {
            "section": "3",
            "subsection": ["A", "B", "C"]
        },
        {
            "section": "4",
            "subsection": ["A", "B", "C"]
        },
        {
            "section": "5",
            "subsection": ["A", "B", "C"]
        },
        {
            "section": "6",
            "subsection": ["A", "B", "C"]
        },
        {
            "section": "7",
            "subsection": ["A", "B", "C"]
        },
        {
            "section": "8",
            "subsection": ["A", "B", "C"]
        },
        {
            "section": "9",
            "subsection": ["A", "B", "C"]
        },
        {
            "section": "10",
            "subsection": ["A", "B", "C"]
        }
    ]

    /*
        @Function invoke
        @Description : return the promise result
        @Param inputs       
    */
   invoke(promise){
       return promise.then((res)=>{
        if(res){
            return [null , res]
        }
       }).catch((err)=>{
            return [err , null]
       })
   }


    /*
        @Function isEmpty
        @Description : Check the value is not empty ,null ,undefined
        @Param inputs       
    */
    isEmpty(input) {
        if (input == undefined || input == null || input.length == 0) {
            return true
        }
        return false
    }
    /* 
        @Function encrypt
        @Description : encrypt the given value using bcrypt npm     
    */
    async encrypt(input) {
        try {
            let hash = bcrypt.hashSync(input, 10);
            return hash;
        } catch (ex) {
            console.log(this.commonErrorCallback(ex))
            return this.commonErrorCallback(ex)
        }
    }
    /* 
        @Function decrypt
        @Description : decrypt the given value using bcrypt npm      
    */
     async decrypt(input, hash_Value) {
        try {
            bcrypt.compare(input, hash_Value).then(function (result) {
                return result ? true : false
            });
        } catch (ex) {
            console.log(this.getStandardResponse(false, "Exception Occured", ex))
        }
    }
    /* 
      @Function getStandardResponse
      @Description : return the json in standard format
  */
    getStandardResponse(status, message, data) {
        return {
            status: status,
            message: message,
            data: data
        }
    }
    /* 
      @Function commonErrorCallback
      @Description : return the json in common format 
  */
    commonErrorCallback(err) {
        var data = 'Some Error Occured!';
        if (err && err.response && err.response.status && err.response.status == 400) {
            data = err.message;
            console.log(colors.red(err))
        }
        return {
            success: false,
            data: data
        };
    }
    /* 
      @Function getDateString
      @Description : get the date in string format   
  */
    getDateString(date) {

        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
    }
    /* 
      @Function generateOTP
      @Description : generate the random otp  
  */
    async generateOTP() {

        var digits = '0123456789';
        let OTP = '';
        for (let i = 0; i < 6; i++) {
            OTP += digits[Math.floor(Math.random() * 10)];
        }
        return OTP;
    }
    /* 
      @Function validateOTP
      @Description : validate the otp is valid or not      
  */
    async validateOTP(receivedOTP, savedOTP) {
        if (!this.isEmpty(receivedOTP)) {
            // validate the OTP stored and currently filled
            // bcrypt.compare(receivedOTP, savedOTP, function (err, res) {
            //     if (err) {
            //         console.log(colors.red('Error in validating the OTP'))
            //         return
            //     }
            //     return res ? true : false
            // });
        }
        return false
    };

}

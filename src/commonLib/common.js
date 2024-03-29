/* 
    Author : Amritpal singh 
    Module : Common controller
    Description : Control all the modules related to Common
*/
require('dotenv').config()
import colors from 'colors'
import bcrypt from 'bcryptjs'
import mongoDB from'mongodb'

export default class Common {

    databaseTable = {
        session: {
            "2019": {
                database: "eshool19",
                Tables: {
                    users: "users19",
                    students: "students19",
                    teachers: "teachers19",
                    timeTable: "timeTable19",
                    attendance: "attendance19",
                    marks: "marks19",
                }
            },
            "2020": {
                database: "eshool20",
                Tables: {
                    users: "users20",
                    students: "students20",
                    teachers: "teachers20",
                    timeTable: "timeTable20",
                    attendance: "attendance20",
                    marks: "marks20",
                }
            },
        }
    }
    userType = {
        typeAdmin: 1,
        typeTeacher: 2,
        typeStudent: 3
    }

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
        @Function getTable
        @Description : return the current table according to the session
        @Param        
    */
    getTable(input){

        let currentYear = new Date().getFullYear()
        currentYear = databaseTable.session[currentYear.toString]
        return currentYear.Tables[input]
    }

    getPercentage (denominator , numerator){
        let percent =  (numerator / denominator ) * 100
        return parseFloat(percent.toFixed(2))
    }

    /*
        @Function invoke
        @Description : return the promise result
        @Param inputs       
    */
    async invoke(promise) {
        return promise.then((res) => {
            return [null, res]
        }).catch((err) => {
            return [err, null]
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
        console.log(`status : ${status} , message :${message} , data : ${JSON.stringify(data)}`)
        return {
            status: status,
            message: message,
            data: data
        }
    }
       /* 
      @Function getObjId
      @Description : return the Object _id in standard format
  */
    getObjId(id){
        return new mongoDB.ObjectID(id);
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

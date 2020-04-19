/* 
    Author : Amritpal singh 
    Module : timetable model
    Description : Schema of timTable
*/
import db_connect from './dbInit'
export var timeTable_model = {
    "date" : "",
    "timeSlot" : "",            // value
    "subject" : "",             // Subject Code
    "class" : "", 
    "section" : "",
    "attendence" : "",          // Reference Id of attendance
    "teacher" : "",             // Reference Id teacher
    "modifiedAt" : "",
    "modifiedBy" : "",
    "timestamp" : ""
}
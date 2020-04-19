/* 
    Author : Amritpal singh 
    Module : attendence model
    Description : Schema of attendnce
*/
import db_connect from './dbInit'
export var attendence_model = {
    "date" : "",
    "timeSlot" : "",
    "timeTable" : "", // refrence for time table for which this attendence taken
    "totalCount" : "",
    "totalPresent" : "",
    "present" : [], // student id's in the array
    "modifiedAt" : "",
    "modifiedBy" : "",
    "timestamp" : ""
}

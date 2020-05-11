/* 
    Author : Amritpal singh 
    Module : subject model
    Description : Schema of subjects
*/
export let subject_model = {
    "subjectName": "",
    "subjectCode": "",
    "created_At": "",
    "modified_At": "",
}

export let marks_model = {
        "HINDI": [
            {
                "testName": "Unit test 1", // test name choosen by teacher or Admin
                "totalStudentCount": 0,    // total count of students
                "maxScore": 0,             // maximum score of test      
                "average" : 0,
                "countInTotal": false,     // it will count in final Assesment or not
                "attended" : [ /* id , marks */ ]            // who attended the test and marks
            },
        ]
}
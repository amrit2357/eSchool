/* 
    Author : Amritpal singh 
    Module : dbInit model
    Description : Initialize the database
*/
import mongodb from 'mongodb'
import dotenv from 'dotenv'
import colors from 'colors'
import app from '../eschool'
var db_connect;
dotenv.config()
/* 
    connect with Database
*/
export function dbInit(callBack) {
    let mongoClient = mongodb.MongoClient;
    var option = {
        useUnifiedTopology: true ,
      };
    mongoClient.connect(process.env.URI_MONGO ,option,(err , db) => {
        if (err) throw err;
        console.log(colors.yellow("Database connected"));
        db_connect = db;
        createCollections();
        // when the database connected Start  the server
        callBack(db)
    });
}

export function createCollections(){

    let db = db_connect.db('eSchool')
    db.createCollection("students", {
        validator: {
           $jsonSchema: {
              bsonType: "object",
              required: [ "first", "year", "major", "address" ],
              properties: {
                 name: {
                    bsonType: "string",
                    description: "must be a string and is required"
                 },
                 year: {
                    bsonType: "int",
                    minimum: 2017,
                    maximum: 3017,
                    description: "must be an integer in [ 2017, 3017 ] and is required"
                 },
                 major: {
                    enum: [ "Math", "English", "Computer Science", "History", null ],
                    description: "can only be one of the enum values and is required"
                 },
                 gpa: {
                    bsonType: [ "double" ],
                    description: "must be a double if the field exists"
                 },
                 address: {
                    bsonType: "object",
                    required: [ "city" ],
                    properties: {
                       street: {
                          bsonType: "string",
                          description: "must be a string if the field exists"
                       },
                       city: {
                          bsonType: "string",
                          "description": "must be a string and is required"
                       }
                    }
                 }
              }
           }
        }
     })
}

export function getDb(){
    return db_connect;
}






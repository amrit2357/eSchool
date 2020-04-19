/* 
    Author : Amritpal singh 
    Module : eSchool
    Description : main file
*/
import * as init from './models/dbInit'
import express from 'express'
import nodemon from 'nodemon'
import bodyParser from 'body-parser'
import colors from 'colors'
import path from 'path'
import morgan from 'morgan'
import dotenv from 'dotenv'
dotenv.config()

/* Import all the other modules to give access from home page */

import students from './routes/students'
import atten from './routes/attendance'
import timetable from './routes/timeTable'
import teachers from './routes/teachers'
import authentication from './routes/authentication'

import subjects from './controllers/subjects'
import commonCont from './controllers/general'


let app = express()
/* Parse the content of the Site like JSON*/
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
/* Access to all the static content */
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'files')))
app.use(express.static(path.join(__dirname, 'uploads')))

app.use('/students', students)
app.use('/subjects', subjects)
app.use('/teachers', teachers)
app.use('/tt', timetable)
app.use('/getAll' , commonCont)
app.use('/tt/atten', atten)
app.use('/auth' , authentication)

app.get('/', (req, res) => {
    console.error(colors.green("Home Page found."))
    res.send('Home Page Reached')
})

app.get('*', (req, res, next) => {
    console.error(colors.red("Page not found. Please enter the Correct URL"))
    res.send('Page Not found 404')
});
/* 
    Initialize the database before starting the server 
*/
init.dbInit((database) => {
    app.set('port', 3001)
    try {
        app.listen(app.get('port'));
        if (database != undefined) {
            app.locals.db = database = database.db("eSchool")
        }
        console.log(colors.green('eSchool app is running on port' + app.get('port')));
    } catch (ex) {
        console.error(colors.red(`Error starting eSchool app:${ex}`));
        process.exit(2);
    }
})

module.exports = app;





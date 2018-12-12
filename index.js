require('dotenv').config();
var inquirer = require("inquirer");
var mysql = require("mysql");
require("console.table");

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.DBPASSWORD,
    database: 'schoolDB'
});

connection.connect(function (err) {
    if (err) throw err;
});

function selectAllItemsFromTable(tableName, callback) {
    connection.query("SELECT * FROM ??", [tableName], function (err, results) {
        if (err) throw err;
        callback(results);
    });
}

function start() {

    inquirer.prompt([
        {
            name: "roomOrStudent",
            message: "Would you like to view [ROOMS] or [STUDENTS]?",
            type: "rawlist",
            choices: ["ROOMS", "STUDENTS"]
        }
    ]).then(function (inquirerResponse) {
        // ask the user 
        // if they would like to see 


        if (inquirerResponse.roomOrStudent.toUpperCase() === "ROOMS") {
            // all the ROOMS 
            selectAllItemsFromTable("classroom", function (results) {
                console.table(results);
            });
        } else {
            // all the STUDENTS
            selectAllItemsFromTable("student", function (results) {
                console.table(results);
                inquirer.prompt([
                    {
                        name: "createStudent",
                        message: "Would you like to create a new student?",
                        type: "confirm",
                        default: true
                    }
                ]).then(function (inquirerResponse) {
                    if (inquirerResponse.createStudent) {
                        selectAllItemsFromTable("classroom", function (results) {


                            // ask questions to make a new student
                            inquirer.prompt([
                                {
                                    type: "input",
                                    name: "name",
                                    message: "What's the student's name?"
                                },
                                {
                                    type: "rawlist",
                                    message: "What's the students room number that they are in?",
                                    name: "classRoomId",
                                    choices: function () {
                                        var rooms = [];
                                        for (var i = 0; i < results.length; i++) {
                                            rooms.push(results[i].id.toString());
                                        }
                                        return rooms;
                                    }
                                },
                                {
                                    type: "input",
                                    name: "gpa",
                                    message: "What's the student's GPA?"
                                },
                                {
                                    type: "input",
                                    name: "favSubject",
                                    message: "What's the student's favorite subject?"
                                }
                            ]).then(function (inquirerResponse) {
                                console.log(inquirerResponse);

                                // INSERT the record into our table 
                                connection.query("INSERT INTO student SET ?", [inquirerResponse], function (err, results) {
                                    if (err) throw err;
                                    selectAllItemsFromTable("student", function (results) {
                                        console.table(results);
                                        start();
                                    });
                                });
                            });
                        });
                    } else {
                        // exit 
                        connection.end();
                    }
                });
            });
        }
    });
}

start();
// add a student to roster 
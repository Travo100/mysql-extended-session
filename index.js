require('dotenv').config();
var inquirer = require("inquirer");
var mysql = require("mysql");
var cTable = require("console.table");

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : process.env.DBPASSWORD,
  database : 'schoolDB'
});
 
connection.connect(function(err) {
    if(err) throw err;
    console.log(`Connection id is ${connection.threadId}`);
});
 
// connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
//   if (error) throw error;
//   console.log('The solution is: ', results[0].solution);
// });
 
// connection.end();
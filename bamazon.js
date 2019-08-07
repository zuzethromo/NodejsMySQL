let mysql = require('mysql');
let inquirer = require('inquirer');
let connection = mysql.createConnection({
    host:"localhost",
    port:8889,
    user:"root",
    password:"root",
    database:"bamazon"
})

connection.connect(function(err){
    if (err) throw err;
    console.log("connection successful");
    makeTable();
})

let makeTable = function(){
    connection.query("SELECT * FROM products", function(err,res){
        for(let i=0; i<res.length; i++){
            console.log(res[i].itemid + " || " + res[i].productname + " || " + res[i].departmentname + " || " + res[i].price + " || "
            + res[i].stockquantity + "/n");
        }
    })
}
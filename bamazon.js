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
    promptCustomer(res);
    })
}

let promptCustomer = function(res){
    inquirer.prompt([{
        type:'input',
        name:'choice',
        message:"What would you like to purchase? [Quit with Q]"
    }]).then(function(answer){
        let correct = false;
        if(answer.choice.toUpperCase()=="Q"){
            process.exit();
        }
        for(let i=0; i<res.length; i++){
            if(res[i].productname == answer.choice){
                correct=true;
                let product = answer.choice;
                let id=i;
                inquirer.prompt({
                    type:"input", 
                    name:"quant",
                    message:"How many would you like to buy?",
                    validate: function(value){
                        if(isNaN(value)==false){
                            return true;
                        }else {
                            return false;
                        }
                    }
                }).then(function(answer){
                    if((res[id].stockquantity-answer.quant)>0){
                        connection.query("UPDATE products SET stockquantity='"+(res[id].stockquantity-answer.quant)
                        +"' WHERE productname='"+product+"'", function(err,res2){
                            console.log("Product Bought!");
                            makeTable();
                        })
                    } else {
                        console.log("Not a valid selection");
                        promptCustomer(res);
                    }
                })
            }
        }
        // if(i==res.length && correct==false){
        //     console.log("Not a valid selection");
        //     promptCustomer(res);
        // }
    })
}
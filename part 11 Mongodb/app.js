const express = require('express')
const app = express();

const userModel = require('./usermodel');

app.get('/',function(req,res){
    res.send('hey');
});

app.get('/create',async function(req,res){
    let createduser = await userModel.create({                          //an async code = all mongoose functions are async functions
        name: "Harsh",
        username: "userHarsh",
        email: "harsh@gmail.com"
    });

    res.send(createduser);
});


app.get('/update',async function(req,res){
    let updateduser = await userModel.findOneAndUpdate({username: "userHarsh"}, {name:" Harsh Vandana Sharma"}, {new:true});

    res.send(updateduser);
});


app.get('/read',async function(req,res){
    let readalluser = await userModel.find();

    res.send(readalluser);
});


app.get('/readone',async function(req,res){
    let readoneuser = await userModel.find({name: "Harsh"});        //find always gives an aray, even if there is no user , it gives an empty array
                                                                    //but if we use findOne then it returns an object (the first one if there are many matches), if no match is found then it retuns null
    res.send(readoneuser);
});


app.get('/delete',async function(req,res){
    let deleteduser = await userModel.findOneAndDelete({name:"Harsh"});

    res.send(deleteduser);  //deleted user ko antim darsan
});

app.listen(3000);
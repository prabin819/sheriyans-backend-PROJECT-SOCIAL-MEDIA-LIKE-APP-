const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const path = require('path');
const userModel = require('./models/user');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const { render } = require('ejs');

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname,'public')));
app.set('view engine','ejs');
app.use(cookieParser());

app.get('/',(req,res)=>{
    res.render('index');
});


app.post('/create', (req,res)=>{

    let {username, email, password, age} = req.body;

    bcrypt.genSalt(saltRounds, function(err, salt) {
        bcrypt.hash(password, salt, async function(err, hash) {
            // Store hash in your password DB.
            const createdUser = await userModel.create({
                username,
                email,
                password: hash,
                age
            });

            let token = jwt.sign({email/*same as email: email*/ }, "secret");
            res.cookie("token",token);
            res.send(createdUser);
        });
    });
});



app.get('/login', (req,res)=>{
    res.render('login');
});


app.post('/login', async (req,res)=>{
    let user = await userModel.findOne({email: req.body.email});
    if (!user) return res.send("something went wrong");

    bcrypt.compare(req.body.password, user.password, function(err,result){
        if (result){
            let token = jwt.sign({email: user.email}, "secret");
            res.cookie("token",token);
            res.send('yes you can login');
        } 
        else res.send("no you can't login");
    })
});



app.get('/logout',(req,res)=>{
    res.cookie("token"," ");
    res.send("logged out");
});


app.listen(3000);
const express = require('express');
const app = express();
// const cookieParser = require('cookie-parser');
const path = require('path');
const userModel = require('./models/user');
const postModel = require('./models/post');
// const bcrypt = require('bcrypt');
// const saltRounds = 10;
// const jwt = require('jsonwebtoken');
//const { render } = require('ejs');

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname,'public')));
app.set('view engine','ejs');
//app.use(cookieParser());

app.get('/',(req,res)=>{
    res.send('hello');
});


app.get('/create', async (req,res)=>{

    let user = await userModel.create({
    username:"Harsh",
    age: 25,
    email: "harsh@male.com"
    })

    res.send(user);
});


app.get('/post/create', async (req,res)=>{

    let post = await postModel.create({
        postdata:"Hello sare log welcome to my blog",
        user: "66375148d12516e06f566613"
    })


    let user = await userModel.findOne({_id: '66375148d12516e06f566613' });
    user.posts.push(post._id);
    await user.save();                                  //because we are not updating this by using findoneandupdate



    res.send({post, user});
});

app.listen(3000);
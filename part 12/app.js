const express = require('express')
const app = express();
const path = require('path');
const userModel = require('./models/user');

app.set('view engine','ejs');
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')))


app.get('/',function(req,res){
    res.render('index');
});

app.get('/read',async function(req,res){
    let allUsers = await userModel.find();
    res.render('read',{users:allUsers});
});

app.post('/create',async function(req,res){
    let {name, email, imageUrl} = req.body;
    let createdUser = await userModel.create({
        // name:name,
        // email:email,
        // imageUrl: imageUrl
        name,
        email,
        imageUrl
    });

    //res.send(createdUser);
    res.redirect('/read');  
});

app.get('/delete/:userId',async function(req,res){
    let deletedUser = await userModel.findOneAndDelete({_id: req.params.userId});
    res.redirect('/read');
});

app.get('/edit/:userId',async function(req,res){
    let user = await userModel.findOne({_id: req.params.userId});
    res.render('edit',{user});//{user:user}  is same as {user}  // see create above 
});

app.post('/update/:userId',async function(req,res){
    let {name, email, imageUrl} = req.body;
    let updatedUser = await userModel.findOneAndUpdate({_id: req.params.userId},{
        // name:name,
        // email:email,
        // imageUrl: imageUrl
        name,
        email,
        imageUrl
    },{new: true});

    //res.send(createdUser);
    res.redirect('/read');  
});

app.listen(3000);
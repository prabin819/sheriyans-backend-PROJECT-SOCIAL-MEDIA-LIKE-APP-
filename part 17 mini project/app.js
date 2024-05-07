const express = require('express');
const app = express();
const path = require('path');
const userModel = require('./models/user');
const postModel = require('./models/post');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
// const crypto = require('crypto');
// const multer = require('multer');
const upload = require('./config/multerconfig');
//const upload = require('./config/multerconfig');

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname,'public')));
app.set('view engine','ejs');
app.use(cookieParser());

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, './public/images/uploads')
//     },
//     filename: function (req, file, cb) {
//         crypto.randomBytes(12, function(err,bytes){
//             const fn = bytes.toString("hex") + path.extname(file.originalname);
//             cb(null, fn)
//         })
//     }
//   })
  
// const upload = multer({ storage: storage })


app.get('/',(req, res)=>{
    res.render("index");
})
app.get('/profile/upload',(req, res)=>{
    res.render("profileupload");
})
app.post('/upload',isLoggedIn ,upload.single("image"), async(req, res)=>{
    // let user = await userModel.findOne({email: req.user.email});
    // user.profilepic = req.file.filename;
    // await user.save();
    // res.redirect("/profile");
    await userModel.findOneAndUpdate({email: req.user.email},{profilepic: req.file.filename},{new:true});
    res.redirect("/profile");
})

// app.get('/test',(req, res)=>{
//     res.render("test");
// })
// app.post('/upload',upload.single("image") ,(req, res)=>{
//     console.log(req.file);
// })

app.get('/login',(req, res)=>{
    res.render("login");
})

app.get('/profile',isLoggedIn, async (req, res)=>{

    let user = await userModel.findOne({email: req.user.email}).populate("posts");
    //console.log(user.posts);//------------------------------------------------------------------------------------
    res.render('profile',{user});

})

app.get('/like/:postid',isLoggedIn, async (req, res)=>{

    let post = await postModel.findOne({_id: req.params.postid}).populate("user");

    if(post.likes.indexOf(req.user.userid) === -1){
        post.likes.push(req.user.userid);
    }else{
        post.likes.splice(post.likes.indexOf(req.user.userid), 1);
    }

    await post.save();
    res.redirect('/profile');

})

app.get('/edit/:postid',isLoggedIn, async (req, res)=>{

    let post = await postModel.findOne({_id: req.params.postid}).populate("user");

    
    res.render('edit',{post});

})

app.post('/update/:postid',isLoggedIn, async (req, res)=>{

    let post = await postModel.findOneAndUpdate({_id: req.params.postid}, {content: req.body.content});

    
    res.redirect('/profile');

})

app.get('/logout',(req, res)=>{
    res.cookie("token","");
    res.redirect("/login");
})

app.post('/register',async (req, res)=>{
    let { username, name ,age ,email, password} = req.body;
    let user = await userModel.findOne({email});
    if(user) return res.status(500).send('User alerady registered.');

    bcrypt.genSalt(saltRounds, function(err, salt) {
        bcrypt.hash(password, salt, async function(err, hash) {
            let user = await userModel.create({
                username,
                name,
                age,
                email,
                password: hash
            });

            let token = jwt.sign({ email:email, userid: user._id }, "shhhh");
            res.cookie("token",token);
            //res.send("registered");
            res.redirect("/profile");
            
        });
    });

})

app.post('/login',async (req, res)=>{
    let {email, password} = req.body;
    let user = await userModel.findOne({email});
    if(!user) return res.status(500).send('Something went wrong');

    bcrypt.compare(password, user.password, function(err, result) {
        if(result){
            let token = jwt.sign({ email: email, userid: user._id }, "shhhh");
            res.cookie("token",token);
            res.status(200).redirect("/profile");
        }
        else res.redirect('/login');
    });

})

function isLoggedIn(req, res, next){               //protected route
    if(req.cookies.token === "") res.redirect("/login");
    else{
        let data = jwt.verify(req.cookies.token, "shhhh");
        req.user = data;
        next();
    }
}

app.post('/post',isLoggedIn, async (req, res)=>{

    let user = await userModel.findOne({email: req.user.email})
    
    let post = await postModel.create({
        user: user._id,
        content: req.body.content
    })

    user.posts.push(post._id);
    await user.save();         //since we did the changes synchronously
    res.redirect('/profile');

})

app.listen(3000);
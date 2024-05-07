const express = require('express');
const app = express();
//const path = require('path');
const bcrypt = require('bcrypt');
const saltRounds = 10;

// app.use(express.json());
// app.use(express.urlencoded({extended: true}));
// app.use(express.static(path.join(__dirname,'public')));
// app.set('view engine','ejs');

app.get('/', (req, res) => {
    bcrypt.genSalt(saltRounds, function(err, salt) {
        bcrypt.hash('randompassword123', salt, function(err, hash) {  //salt random everytime
            console.log(hash);                                        //different hash everytime for same password
        });
    });
    res.send("going good");
})

app.listen(3000);
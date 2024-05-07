const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/part16');

const userSchema = mongoose.Schema({
    username: {
        type: String
    },
    email: String,
    age: {
        type: Number
    },
    posts: [{
        type: mongoose.Schema.Types.ObjectId,      //iska matlab iska type id hai
        ref: 'post'
    }]
});

module.exports = mongoose.model("user",userSchema);
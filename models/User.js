let mongoose = require("mongoose")

const User = new mongoose.Schema({
    email:{type:String, required: true, unique: true},
    name: {type: String, required:true},
    password:{type:String, required: true}
})

//mapping
mongoose.model("users",User);
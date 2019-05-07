let mongoose = require("mongoose")

const ToDoList = new mongoose.Schema({
    userId:{type: mongoose.Schema.Types.ObjectId,
        ref: 'users',required:true},
    items: [
        {
        _id: {type:mongoose.Schema.Types.ObjectId},
        name: {type:String}
        }
    ]
})

//mapping
mongoose.model("toDoLists",ToDoList); 
let express=require("express"),
    checkAuth = require("../middleware/auth")

listRouter=express.Router(),

path=require("path"),
mongoose=require("mongoose");

require("../models/ToDoList");
const listSchema=mongoose.model("toDoLists")

listRouter.use(checkAuth)

listRouter.get('/items', (req,res)=>{
    listSchema.findOne({userId: req.userData.userId}).exec()
        .then(list => {
            if(!list){
                return res.status(404).json({
                    message: "User Doesn't have List"
                });
            }
            res.status(200).json({
                list: list
            });

        })
})

listRouter.post('/createList', (req,res)=>{
    listSchema.find({userId: req.userData.userId}).exec()
        .then(list=>{
            if(list.length >= 1){
                // Send a conflict error
                return res.status(409).json({
                    message: "User Already Has List"
                });
            } else {
                const list = new listSchema({
                    userId: req.userData.userId
                })
                list.save()
                    .then(result =>{
                        res.status(201).json({
                            list: result,
                            message : 'List Created Successfully'
                        })
                    })
                    .catch(err =>{
                        console.log(err)
                        res.status(500).json({
                            error: err
                        });
                    })
                    
            }
        })
})

listRouter.put('/addItem', (req,res)=>{
    listSchema.updateOne({userId: req.userData.userId}, {
        "$push":{
            items:{_id: new mongoose.Types.ObjectId, name:req.body.item}
        }
    },(error)=>{
        if(!error)
        {
            listSchema.findOne({userId:req.userData.userId}).exec()
            .then(list => {
                if(!list){
                    return res.status(404).json({
                        message: "User Doesn't have List"
                    });
                }
                res.status(200).json({
                    list: list,
                    message: "Item Added Successfully"
                });
    
            })              
        }
        else
        {
            console.log(error)
            res.status(500).json({
                error: error
                });
        }
    })
})

listRouter.put('/deleteItem', (req,res)=>{
    listSchema.updateOne({userId: req.userData.userId}, {
        "$pull":{
            items:{_id: req.body._id}
        }
    },(error)=>{
        if(!error)
        {
            listSchema.findOne({userId:req.userData.userId}).exec()
            .then(list => {
                if(!list){
                    return res.status(404).json({
                        message: "User Doesn't have List"
                    });
                }
                res.status(200).json({
                    list: list,
                    message: "Item Deleted Successfully"
                });
    
            })              
        }
        else
        {
            console.log(error)
            res.status(500).json({
                error: error
                });
        }
    })
})
module.exports = listRouter
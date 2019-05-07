let express=require("express"),
    bcrypt = require('bcrypt') // For password Hashing

userRouter=express.Router(),

path=require("path"),
mongoose=require("mongoose");

require("../models/User");
const userSchema=mongoose.model("users"),
      jwt = require('jsonwebtoken');

// Login Router
userRouter.post('/signin', (req,res)=>{
    console.log(req.body)
    userSchema.findOne({email: req.body.email}).exec()
        .then(user=>{
            if(!user){
                // return Unauthorized status
                return res.status(401).json({
                    message : "Login Failed"
                });
            }
            bcrypt.compare(req.body.password, user.password, (err,result)=>{
                if(err){
                    return res.status(401).json({
                        message : "Login Failed"
                    });
                }
                if(result) {
                    // Use JWT token
                    const token = jwt.sign({
                        email: user.email,
                        userId: user._id
                    }, "toDoListSecret", {expiresIn: "1h"})
                    return res.status(200).json({
                        token : token,
                        name: user.name,
                        message: "Login Success"
                    });
                }
                // Password Didn't match
                res.status(401).json({
                    message : "Login Failed"
                });
            })
        })
})

// Sign Up Router

userRouter.post('/signup', (req,res)=>{
    userSchema.find({email: req.body.email}).exec()
        .then(user=>{
            if(user.length >= 1){
                // Send a conflict error
                return res.status(409).json({
                    message: "User Exists"
                });
            } else {
                bcrypt.hash(req.body.password, 10, (err,hash)=>{
                    if(err){
                        console.log(err)
                        return res.status(500).json({
                            error: err
                        });
                    }
                    else {
                        const user = new userSchema({
                            email: req.body.email,
                            name: req.body.name,
                            password: hash
                        })
                        user.save()
                            .then(result =>{
                                res.status(201).json({
                                    user: result,
                                    message : 'User Created Successfully'
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
            }
        })

})
module.exports = userRouter
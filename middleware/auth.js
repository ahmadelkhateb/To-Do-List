const jwt = require('jsonwebtoken');

checkAuth = (req,res,next)=>{
    try {
        const token = req.headers.authorization.split(" ")[1];
        console.log(token)
        const decoded = jwt.verify(token, "toDoListSecret")
        req.userData = decoded;
        next(); 
    } catch (err){
        return res.status(401).json({
            message: "Not Authorized"
        });
    }
}

module.exports = checkAuth

const jwt = require('jsonwebtoken');

const middlewareController = {

  verifyToken: (req,res,next) =>{
    const token = req.header.token
    if(token){
      const accesToken = token.split(" ")[1]
      jwt.verify(accesToken,process.env.JWT_ACCESS_KEY,(err,user)=>{
        if(err){
            res.status(403).json("token is not valid")
        }
        req.user = user
        next()
      })

    }
    else{
        res.status(401).json("you are not auth")
    }
  },
  verifyTokenAndAdmin: (req,res,next) =>{
    middlewareController.verifyToken(req,res, ()=>{
        if(req.user.id=== req.params.id ||req.user.admin){
            next()
        }
        else{
            res.status(403).json("ban khum co quyen")
        }
    })
  }
} 
module.exports = middlewareController
// const jwt = require("jsonwebtoken");
// const UserModel = require("../models/user");
// const { verifyLogin } = require("../controllers/FrontControllers");

// const isLogin = async (req, res, next) => {
//   const { token } = req.cookies;
//   if (token) {
    
//     verifyLogin = jwt.decode(token);
//     const data = await UserModel.findOne({ _id: verifyLogin.ID });

//     if (data.role == "student") {
//       res.redirect("/home");
//     } else if (data.role == "admin") {
//       res.redirect("/admin/dashboard");
//     }
//     next();
//   } else {
//     next();
//   }
// };

// module.exports = isLogin;




const jwt = require('jsonwebtoken')
const UserModel=require('../models/user') 

const isLogin = async (req, res, next) => {
    //console.log('hello middleware')
    const{token}=req.cookies
    //console.log(token)
    if(token){
        res.redirect('/')
    }
    next()
}
module.exports = isLogin


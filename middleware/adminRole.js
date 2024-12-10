const jwt = require("jsonwebtoken");

const authRoles = (roles) => {
  return (req, res, next) => {
    // console.log(res.user.role)
    if (!roles.includes(req.userdata.role)) {
      // role db bala

      req.flash("error", "unauthorised user Please Login");

      res.redirect("/");
    }
    next();
  };

};

module.exports = authRoles;

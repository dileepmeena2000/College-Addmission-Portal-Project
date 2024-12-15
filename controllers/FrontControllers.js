const CourseModel = require("../models/course");
const UserModel = require("../models/user");
const bcrypt = require("bcrypt");
const cloudinary = require("cloudinary");
const jwt = require("jsonwebtoken");
const randomstring = require("randomstring");
const nodemailer = require("nodemailer");

cloudinary.config({
  cloud_name: "diezdjotw",
  api_key: "241161176572584",
  api_secret: "1lablZJiel1I80vG8BR5dvNmLCE",
});

//npm i bcrypt

class FrontController {
  static home = async (req, res) => {
    try {
      const { name, image, email, id } = req.userdata;
      const btech = await CourseModel.findOne({ user_id: id, course: "btech" });
      const bca = await CourseModel.findOne({ user_id: id, course: "bca" });
      const mca = await CourseModel.findOne({ user_id: id, course: "mca" });
      res.render("home", {
        n: name,
        i: image,
        e: email,
        btech: btech,
        bca: bca,
        mca: mca,
      });
    } catch (error) {
      console.log(error);
    }
  };

  static about = async (req, res) => {
    try {
      const { name, image } = req.userdata;
      res.render("about", { n: name, i: image });
    } catch (error) {
      console.log(error);
    }
  };

  static login = async (req, res) => {
    try {
      res.render("login", {
        message: req.flash("success"),
        msg: req.flash("error"),
      });
    } catch (error) {
      console.log(error);
    }
  };
  static register = async (req, res) => {
    try {
      res.render("register", {
        message: req.flash("error"),
        msg: req.flash("success"),
      });
    } catch (error) {
      console.log(error);
    }
  };

  static contact = async (req, res) => {
    try {
      const { name, image } = req.userdata;
      res.render("contact", { n: name, i: image });
    } catch (error) {
      console.log(error);
    }
  };

  ///// insert data

  static insertstudent = async (req, res) => {
    try {
      const { name, email, password, confirmpassword } = req.body;
      if (!name || !email || !password || !confirmpassword) {
        res.flash("error", "All Filds are Require.");
        return res.redirect("/register");
      }

      const isEmail = await UserModel.findOne({ email });
      //console.log(isEmail)
      if (isEmail) {
        req.flash("error", "Email Already Exists");
        return res.redirect("/register");
      }
      if (password != confirmpassword) {
        req.flash("error", "password does not match");
        return res.redirect("/register");
      }

      //console.log(req.files);
      // image Upload
      const file = req.files.image;

      const imageUpload = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: "userprofile",
      });
      console.log(imageUpload);

      const hashpassword = await bcrypt.hash(password, 10);
      const data = await UserModel.create({
        name,
        email,
        password: hashpassword,
        image: {
          public_id: imageUpload.public_id,
          url: imageUpload.secure_url,
        },
      });
      if (data) {
        let token = jwt.sign({ ID: data._id }, "nirpalrawat@123");
        // console.log(token)middleware
        res.cookie("token", token);
        this.sendVerifymail(name, email, data.id);
        req.flash("success", "register success ! plz verifyLogin");
        res.redirect("/register");
      } else {
        req.flash("error", "Not mail Found");
        res.redirect("/register");
      }
    } catch (error) {
      console.log(error);
    }
  };

  static sendVerifymail = async (name, email, user_id) => {
    //console.log(name, email, user_id);
    // connenct with the smtp server

    let transporter = await nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,

      auth: {
        user: "dileepmeena975@gmail.com",
        pass: "hhxilhsevmbykbzf",
      },
    });
    let info = await transporter.sendMail({
      from: "test@gmail.com", // sender address
      to: email, // list of receivers
      subject: "For Verification mail", // Subject line
      text: "heelo", // plain text body
      html:
        "<p>Hii " +
        name +
        ',Please click here to <a href="http://localhost:3000/verify?id=' +
        user_id +
        '">Verify</a>Your mail</p>.',
    });
    //console.log(info);
  };

  static verifyMail = async (req, res) => {
    try {
      const updateinfo = await UserModel.findByIdAndUpdate(req.query.id, {
        is_verify: 1,
      });
      if (updateinfo) {
        res.redirect("/home");
      }
    } catch (error) {
      console.log(error);
    }
  };

  static verifyLogin = async (req, res) => {
    try {
      // console.log(req.body);
      const { email, password } = req.body;
      const user = await UserModel.findOne({ email: email });
      if (user != null) {
        const isMatched = await bcrypt.compare(password, user.password);
        //console.log(isMatched)

        if (isMatched) {
         // console.log(user.is_verified)
          if (user.role == "admin" && user.is_verify ==1  ) {
            //tokan create
            let token = jwt.sign({ ID: user._id }, "nirpalrawat@123");
            //console.log(token)
            res.cookie("token", token);
            res.redirect("/admin/dashboard");
          }
          else if (user.role == "student"&& user.is_verify ==1 ) {
            //tokan create
            let token = jwt.sign({ ID: user._id }, "nirpalrawat@123");
            //console.log(token)
            res.cookie("token", token);
            res.redirect("/home");
          } else{

            req.flash("error", "Please Verify your Email. ");
            return res.redirect("/");
          }
        } else {
          req.flash("error", "Email or password is not valid ");
          res.redirect("/");
        }
      } else {
        req.flash("error", "You are not a registered user ");
        return res.redirect("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  static logout = async (req, res) => {
    try {
      res.clearCookie("token");
      res.redirect("/");
    } catch (error) {
      console.log(error);
    }
  };
  static profile = async (req, res) => {
    try {
      const { name, image, email, id } = req.userdata;
      res.render("profile", { n: name, i: image, e: email });
    } catch (error) {
      console.log(error);
    }
  };
  static changePassword = async (req, res) => {
    try {
      const { id } = req.userdata;
      // console.log(req.body)
      const { op, np, cp } = req.body;
      if (op && np && cp) {
        const user = await UserModel.findById(id);
        const isMatched = await bcrypt.compare(op, user.password);
        //console.log(isMatched)
        if (!isMatched) {
          req.flash("error", "Current password is incorrect ");
          res.redirect("/profile");
        } else {
          if (np != cp) {
            req.flash("error", "Password does not match");
            res.redirect("/profile");
          } else {
            const newHashPassword = await bcrypt.hash(np, 10);
            await UserModel.findByIdAndUpdate(id, {
              password: newHashPassword,
            });
            req.flash("success", "Password Updated successfully ");
            res.clearCookie("token");
            res.redirect("/");
          }
        }
      } else {
        req.flash("error", "ALL fields are required ");
        res.redirect("/profile");
      }
    } catch (error) {
      console.log(error);
    }
  };
  static updateProfile = async (req, res) => {
    try {
      const { id } = req.userdata;
      const { name, email, role } = req.body;
      if (req.files) {
        const user = await UserModel.findById(id);
        const imageID = user.image.public_id;
        //console.log(imageID);

        //deleting image from Cloudinary
        await cloudinary.uploader.destroy(imageID);
        //new image update
        const imagefile = req.files.image;
        const imageupload = await cloudinary.uploader.upload(
          imagefile.tempFilePath,
          {
            folder: "userprofile",
          }
        );
        var data = {
          name: name,
          email: email,
          image: {
            public_id: imageupload.public_id,
            url: imageupload.secure_url,
          },
        };
      } else {
        var data = {
          name: name,
          email: email,
        };
      }
      await UserModel.findByIdAndUpdate(id, data);
      req.flash("success", "Update Profile successfully");
      res.redirect("/profile");
    } catch (error) {
      console.log(error);
    }
  };

  /// forget password

  static forgetPasswordVerify = async (req, res) => {
    try {
      const { email } = req.body;
      const userData = await UserModel.findOne({ email: email });
      //console.log(userData)
      if (userData) {
        const randomString = randomstring.generate();
        await UserModel.updateOne(
          { email: email },
          { $set: { token: randomString } }
        );
        this.sendEmail(userData.name, userData.email, randomString);
        req.flash("success", "Plz Check Your mail to reset Your Password!");
        res.redirect("/");
      } else {
        req.flash("error", "You are not a registered Email");
        res.redirect("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  static sendEmail = async (name, email, token) => {
    // console.log(name,email,status,comment)
    // connenct with the smtp server

    let transporter = await nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,

      auth: {
        user: "dileepmeena975@gmail.com",
        pass: "hhxi lhse vmby kbzf",
      },
    });
    let info = await transporter.sendMail({
      from: "test@gmail.com", // sender address
      to: email, // list of receivers
      subject: "Reset Password", // Subject line
      text: "heelo", // plain text body
      html:
        "<p>Hii " +
        name +
        ',Please click here to <a href="http://localhost:3000/reset-password?token=' +
        token +
        '">Reset</a>Your Password.',
    });
  };

  static reset_Password = async (req, res) => {
    try {
      const token = req.query.token;
      const tokenData = await UserModel.findOne({ token: token });
      if (tokenData) {
        res.render("reset-password", { user_id: tokenData._id });
      } else {
        res.render("404");
      }
    } catch (error) {
      console.log(error);
    }
  };

  static reset_Password1 = async (req, res) => {
    try {
      const { password, user_id } = req.body;
      const newHashPassword = await bcrypt.hash(password, 10);
      await UserModel.findByIdAndUpdate(user_id, {
        password: newHashPassword,
        token: "",
      });
      req.flash("success", "Reset Password Updated successfully ");
      res.redirect("/");
    } catch (error) {
      console.log(error);
    }
  };
}
module.exports = FrontController;

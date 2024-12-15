const express = require("express");
const FrontController = require("../controllers/FrontControllers");
const AdminController = require("../controllers/admin/AdminController");
const route = express.Router();
const checkAuth = require("../middleware/auth");
const CourseController = require("../controllers/courseControllers");
const ContactContoller = require("../controllers/contactController");

const isLogin = require("../middleware/isLogin");
const adminRole = require("../middleware/adminRole");

// frontcontrollers Routing

route.get("/",isLogin,FrontController.login);
route.get("/home", checkAuth, FrontController.home);
route.get("/about", checkAuth, FrontController.about);
route.get("/register", FrontController.register);
route.get("/contact", checkAuth, FrontController.contact);
route.get("/profile", checkAuth, FrontController.profile);
route.post("/changePassword", checkAuth, FrontController.changePassword);
route.post("/updateProfile", checkAuth, FrontController.updateProfile);

//insert data
route.post("/insertstudent", FrontController.insertstudent);

//admin controllers

route.get("/admin/dashboard", checkAuth, adminRole('admin'), AdminController.dashboard);
route.get("/admin/studentDisplay",checkAuth,adminRole('admin'),AdminController.studendtDisplay);

route.get("/admin/studentView/:id",checkAuth,adminRole('admin'),AdminController.studentView);
route.get("/admin/studentDelete/:id",checkAuth,adminRole('admin'),AdminController.studentDelete);
route.get("/admin/studentEdit/:id",checkAuth,adminRole('admin'),AdminController.studentEdit);

route.post("/admin/studentUpdate/:id",checkAuth,adminRole('admin'),AdminController.studentUpdate);
route.post("/admin/insertStudent",checkAuth,adminRole('admin'),AdminController.studentInsert);
route.get("/admin/courseDisplay",checkAuth,adminRole('admin'),AdminController.courseDisplay);
route.post("/update_status/:id",checkAuth,adminRole('admin'),AdminController.update_status);

route.get("/admin/profile", checkAuth, adminRole('admin'), AdminController.profile);
route.post("/admin/updateProfile",checkAuth,adminRole('admin'),AdminController.updateProfile);
route.get("/admin/password", checkAuth, adminRole('admin'), AdminController.password);
route.post("/admin/Password",checkAuth,adminRole('admin'),AdminController.changePassword);
route.get("/admin/contactDisplay",checkAuth,adminRole('admin'),AdminController.contactDisplay);

// verifylogin
route.post("/verifyLogin", FrontController.verifyLogin);
route.get("/logout", FrontController.logout);

//course Controllers
route.post("/course_insert", checkAuth, CourseController.courseinsert);
route.get("/coursedisplay", checkAuth, CourseController.coursedisplay);
route.get("/courseView/:id", checkAuth, CourseController.courseView);
route.get("/courseEdit/:id", checkAuth, CourseController.courseEdit);
route.post("/courseUpdate/:id", checkAuth, CourseController.courseUpdate);
route.get("/courseDelete/:id", checkAuth, CourseController.courseDelete);

// contactcontoller
route.post("/contact_insert", checkAuth, ContactContoller.contactinsert);
/// forget password

route.post("/forgot_Password", FrontController.forgetPasswordVerify);

route.get("/reset-password", FrontController.reset_Password);

route.post("/reset_Password1", FrontController.reset_Password1);

// verify mail
route.get("/verify", FrontController.verifyMail);

module.exports = route;

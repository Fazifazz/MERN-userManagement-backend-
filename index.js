const express = require("express");
const cors = require("cors");
const cookieParser = require('cookie-parser')
const app = express();
const path = require('path')
const mongoose = require("mongoose");
const userController  = require('./Controllers/userController')
const adminController  = require('./Controllers/adminController')
const {isLoggedIn,isAdminLoggedIn,isAdminLoggedOut} = require('./Middlewares/auth')



mongoose
  .connect("mongodb://localhost:27017/RUSM")
  .then(() => console.log("db connected"))
  .catch((error) => console.log(error));

app.use(cors({
    origin:['http://localhost:3000'],
    methods:['GET','POST'],
    credentials:true
}));
app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname, 'public')))


//user routes
app.post("/register",userController.createUser )
app.post("/login",userController.verifyLogin )
app.get('/userLogout',isLoggedIn,userController.userLogout)
app.post('/editProfile',isLoggedIn,userController.uploadUserProfile,userController.resizeUserProfile,userController.editProfile)


//for user and admin session managements
app.get('/checkLogged',isLoggedIn,userController.checkLogin)
app.get('/adminLogin',isAdminLoggedOut,adminController.getAdminLogin)


//admin routes

app.post('/adminLogin',adminController.verifyAdminLogin)
app.get('/dashboard',isAdminLoggedIn,adminController.getDashboard)
app.get('/getUsers',isAdminLoggedIn,adminController.getUsers)
app.get('/adminLogout',isAdminLoggedIn,adminController.adminLogout)
app.post('/deleteUser',isAdminLoggedIn,adminController.deleteUser)
app.post('/createUser',isAdminLoggedIn,adminController.createUser)
app.get('/checkAdminLogged',isAdminLoggedIn,adminController.checkAdminLogged)
app.post('/UpdateUser',isAdminLoggedIn, adminController.updateUser)


app.listen(4000, () => {
  console.log("server running on 4000....");
});

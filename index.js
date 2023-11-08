const express = require("express");
const cors = require("cors");
const cookieParser = require('cookie-parser')
const app = express();
const mongoose = require("mongoose");
const userController  = require('./Controllers/userController')
const adminController  = require('./Controllers/adminController')
const {isLoggedIn,isAdminLoggedIn,isLoggedOut,isAdminLoggedOut,verifyToken} = require('./Middlewares/auth')



mongoose
  .connect("mongodb://localhost:27017/RUSM")
  .then(() => console.log("db connected"))
  .catch((error) => console.log(error));

app.use(cors({
    origin:['http://localhost:3001'],
    methods:['GET','POST'],
    credentials:true
}));
app.use(cookieParser())
app.use(express.json());

app.get('/checkLoggin',isLoggedOut,userController.checkLogin)
app.get("/register",isLoggedOut,userController.checkLogin )

app.post("/register",userController.createUser )
app.post("/login",userController.verifyLogin )
app.get('/userLogout',isLoggedIn,userController.userLogout)
app.get('/userHome',isLoggedIn,verifyToken,userController.getUserHome)
app.post('/updateProfile',isLoggedIn,verifyToken,userController.updateProfile)



//admin routes

app.get('/adminLogin',isAdminLoggedOut,adminController.getAdminLogin)

app.post('/adminLogin',adminController.verifyAdminLogin)
app.get('/dashboard',isAdminLoggedIn,adminController.getDashboard)
app.get('/getUsers',isAdminLoggedIn,adminController.getUsers)
app.get('/adminLogout',isAdminLoggedIn,adminController.adminLogout)
app.post('/deleteUser',isAdminLoggedIn,adminController.deleteUser)

app.post('/createUser',isAdminLoggedIn,adminController.createUser)
app.post('/UpdateUser',isAdminLoggedIn, adminController.updateUser)


app.listen(4000, () => {
  console.log("server running on 4000....");
});

const User = require("../Models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.verifyAdminLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email) {
      return res.json({ error: "email is required" });
    }
    if (!password) {
      return res.json({ error: "password is required" });
    }
    await User.findOne({ email: email }).then((user) => {
      if (user.isAdmin) {
        bcrypt.compare(password, user.password, (err, decoded) => {
          if (decoded) {
            const token = jwt.sign({ email: user.email }, "fazi5566");
            res.cookie("AdminToken", token);
            console.log(req.cookies);
            res.json({ success: "Admin login successfull" });
          } else {
            return res.json({ error: "password is incorrect" });
          }
        });
      } else {
        return res.json({ error: "Admin not exists" });
      }
    });
  } catch (error) {
    res.json(error);
  }
};

exports.getDashboard = async (req, res) => {
  res.json({ success: "Admin Enters dashboard successfully" });
};

exports.getUsers = async (req, res) => {
  const users = await User.find({ isAdmin: false });
  res.json({ success: "users list send", users });
};

exports.adminLogout = (req, res) => {
  const token = req.cookies.AdminToken;

  if (token) {
    res.clearCookie("AdminToken");
    res.json({ success: "Logout successful" });
  } else {
    res.json({ error: "Logout failed" });
  }
};

exports.deleteUser = async (req, res) => {
  const { userId } = req.body;

  try {
    const deleted = await User.findByIdAndDelete(userId);
    if (deleted) {
      const users = await User.find({ isAdmin: false });
      res.json({ success: "delete success", users });
    } else {
      res.json({ error: "delete failed" });
    }
  } catch (error) {
    console.log(error.message);
  }
};

exports.getAdminLogin = (req, res) => {
  res.json({ success: "Admin login page loaded" });
};

exports.createUser = async(req, res) => {
  const { name, email, mobile, password, verify } = req.body;
  const existingEmail = await User.findOne({email:email})

  try {
    //validations
    if(!name){
      return res.json({ error: "name required" })
    }
    if(name.length<3){
      return res.json({ error: "name should be atleast 3 letters" })
    }
    if(!email){
      return res.json({ error: "email required" })
    }
    if(!email.includes('@gmail.com'||'@GMAIL.COM')){
      return res.json({ error: "Enter a valid Email" })
    }
    if(!mobile){
      return res.json({ error: "mobile required" })
    }
    if(mobile.length!==10){
      return res.json({ error: "Enter a valid mobile number" })
    }
    if(!password){
      return res.json({ error: "password required" })
    }
    if(password.length<6){
      return res.json({ error: "password must be greater than 6 letters" })
    }
    if(existingEmail){
      return res.json({ error: 'user already exits.Please enter another email' })
    }
   

    bcrypt.hash(password, 10).then((hash) => {
      User.create({
        name,
        mobile,
        email,
        password: hash,
        isVerified: verify,
      })
        .then(async (user) => {
          const users = await User.find({ isAdmin: false });
          res.json({ success: "user created", users });
        })
        .catch((err) => res.json({ error: "error in creating user" }));
    });
  } catch (error) {
    console.log(error);
  }
};


exports.updateUser = async (req, res) => {
  const { name,email, mobile, verify } = req.body;
  try {
    if(!name){
      return res.json({error:'name required'})
    }
    if(name.length<3){
      return res.json({error:'name must have atleast 3 letters'})
    }
    if(!mobile){
      return res.json({error:'mobile required'})
    }
    if(mobile.length<10 || mobile.length>10){
      return res.json({error:'Enter a valid Mobile number'})
    }
    const user = await User.findOneAndUpdate(
      {email:email},
      {
        $set: {
          name,
          mobile,
          isVerified: verify,
        },
      },
      { new: true }
    );

    if (user) {
      return res.json({ success: "User updated successfully." });
    } else {
      return res.json({ error: "User not found or updation failed." });
    }
  } catch (error) {
    return res.json({ error: "Failed to update user."});
  }
};
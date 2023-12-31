const User = require("../Models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const sharp = require("sharp");

exports.checkLogin = async (req, res) => {
  token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  jwt.verify(token, "fazi5566", async (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Token verification failed" });
    }
    req.userId = decoded.userId; // Make userId available in the request object
    const loggedUser = await User.findById(req.userId);
    res.json({ success: "Already logged user", user: loggedUser });
  });
};

exports.createUser = async (req, res) => {
  const { name, email, mobile, password } = req.body;
  const existingEmail = await User.findOne({ email: email });
  try {
    //validations
    if (!name) {
      return res.json({ error: "name required" });
    }
    if (name.length < 3) {
      return res.json({ error: "name should be atleast 3 letters" });
    }
    if (!email) {
      return res.json({ error: "email required" });
    }
    if (!email.includes("@gmail.com" || "@GMAIL.COM")) {
      return res.json({ error: "Enter a valid Email" });
    }
    if (!mobile) {
      return res.json({ error: "mobile required" });
    }
    if (mobile.length !== 10) {
      return res.json({ error: "Enter a valid mobile number" });
    }
    if (!password) {
      return res.json({ error: "password required" });
    }
    if (password.length < 6) {
      return res.json({ error: "password must be greater than 6 letters" });
    }
    if (existingEmail) {
      return res.json({
        error: "user already exits.Please enter another email",
      });
    }

    bcrypt.hash(password, 10).then((hash) => {
      User.create({
        name,
        mobile,
        email,
        password: hash,
      })
        .then((user) => res.json({ success: "register success" }))
        .catch((err) => res.json({ error: "register failed" }));
    });
  } catch (error) {
    console.log(error);
  }
};

exports.verifyLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email) {
      return res.json({ error: "email is required" });
    }
    if (!password) {
      return res.json({ error: "password is required" });
    }
    User.findOne({ email: email }).then((user) => {
      if (user) {
        bcrypt.compare(password, user.password, (err, decoded) => {
          if (decoded) {
            const token = jwt.sign(
              { email: user.email, userId: user._id },
              "fazi5566"
            );
            if (user.isVerified) {
              res.cookie("token", token);
              res.json({ success: "login successfull", userId: user._id });
            } else {
              return res.json({ error: "User is not verified by the Admin" });
            }
          } else {
            return res.json({ error: "password is incorrect" });
          }
        });
      } else {
        return res.json({ error: "user not exists" });
      }
    });
  } catch (error) {
    res.json(error);
  }
};

exports.userLogout = (req, res) => {
  const token = req.cookies.token;

  if (token) {
    res.clearCookie("token");
    res.json({ success: "Logout successful" });
  } else {
    res.json({ error: "Logout failed" });
  }
};

const multerStorage = multer.memoryStorage();
const multerFilter = (res, file, cb) => {
  // const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image !, Please upload only Images", 400), false);
  }
};
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});
exports.uploadUserProfile = upload.single("profile");

exports.resizeUserProfile = async (req, res, next) => {
  try {
    if (!req.file) return next();
    req.file.filename = `user-${req.body.email}-${Date.now()}.jpeg`;
    req.body.profile = req.file.filename;
    await sharp(req.file.buffer)
      .resize(500, 500)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`public/profile/${req.file.filename}`);
    next();
  } catch (error) {
    res.json({ error: "error in resizing image" });
    console.log(error.message);
  }
};

exports.editProfile = async (req, res) => {
  try {
    const data = {
      name: req.body.name,
      mobile: req.body.mobile,
    };
    if (req.body.profile) {
      data.profile = req.body.profile;
    }
    const updatedData = await User.findOneAndUpdate(
      { email: req.body.email },
      data
    );
    res.status(200).json({
      success: "profile updated successfully",
      user: updatedData,
      data: updatedData,
    });
  } catch (error) {
    console.log(error.message);
  }
};

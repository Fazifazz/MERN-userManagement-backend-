const mongoose = require("mongoose");
// import {image} from '../../client/src/Components/Home/avatar.png'


const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    mobile: { type: Number, required: true },
    isAdmin:{type:Boolean,required:true,default:false},
    isVerified:{type:Boolean,required:true,default:false},
    image:{type:String,default:''}  
  },
);

module.exports = mongoose.model("User", userSchema);

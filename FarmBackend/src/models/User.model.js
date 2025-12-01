import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

//defining user schema
const UserSchema = new mongoose.Schema({
    //all the fields are objects with some attributes
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: [true, "Username should be unique"],
      trim: true,
      lowercase: true,
      minlength: 3,
      maxlength: 30,
      match: [/^[a-zA-Z0-9_]+$/,"Username should only contain alphabets and underscore"],     // allow only alphanumeric + underscore
      index: true,
    },

    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      minlength: [2, "Full name must be atleast 2 characters!"],
      maxlength: [20, "Full name must be less than 20 characters"],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      select: false,
      minlength: [8, "Password length should be of 8 letters"], // security min length
      maxlength: [30, "Password must be less than 30 characters"]
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: [true, "Email is already in use"],
      lowercase: true,
      trim: true,
      match:/^[a-zA-Z0-9._%+-]+@gmail\.com$/, // email format validation
    },

    refreshToken: {
      type: String,
      select: false, // hides token on accidental queries
    },
},
{
    //provides the date and time as other fields
    timestamps:true
})


//password should be stored in hash format
//adding essential functions like password check

//pre is middleware that provides us a way to write functionlity before the data is stored in the database
//hashing the password everytime if it is modified or updated
UserSchema.pre('save', async function(next){
    if (!this.isModified("password")) {
        //if the password is not modified then skips the encrypting functionality
        next();
    }

    //brcypt is a library that is used for encrypting data
    //hashing the password
    this.password = await bcrypt.hash(this.password, 10)
    next();
})


//we can add our custom method to the schema using the default methods function
UserSchema.methods.comparePassword = async function(password){
    //return true if the entered passoword is same as what is stored in database
    return await bcrypt.compare(password, this.password);
}

//generates the access token 
UserSchema.methods.generateAccessToken = function(){
    return jwt.sign({
        //payload 
        _id:this._id
    },
        //token secret
        process.env.ACCESS_TOKEN_SECRET,
        {
            //token expiry
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

//generates the access token 
UserSchema.methods.generateRefreshToken = function(){
    return jwt.sign({
        //payload 
        _id:this._id
    },
        //token secret
        process.env.REFRESH_TOKEN_SECRET,
        {
            //token expiry
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", UserSchema);
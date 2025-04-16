
const mongoose= require('mongoose');
const {isEmail} = require('validator')
const bcrypt = require('bcrypt');
const joi = require('joi');
const userSchema = new mongoose.Schema({
  username: { 
      type: String
  },
  firstName: {
    type: String
},
lastName: {
    type: String
},
  names: {
      type: String
  },
  image: {
    type: String
},
  profile: {
      names: { type: String },
      bio: { type: String },
      avatar: { type: String }
  },
  role: {
      type: String,
      enum: ['patient', 'doctor','admin'],
      default:'patient'

    
  },
  address: {type:String},
  phoneNumber: { type: String },
  dateOfBirth:{ type:Date},
  email: {
      type: String,
      required: [true, 'Please provide email'],
      unique: true,
      lowercase: true,
      validate: {
          validator: function(value) {
              return /\S+@\S+\.\S+/.test(value); // Regular expression for email validation
          },
          message: 'Please provide a valid email'
      }
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other']
  },
  password: {
      type: String,
      required: [true, 'Please provide password'],
      minLength: [8, 'Must be at least 8 characters']
  },
  otpExpires:{type:String},
  otp: {
    type: String
},
  verified:{type:Boolean,default:false }
}, { timestamps: true });

// fire a function before  saving user

userSchema.pre('save', async function (next){
    if(!this.isModified('password')) {
      return  next();
    }
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password,salt);
    next();
});
// static method to login user
userSchema.statics.login = async function(email,password){
    const user = await this.findOne({ email});
    if(user){
  const auth = await bcrypt.compare(password,user.password);
  
  if(auth ){
    return user;
  }
  throw Error('Incorrect password');
    }
    throw Error('Incorrect email');
};
const user = mongoose.model('User', userSchema);
module.exports =user;
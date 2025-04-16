const asyncWrapper = require('../Middleware/async');
const userModel= require('../Models/User');
const otpModel = require('../Models/otpmodel'); 
const jwt = require('jsonwebtoken');
const Badrequest=require('../Error/BadRequest');
const cloudinary =require('cloudinary');
const Notfound=require('../Error/NotFound');
const bcrypt = require('bcrypt');
const UnauthorizedError =require('../Error/Unauthorized');
const sendEmail = require('../Middleware/Sendmail');
cloudinary.v2.config({
    cloud_name: process.env.cloud_name,
    api_key: process.env.api_key,
    api_secret: process.env.api_secret
  });

const userController ={
    
    getAllUsers: asyncWrapper(async (req, res,next) => {
        const users = await userModel.find({})
        res.status(200).json({ users })
      }),
    

    createUser: asyncWrapper(async (req, res, next) => {
        const email = req.body.email.toLowerCase();
      const foundUser = await userModel.findOne({ email });
      if (foundUser) {
          return next(new Badrequest("Email already in use"));
      };

      if (!req.files || !req.files.image || req.files.image.length === 0) {
        return next(new Badrequest("Image file is required."));
      }
      const otp = Math.floor(Math.random() * 8000000);
      const otpExpirationDate = new Date(Date.now() + 5 * 60 * 1000); 
         const dateNow = Date.now();
          const image = `IMAGE_${dateNow}`;
          const ImageCloudinary = await cloudinary.v2.uploader.upload(req.files.image[0].path,{
            folder:`CareConnect`,
            public_id: image
          })
    
      const newUser = new userModel({
        username:req.body.username,
        firstName:req.body.firstName,
        lastName:req.body.lastName,
        names:req.body.names,
        image:ImageCloudinary.secure_url,
        role:req.body.role,
        profile:req.body.profile,
        address:req.body.address,
        phoneNumber:req.body.phoneNumber,
        dateOfBirth:req.body.dateOfBirth,
        email:req.body.email,
        password:req.body.password,
        gender:req.body.gender,
        otp: otp,
        otpExpires: otpExpirationDate,
    });

    const savedUser = await newUser.save();
        const body=`Your OTP is ${otp}`;
        
        await sendEmail(req.body.email, "Verify your account",body );
      // await sendOtpEmail(req.body.email,res);
        // Ensure this is the only response sent for this request
        res.status(200).json({ user: savedUser, otp: otp });
    }),
    
    
    OTP: asyncWrapper(async(req,res,next) =>{
    
      const foundUser = await userModel.findOne({ otp: req.body.otp });
      if (!foundUser) {
          next(new UnauthorizedError('Authorization denied'));
      };
  
      // Checking if the otp is expired or not.
      console.log('otpExpires:', new Date(foundUser.otpExpires));
      console.log('Current time:', new Date());
      if (foundUser.otpExpires < new Date().getTime()) {
          next(new UnauthorizedError('OTP expired'));
      }
  
      // Updating the user to verified
      foundUser.verified = true;
      const savedUser = await foundUser.save();
  
      if (savedUser) {
          return res.status(201).json({
              message: "User account verified!",
              user: savedUser
          });
      
      }}),

    deleteUser: asyncWrapper(async (req, res, next) => {
      const { id: userID } = req.params;
      const user = await userModel.findOneAndDelete({ _id: userID })
     
      res.status(200).json({ user })
    }),

    UpdatePassword :asyncWrapper(async (req, res,next) => {
      const { currentPassword, newPassword,confirm } = req.body;
      const userId = req.userId; // Assuming the user ID is retrieved from the authenticated user
  
      
          // Find the user by ID
          const user = await userModel.findById(userId);
          if (!user) {
            return next(new Notfound(`User not found`));
          }
  
          // Check if the current password matches the password stored in the database
          const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
          if (!isPasswordValid) {
              console.log('Incorrect current password provided');
              return res.status(400).json({ error: 'Incorrect current password' });
          }
    // Check if newPassword and confirm are equal
    if (newPassword !== confirm) {
      return res.status(400).json({ error: 'New password and confirm password do not match' });
  }
          user.password=newPassword;
  
          // Save the updated user object to the database
          await user.save();
  
          console.log('Password updated successfully');
          return res.json({ success: true, message: 'Password updated successfully' });
      
  }),
    
    updateUser: asyncWrapper(async (req, res,next) => {
      const { id } = req.params;
        const updatedUser = await userModel.findByIdAndUpdate(id, req.body, {
          new: true,
        });
        if (!updatedUser) {
          return next(new Notfound(`User not found`));
        }
        res.json(updatedUser);
    }),

 ForgotPassword : asyncWrapper(async (req, res, next) => {
      const foundUser = await userModel.findOne({ email: req.body.email });
      if (!foundUser) {
        return next(new Notfound(`Your email is not registered`));
      }
      // Generate token
      const token = jwt.sign({ id: foundUser.id }, process.env.SECRET_KEY, { expiresIn: "15m" });
  
      // Recording the token to the database
      await otpModel.create({
          token: token,
          user: foundUser._id,
          expirationDate: new Date(Date.now() + 5 * 60 * 1000),
      });
  
      const link = `http://localhost:5003/auth/reset?token=${token}&id=${foundUser.id}`;
      const emailBody = `Click on the link bellow to reset your password\n\n${link}`;
  
      await sendEmail(req.body.email, "Reset your password", emailBody);
      
  
      res.status(200).json({
          message: "We sent you a reset password link on your email!",
          link:link
         
      });
     
  }),
  ResetPassword: asyncWrapper(async (req, res, next) => {
    const { email, newPassword, confirm } = req.body;
    const { token } = req.params;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
  
    const otpRecord = await otpModel.findOne({ user: user._id, token });
    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }
  
    if (otpRecord.expirationDate < new Date()) {
      return res.status(400).json({ message: 'Token has expired' });
    }
  
    if (newPassword !== confirm) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }
  
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();
  
    await otpModel.deleteOne({ _id: otpRecord._id });
  
    return res.status(200).json({ message: 'Password reset successfully' });
})
}
module.exports = userController
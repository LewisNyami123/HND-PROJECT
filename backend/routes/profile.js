const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get('/me', protect, async (req, res) => {
  try {

    const user = await User.findById(req.user._id)
      .select('name email role level photo createdAt');

    if(!user){
      return res.status(404).json({message:'User not found'});
    }

    res.json(user);

  } catch(err){
    console.error(err);
    res.status(500).json({message:'Server error'});
  }
});

router.put('/me', protect, upload.single('photo'), async (req,res)=>{

  try{

    const updates = {
      name:req.body.name,
      email:req.body.email,
      level:req.body.level
    };

    if(req.file){

      const uploadResult = await cloudinary.uploader.upload_stream(
        { folder:"ems_profiles" },
        async (error,result)=>{

          if(error){
            return res.status(500).json({message:"Image upload failed"});
          }

          updates.photo = result.secure_url;

          const user = await User.findByIdAndUpdate(
            req.user._id,
            updates,
            {new:true,runValidators:true}
          ).select('name email role level photo');

          res.json(user);
        }
      );

      uploadResult.end(req.file.buffer);

    }else{

      const user = await User.findByIdAndUpdate(
        req.user._id,
        updates,
        {new:true,runValidators:true}
      ).select('name email role level photo');

      res.json(user);

    }

  }catch(err){

    console.error(err);
    res.status(500).json({message:'Failed to update profile'});

  }

});

module.exports = router;
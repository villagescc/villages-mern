const express = require('express');
const multer  = require('multer');
const auth = require('../../middleware/auth');
const Listing = require('../../models/Listing');
const Tag = require('../../models/Tag');
const { check, validationResult } = require('express-validator');

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './upload/posting')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix+'.'+file.originalname.split('.')[1])
  }
})
const upload = multer({ storage: storage })

router.post('/posts', async (req, res, next) => {
  Listing.find({})
    .then(lists => {
      res.send(lists);
    })
    .catch(err => next(err))
});

router.post('/upload', auth, upload.single('file'), async (req, res, next) => {
  let uploadFile = req.file;
  let tagId = [];
  try {
    for(let i=0; i<req.body.tags.length; i++) {
      let tag = await Tag.findOne({ title: req.body.tags[i] });
      if(tag) tagId.push(tag._id);
      else {
        let newTag = await Tag.create({
          title: req.body.tags[i]
        })
        tagId.push(newTag._id)
      }
    }
    const listing = await Listing.create({
      title: req.body.title,
      price: req.body.price,
      listingType: req.body.type,
      photo: uploadFile.filename,
      userId: req.user.id,
      subCategoryId: req.body.subCategory,
      description: req.body.description,
      tags: tagId,
      profileId: req.user.profileId,
    })
    res.send(listing);
  }
  catch(err) {
    console.log('upload error:', err);
    next(err);
  }
});

module.exports = router;

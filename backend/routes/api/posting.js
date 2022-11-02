const express = require('express');
const multer  = require('multer');
const auth = require('../../middleware/auth');
const Category = require('../../models/Category');
const Subcategory = require('../../models/Subcategory');
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
  console.log(req.body)
  const { category, type, radius, keyword, page } = req.body;
  try {
    const total = await Listing.countDocuments();
    const query = Listing.find();
    if(category !== '') {
      const cate = await Category.findOne({ title: category });
      const categoryId = cate._id;
      const subCategories = await Subcategory.find({ categoryId }).lean();
      query.where('subcategoryId').in(subCategories.map(subCategory => subCategory._id))
    }
    if(type !== '') {
      query.where('listingType', type);
    }
    if(keyword !== '') {
      query.where('title').regex(keyword)
    }
    const lists = await query.exec();
    res.send({ total, posts: lists })
    console.log(lists);
  }
  catch(err) {
    console.log('filter error:', err);
    next(err);
  }
});

router.post(
  '/upload',
  auth,
  [
    check('title', 'Title is Required').not().isEmpty(),
    check('type', 'Listing type is Required').not().isEmpty(),
  ],
  upload.single('file'),
  async (req, res, next) => {
    let uploadFile = req.file;
    let tagId = [];
    try {
      if(req.body.tags && req.body.tags.length > 0) {
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
      }
      const listing = await Listing.create({
        title: req.body.title,
        price: req.body.price,
        listingType: req.body.type,
        photo: uploadFile ? uploadFile.filename : null,
        userId: req.user.id,
        subcategoryId: req.body.subCategory,
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

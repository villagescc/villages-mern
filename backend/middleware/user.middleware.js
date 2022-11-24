const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './upload/user')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + '.' + file.originalname.split('.')[1])
  }
})
exports.upload = multer({ storage: storage })

// const validatePostingCreate = require('../validation/posting');
//
// exports.create = (req, res, next) => {
//   console.log(req.body)
//   const { errors, isValid } = validatePostingCreate(req.body);
//
//   if (!isValid) {
//     return res.status(400).json(errors);
//   }
//   next();
// }

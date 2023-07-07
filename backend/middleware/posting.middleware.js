const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './upload/posting')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + '.' + file.originalname.split('.')[file.originalname.split('.')?.length - 1])
  }
})
exports.upload = multer({ storage: storage })

const { validatePostingCreate } = require('../validation');

exports.create = (req, res, next) => {
  const { errors, isValid } = validatePostingCreate(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }
  next();
}

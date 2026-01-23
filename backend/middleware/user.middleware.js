const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './upload/avatar')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + '.' + file.originalname.split('.')[1])
  }
})
exports.upload = multer({ storage: storage })

const { validateProfileSave, validateChangePassword } = require('../validation');

exports.saveProfile = (req, res, next) => {
  const { errors, isValid } = validateProfileSave(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }
  next();
}

exports.changePassword = (req, res, next) => {
  const { errors, isValid } = validateChangePassword(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }
  next();
}



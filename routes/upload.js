var express = require('express');
var router = express.Router();

const handleErrorAsync = require('../service/handleErrorAsync');
const uploadControllers = require('../controllers/upload');
const { isAuth } = require('../middleware/auth');
const { uploadImg } = require('../middleware/upload');

router.post('/upload/imgur', isAuth, uploadImg, handleErrorAsync(uploadControllers.uploadImgur));

module.exports = router;
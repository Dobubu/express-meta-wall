const rateLimit = require('express-rate-limit');

const uploadLimiter = rateLimit({
	windowMs: 60 * 60 * 1000,
	max: 30,
	message:
		'Too many images upload from this IP, please try again after an hour',
	standardHeaders: true,
	legacyHeaders: false,
});

module.exports = { uploadLimiter };
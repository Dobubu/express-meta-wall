const sizeOf = require('image-size');
const { ImgurClient } = require('imgur');

const handleSuccess = require('../service/handleSuccess');
const handleError = require('../service/handleError');

const upload = {
  async uploadImgur(req, res, next) {
    if(!req.files.length) {
      return handleError('尚未上傳檔案', next);
    };

    if(req.body.type === 'user') {
      const dimensions = sizeOf(req.files[0].buffer);
      if(dimensions.width !== dimensions.height) {
        return handleError('圖片長寬不符合 1:1 尺寸', next);
      };
    };

    const client = new ImgurClient({
      clientId: process.env.IMGUR_CLIENTID,
      clientSecret: process.env.IMGUR_CLIENT_SECRET,
      refreshToken: process.env.IMGUR_REFRESH_TOKEN,
    });

    const response = await client.upload({
      image: req.files[0].buffer.toString('base64'),
      type: 'base64',
      album: process.env.IMGUR_ALBUM_ID
    });

    const dict = {
      imgUrl: response.data.link
    };

    handleSuccess(res, dict);
  },
};

module.exports = upload;
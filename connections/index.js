const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({path: './config.env'});

const DB =
  process.env.NODE_ENV === 'dev'
    ? 'mongodb://localhost:27017/postDB'
    : process.env.DATABASE.replace('<password>', process.env.DATABASE_PASSWORD);

mongoose.connect(DB)
  .then(() => console.log('db connect success2'))
  .catch(e => console.log(e));
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const path = require('path');

// const mongoose = require('mongoose');
// mongoose.connect(process.env.MONGO_LOCALHOST, {useNewUrlParser: true})
// .then(() => {
//   console.log('database is connected');
// })
// .catch(err => {
//   console.error(err);
// });

require('./sequelize_connection');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors());
app.use("/images", express.static(path.join("backend/images")));


const postsRoutes = require('./routes/posts');
const userRoutes = require('./routes/user');
app.use( '/api/posts' ,postsRoutes);
app.use('/api/user', userRoutes);

module.exports = app;

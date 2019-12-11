
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require("../models/User");

exports.signupUser = (req, res) => {
  const {email, password, username} = req.body;
  User.findOne({where: {email: email}}).then(rec => {
    if(rec) {
      res.status(500).json({message: "User is already registered"});
    } else {
      return bcrypt.hash(password, 12);
    }
  })
  .then(hashedPass => {
    return User.create({
      username, email, password: hashedPass
    });
  })
  .then(doc => {
    res.status(201).json({
      user: {
        email: doc.email,
        id: doc._id,
        username: doc.username
      }, message: "User successfully created"
    })
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({message: err.code});
  });

};

exports.loginUser = (req, res) => {
  const {email, password} = req.body;
  let fetchedUser;
  User.findOne({where: {email: email}}).then(user => {
    if(user) {
      fetchedUser = user;
      return bcrypt.compare(password, user.password)
    } else {
      res.status(401).json({message: "Invalid credentials"});
    }
  })
  .then(doc => {
    if(doc) {
      return jwt.sign({id: fetchedUser._id,
        username: fetchedUser.username, expirationTime: '2h'},
        process.env.JWT_KEY, {expiresIn: '2h'});
    } else {
      res.status(401).json({message: "Invalid credentials"});
    }
  })
  .then(token => {
    res.status(200).json({
      username: fetchedUser.username,
      id: fetchedUser._id,
      token,
      expiresIn: 2*3600
    });
  })
  .catch(err => {
    console.log(err);
    res.status(401).json({message: "Invalid credentials"});
  });

};


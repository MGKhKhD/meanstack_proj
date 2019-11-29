const express = require('express');
const router = express();

const UserController = require('../controllers/user');

router.post("/signup", UserController.signupUser);
router.post("/login", UserController.loginUser);

module.exports = router;

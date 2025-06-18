const express = require("express"); 
const router = express.Router(); 

// Authentication middleware
const authMiddleware = require("../MiddleWare/authMiddleWare");

// user controllers
const { login, register, checkUser } = require("../Controller/userController"); // Imports specific controller functions

router.post("/register", register);

// Login user
router.post("/login", login);

// Check user
router.get("/check", authMiddleware, checkUser);

module.exports = router;
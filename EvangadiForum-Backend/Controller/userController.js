const dbConnection = require("../Db/dbConfig");
const bcrypt = require("bcrypt"); // For password hashing
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");

//* Function to handle user login
async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please enter all required fields" });
  }

  try {
    const [user] = await dbConnection.query(
      "SELECT username, userid, password FROM users WHERE email = ?",
      [email]
    );

    // Check if user exists in database (user.length will be 0 if not found)
    if (user.length == 0) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "invalid credential" });
    }

    // Compare provided password with stored hashed password using bcrypt
    const isMatch = await bcrypt.compare(password, user[0].password);

    if (!isMatch) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ msg: "Invalid credentials" });
    }

    const { username, userid } = user[0];

    const token = jwt.sign(
      // Creates a JWT
      { username, userid },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    // Send success response with token and username
    return res
      .status(StatusCodes.OK)
      .json({ msg: "user login successful", token, username });
  } catch (error) {
    console.log("Login error:", error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "something went wrong, try again later!" });
  }
}

//* Function to handle user registration
async function register(req, res) {
  // Asynchronous function for DB and hashing
  const { username, firstname, lastname, email, password } = req.body; // Get all registration fields

  // Validate that all required fields are provided
  if (!email || !password || !firstname || !lastname || !username) {
    // Corrected: Added opening curly brace here
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please provide all required fields" });
  }

  try {
    // Check if user already exists with provided username or email
    const [user] = await dbConnection.query(
      "SELECT username, userid FROM users WHERE username = ? OR email = ?",
      [username, email]
    );

    if (user.length > 0) {
      // If user found, registration fails
      return res
        .status(StatusCodes.CONFLICT)
        .json({ msg: "User already registered" });
    }

    // password must be at least 8 characters
    if (password.length < 8) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Password must be at least 8 characters" });
    }

    // Encrypt the password using bcrypt
    const salt = await bcrypt.genSalt(10); 
    const hashedPassword = await bcrypt.hash(password, salt); // Hashes the password with the salt

    // Insert new user into the database
    await dbConnection.query(
      "INSERT INTO users (username, firstname, lastname, email, password) VALUES (?, ?, ?, ?, ?)",
      [username, firstname, lastname, email, hashedPassword] 
    );

    return res
      .status(StatusCodes.CREATED)
      .json({ msg: "User registered successfully" });
  } catch (error) {
    console.log("Registration error:", error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "An unexpected error occurred." });
  }
}

//* Function to check user status
async function checkUser(req, res) {
  if (!req.user || !req.user.username || !req.user.userid) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: "Unauthorized or missing user data" });
  }

  const { username, userid } = req.user;

  res.status(StatusCodes.OK).json({ msg: "valid user", username, userid });
}

module.exports = {
  register,
  login,
  checkUser,
};

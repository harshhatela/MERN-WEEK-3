const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * generateToken — creates a signed JWT containing the user's id.
 * The token expires in 7 days so the user stays logged in for a week.
 */
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 *
 * Steps:
 * 1. Validate that name, email, and password are all provided.
 * 2. Check if a user with that email already exists (emails are unique).
 * 3. Create the user — the password is hashed automatically by the
 *    pre-save hook in the User model.
 * 4. Return the new user's info along with a JWT.
 */
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // --- Validation: check for missing fields ---
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide name, email, and password" });
    }

    // --- Check if email is already registered ---
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "A user with this email already exists" });
    }

    // --- Create user (password is auto-hashed by the model's pre-save hook) ---
    const user = await User.create({ name, email, password });

    // --- Respond with user info and a JWT ---
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("Register error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc    Log in an existing user
 * @route   POST /api/auth/login
 * @access  Public
 *
 * Steps:
 * 1. Validate that email and password are provided.
 * 2. Find the user by email.
 * 3. Compare the entered password against the stored hash using
 *    the matchPassword instance method (which uses bcrypt.compare).
 * 4. If credentials are valid, return the user's info with a JWT.
 * 5. If invalid, return a 400 with a clear error message.
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // --- Validation: check for missing fields ---
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email and password" });
    }

    // --- Find user by email ---
    const user = await User.findOne({ email });

    // --- Verify user exists and password matches ---
    if (!user || !(await user.matchPassword(password))) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // --- Respond with user info and a JWT ---
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { register, login };

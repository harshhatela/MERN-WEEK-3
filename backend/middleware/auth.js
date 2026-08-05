const jwt = require("jsonwebtoken");

/**
 * protect — JWT authentication middleware.
 *
 * How it works:
 * 1. Reads the "Authorization" header and expects the format "Bearer <token>".
 * 2. Verifies the token using jsonwebtoken.verify() and the JWT_SECRET.
 * 3. On success, attaches the decoded user id to req.user so downstream
 *    controllers know which user is making the request.
 * 4. On failure (missing header, bad format, expired/invalid token),
 *    returns a 401 Unauthorized response.
 */
const protect = (req, res, next) => {
  // Grab the Authorization header
  const authHeader = req.headers.authorization;

  // Check that the header exists and starts with "Bearer"
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Not authorized, no token provided" });
  }

  // Extract the token part (everything after "Bearer ")
  const token = authHeader.split(" ")[1];

  try {
    // Verify the token and decode its payload (contains { id: userId })
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the user id to the request object for use in controllers
    req.user = { id: decoded.id };

    next(); // Token is valid — proceed to the next middleware / route handler
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Not authorized, token is invalid" });
  }
};

module.exports = protect;

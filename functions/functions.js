const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");

const generateToken = (user) => {
    const payload = {
        user: {
          id: user._id,
        },
      };
    jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          return token
        }
      );
}

module.exports = {
    generateToken
}
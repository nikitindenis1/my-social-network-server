const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const jwt = require("jsonwebtoken");
const config = require("config");
const bcrypt = require("bcryptjs");
const { successfulBody, failureBody } = require("../../tools/routing_tools");
var ObjectID = require("mongodb").ObjectID;
const User = require("../../models/User");

//@route POST api/auth/login-by-jwt
//@desc LOGIN WITH JWT
//@access Private

router.get("/login-by-jwt", auth, async (req, res) => {
  const _id = new ObjectID(req.user.id);
  try {
    let user = await User.findOne({ _id }).select("-password");
    if (user) {
      return res.send(successfulBody(user));
    }
    return res.send(failureBody("User not found"));
  } catch (err) {
    console.error(err.message);
    res.status(500).send("server error");
  }
});

//@route POST api/auth
//@desc authenticate user & get token
//@access PUBLIC
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    let user = await User.findOne({
      $or: [{ username: username }, { email: username }],
    });
    if (!user) {
      return res.send(failureBody("Invalid username or password"));
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.send(failureBody("Invalid credentials"));
    }
    const payload = {
      user: {
        id: user.id,
      },
    };
    jwt.sign(
      payload,
      config.get("jwtSecret"),
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;
        let body = {
          token,
          ...user._doc,
        };
        return  res.send(successfulBody(body));
      }
    );

 
  } catch (err) {
    console.error(err.message);
    res.status(500).send("server error");
  }
});
module.exports = router;

const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { successfulBody, failureBody } = require("../../tools/routing_tools");
var ObjectID = require("mongodb").ObjectID;
const auth = require("../../middleware/auth");
const User = require("../../models/User");
const Follower = require("../../models/Followers");
//@route POST api/user
//@desc Register user
//@access PUBLIC

router.post("/create", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.send(failureBody(`Another account is using ${email}`));
    }
    user = await User.findOne({ username });
    if (user) {
      return res.send(failureBody("The username is not available"));
    }
    await User.create(req.body).then(async (result) => {
      return res.send(successfulBody(result));
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("server error");
  }
});

//@route POST api/users/update
//@desc update user
//@access Private

router.post("/update", auth, async (req, res) => {
  let _id = new ObjectID(req.user.id);
  const { email, username } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user && user._id != req.user.id) {
      return res.send(failureBody("Email already taken"));
    }
    user = await User.findOne({ username });
    if (user && user._id != req.user.id) {
      return res.send(failureBody("Username already taken"));
    }
    user = await User.findOneAndUpdate(
      { _id },
      { $set: req.body },
      { new: true }
    );
    await user.save();
    res.send(successfulBody(user));
  } catch (error) {
    res.send(failureBody("Couldnt change password"));
  }
});

router.post("/update-followers", auth, async (req, res) => {
  let _id = new ObjectID(req.body.user_id);
  let follower_id = new ObjectID(req.body.follower_id);
  try {
      let body = await User.handleFollower(_id, follower_id)
    // let following_user = await User.findOne({ _id:new ObjectID(follower_id) });
    return res.send(successfulBody(body));
  } catch (error) {
    res.send(failureBody("server error"));
  }
});

//@route POST api/users/update
//@desc update user
//@access Private

router.post("/search", auth, async (req, res) => {
  const { key } = req.body;
  try {
    if (key) {
      users = await User.find({ username: { $regex: key, $options: "i" } });
      return res.send(successfulBody(users));
    }
    return res.send(successfulBody([]));
  } catch (error) {
    res.send(failureBody("server error"));
  }
});

//@route POST api/users/reset-password
//@desc Reset user password
//@access Private

router.post("/reset-password", auth, async (req, res) => {
  let _id = new ObjectID(req.user.id);
  const { password } = req.body;

  try {
    let user = await User.findOne({ _id });
    if (user) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();
      res.send(successfulBody("Password updated"));
    }
  } catch (error) {
    res.send(failureBody("Couldnt change password"));
  }
});

router.get("/get-by-username", auth, async (req, res) => {
  let { username } = req.query;
  try {
    const user = await User.getByUsername(username)
    if (!user) {
      return res.send(failureBody("User not found"));
    }
    return res.send(successfulBody(user[0]));
  } catch (error) {
    return res.send(failureBody("User not found"));
  }
});


router.get("/get-followers", auth, async (req, res) => {
  let { id } = req.query;
  try {
    const user = await User.getFollowers(new ObjectID(id))
   
    return res.send(successfulBody(user));
  } catch (error) {
    return res.send(failureBody("User not found"));
  }
});
router.get("/get-following", auth, async (req, res) => {
  let { id } = req.query;
  try {
    const user = await User.getFollowing(new ObjectID(id))
   
    return res.send(successfulBody(user));
  } catch (error) {
    return res.send(failureBody("User not found"));
  }
});
module.exports = router;

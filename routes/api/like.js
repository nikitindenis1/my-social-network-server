const express = require("express");
const auth = require("../../middleware/auth");
const router = express.Router();
const { successfulBody, failureBody } = require("../../tools/routing_tools");
const moment = require("moment");
const ObjectID = require("mongodb").ObjectID;
const User = require("../../models/User");
const Like = require("../../models/Like");

//@route GET api/like/create
//@desc create post like
//@access Private

router.post("/create", auth, async (req, res) => {
  const user_id = new ObjectID(req.user.id);
  try {
    let user = await User.findOne({ _id: user_id });

    let like = new Like(req.body);
    like.user_id = user_id;
    like.username = user.username;
    like.save();
    return res.send(successfulBody(like));
  } catch (error) {
    return res.send(failureBody());
  }
});

//@route GET api/like/delete
//@desc delete like
//@access Private

router.post("/delete", auth, async (req, res) => {
  const user_id = new ObjectID(req.user.id);
  const { post_id } = req.body;
  try {
    let like = await Like.findOne({ post_id, user_id });
    await Like.findOneAndRemove({ _id: like._id });
    return res.send(successfulBody(like.user_id));
  } catch (error) {
    return res.send(failureBody());
  }
});

//@route GET api/like/get-by-post
//@desc get likes by post id
//@access Private
router.get("/get-by-post", auth, async (req, res) => {
  const post_id = new ObjectID(req.query.post_id);

  try {
  
    let likes = await Like.aggregate([
      {$match:{post_id}},
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $sort: {
          created_at: -1,
        },
      },
    ])
    return res.send(successfulBody(likes));
  } catch (error) {
    return res.send(failureBody());
  }
});


//@route GET api/like/get-by-user
//@desc get likes by user id
//@access Private
router.get("/get-by-user", auth, async (req, res) => {
  const post_id = new ObjectID(req.query.post_id);
  const user_id = new ObjectID(req.user.id);

  try {
    let like = await Like.findOne({ post_id, user_id });
    return res.send(successfulBody(like));
  } catch (error) {
    return res.send(failureBody());
  }
});





module.exports = router;

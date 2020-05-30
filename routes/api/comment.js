const express = require("express");
const auth = require("../../middleware/auth");
const router = express.Router();
const { successfulBody, failureBody } = require("../../tools/routing_tools");
const moment = require("moment");
const ObjectID = require("mongodb").ObjectID;
const User = require("../../models/User");
const Comment = require("../../models/PostComment");

//@route GET api/comment/create
//@desc create post comment
//@access Private

router.post("/create", auth, async (req, res) => {
  const user_id = new ObjectID(req.user.id);
  try {
    let user = await User.findOne({ _id: user_id });
    console.log(user)
    let comment = new Comment(req.body);
    comment.user_id = user_id;
    comment.username = user.username;
    comment.save();
    return res.send(successfulBody(comment));
  } catch (error) {
    return res.send(failureBody());
  }
});



//@route GET api/comment/delete
//@desc delte comment
//@access Private

router.get("/delete", auth, async (req, res) => {
  const user_id = new ObjectID(req.user.id);
  const comment_id = new ObjectID(req.query.comment);
  try {
 await Comment.findOneAndRemove({ user_id, _id:comment_id });
    return res.send(successfulBody('comment deleted'));
  } catch (error) {
    return res.send(failureBody());
  }
});



//@route GET api/comments/get-by-post
//@desc get comments by post id
//@access Private
router.get("/get-by-post", auth, async (req, res) => {
  const post_id = new ObjectID(req.query.post_id);

  try {
    let comments = await Comment.aggregate([
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
    return res.send(successfulBody(comments));
  } catch (error) {
    return res.send(failureBody());
  }
});
module.exports = router;

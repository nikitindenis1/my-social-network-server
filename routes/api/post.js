const express = require("express");
const auth = require("../../middleware/auth");
const router = express.Router();
const { successfulBody, failureBody } = require("../../tools/routing_tools");
var ObjectID = require("mongodb").ObjectID;
const Post = require("../../models/Post");
const Comment = require("../../models/PostComment");
const Like = require("../../models/Like");

//@route GET api/post/create
//@desc create post
//@access Private

router.post("/create", auth, async (req, res) => {
  const user = new ObjectID(req.user.id);
  try {
    if(!req.body.text)  return res.send(failureBody('missing text'));
    let body = req.body
    body.user_id = user
    const post = await  Post.createPost(body);
    console.log(post)
    return res.send(successfulBody(post));
  } catch (error) {
    return res.send(failureBody());
  }
});



router.post("/update", auth, async (req, res) => {
  const _id = new ObjectID(req.body._id);
  try {
    let post = await Post.findOneAndUpdate(
      { _id },
      { $set: req.body },
      { new: true }
    );
    return res.send(successfulBody('post updated'));
  } catch (error) {
    return res.send(failureBody());
  }
});




router.get("/all", auth, async (req, res) => {
  const {skip, limit} = req.query
  try {
    let posts = await Post.getAll(Number(skip), Number(limit))
    return res.send(successfulBody(posts));
  } catch (error) {
    return res.send(failureBody());
  }
});


router.get("/delete", auth, async (req, res) => {
    const {_id} = new ObjectID(req.query.post_id )
  try {
      await Comment.deleteMany({post_id:_id})
      await Like.deleteMany({post_id:_id})
      await Post.findOneAndDelete({_id})
    return res.send(successfulBody('post deleted'));
  } catch (error) {
    return res.send(failureBody());
  }
});


router.get("/get-by-id", auth, async (req, res) => {
  const _id = new ObjectID(req.query.id);
  try {
    let comments = await Comment.aggregate([
      { $match: { post_id: _id } },
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          as: "user_details",
        },
      },
      { $unwind: "$user_details" },

      {
        $project: {
          created_at: 1,
          images: 1,
          text: 1,
          _id: 1,
          user_details: {
            _id: 1,
            username: 1,
            avatar: 1,
          },
        },

      },
      {
        $sort: {
          created_at: -1,
        },
      },
    ]);
    let likes = await Like.countDocuments({ post_id: _id })
    let body = {
      comments,
      likes,
    };
    return res.send(successfulBody(body));
  } catch (error) {
    return res.send(failureBody());
  }
});




module.exports = router;

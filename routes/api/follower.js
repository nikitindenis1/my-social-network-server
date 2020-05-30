const express = require("express");
const auth = require("../../middleware/auth");
const router = express.Router();
const { successfulBody, failureBody } = require("../../tools/routing_tools");
const moment = require("moment");
const ObjectID = require("mongodb").ObjectID;
const Follower = require("../../models/Followers");

// @route GET api/follow/create
// @desc create post follow
// @access Private

router.post("/create", auth, async (req, res) => {
  const user_id = new ObjectID(req.user.id);
  try {
    let follow = await Follower.findOne({user_id})
    if(follow) return update()
     follow = new Follower(req.body)
    follow.save();
    return res.send(successfulBody(follow));
  } catch (error) {
    return res.send(failureBody());
  }
});

const update =() => {
  router.post("/update", auth, async (req, res) => {
    const user_id = new ObjectID(req.user.id);
    try {
      let follow = await Follower.findOneAndUpdate(
        { user_id },
        { $set: req.body },
        { new: true }
      )
      follow.save();
      return res.send(successfulBody(follow));
    } catch (error) {
      return res.send(failureBody());
    }
  });
}





//@route GET api/comments/get-by-post
//@desc get comments by post id
//@access Private
// router.get("/get-by-post", auth, async (req, res) => {
//   const post_id = new ObjectID(req.query.post_id);

//   try {
//     let comments = await Comment.aggregate([
//       {$match:{post_id}},
//       {
//         $lookup: {
//           from: "users",
//           localField: "user_id",
//           foreignField: "_id",
//           as: "user",
//         },
//       },
//       { $unwind: "$user" },
//       {
//         $sort: {
//           created_at: -1,
//         },
//       },
//     ])
//     return res.send(successfulBody(comments));
//   } catch (error) {
//     return res.send(failureBody());
//   }
// });
module.exports = router;

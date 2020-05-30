const mongoose = require("mongoose");

const FollowersSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
  },
  followers: {
    type: [],
  },
  following: {
    type: [],
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

FollowersSchema.statics.create = async function create(id) {
  let body  ={
    user_id:id,
    following:[],
    followers:[]
  }
  await new Follower(body);
};

module.exports = Follower = mongoose.model("follower", FollowersSchema);

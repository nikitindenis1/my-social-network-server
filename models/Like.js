const mongoose = require("mongoose");

const LikeSchema = new mongoose.Schema({
  post_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "post",
  },
  username:{
    type:String
  },
  user_id:{
    type:mongoose.Schema.Types.ObjectId,
  },
  user_avatar:{
    type:String
  },
  created_at: {
    type: Date,
    default: Date.now,
  }
});

module.exports = Like = mongoose.model("like", LikeSchema);

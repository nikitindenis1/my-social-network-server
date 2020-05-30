const mongoose = require("mongoose");

const PostCommentShema = new mongoose.Schema({
  post_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "posts",
  },
  text: {
    type: String,
    required: true,
  },
  username:{
    type:String
  },
  user_id:{
    type:mongoose.Schema.Types.ObjectId,
  },
  created_at: {
    type: Date,
    default: Date.now,
  }
});


PostCommentShema.set('toJSON', {
  transform(doc, ret) {
      delete ret.__v
  },
})

PostCommentShema.set('toObject', {
  transform(doc, ret) {
      delete ret.__v
  },
})


module.exports = Comment = mongoose.model("comment", PostCommentShema);


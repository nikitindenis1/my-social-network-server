const mongoose = require("mongoose");
var aggregatePaginate = require('mongoose-aggregate-paginate-v2');
const Schema = mongoose.Schema

const PostSchema = new Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
  },
  images: {
    type: [
      {
        name: String,
        url: String,
      },
    ],
  },
  text: {
    type: String,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});
PostSchema.plugin(aggregatePaginate);

PostSchema.set('toJSON', {
  transform(doc, ret) {
      delete ret.__v
  },
})

PostSchema.set('toObject', {
  transform(doc, ret) {
      delete ret.__v
  },
})
PostSchema.statics.getAll = async function getAll(page, limit) {

var query =  this.aggregate([
  {
    $sort: {
      created_at: -1,
    },
  },
  { $skip : page },
  { $limit : limit },
 
    {
      $lookup: {
        from: "users",
        localField: "user_id",
        foreignField: "_id",
        as: "user_details",
      },
    },
    {
      $lookup: {
        from: "comments",
        localField: "_id",
        foreignField: "post_id",
        as: "comments",
      },
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "post_id",
        as: "likes",
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
          followers:1,
        },
        comments: {
          _id: 1,
          text: 1,
          username: 1,
          user_id: 1,
        },
        likes: {
          user_id: 1,
        },
      },
    },
    
  
  ])

 


  return query.then((result) => (result ? result : undefined))

}

PostSchema.statics.createPost = async function createPost(body) {
    const post = await new Post(body).save()
  const query = this.aggregate([
    {
      $match: {'_id':post._id}
    },
    
    {
      $lookup: {
        from: "users",
        localField: "user_id",
        foreignField: "_id",
        as: "user_details",
      },
    },
    {
      $lookup: {
        from: "comments",
        localField: "_id",
        foreignField: "post_id",
        as: "comments",
      },
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "post_id",
        as: "likes",
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
        comments: {
          _id: 1,
          text: 1,
          username: 1,
          user_id: 1,
        },
        likes: {
          user_id: 1,
        },
      },
    },
    
    {
      $sort: {
        created_at: -1,
      },
    },
  ]);
  return query.exec().then((post) => (post[0] ? post[0] : undefined))
}


module.exports = Post = mongoose.model("post", PostSchema);

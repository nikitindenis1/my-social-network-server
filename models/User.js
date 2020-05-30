const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  following: {
    type: Array,
  },
  followers: {
    type: Array,
  },

  avatar: {
    type: String,
  },

  created_at: {
    type: Date,
    default: Date.now,
  },
}).index({ "$**": "text" });

UserSchema.statics.create = async function create({
  username,
  email,
  password,
}) {
  return new Promise(async (resolve, reject) => {
    let user = await new User({
      username,
      email,
      following: [],
      followers: [],
    });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();
    const payload = {
      user: {
        id: user.id,
      },
    };
    jwt.sign(
      payload,
      config.get("jwtSecret"),
      { expiresIn: 360000 },
      async (err, token) => {
        if (err) throw err;

        let body = {
          token,
          ...user._doc,
        };
        resolve(body);
      }
    );
  });
};

UserSchema.statics.handleFollower = async function handleFollower(
  _id,
  follower_id
) {
  return new Promise(async (resolve, reject) => {
    let user = await User.findOne({ _id });
    if (!user) return res.send(failureBody());
    let followers = [...user.followers];
    if (
      followers.some((vendor) => toString(vendor) === toString(follower_id))
    ) {
      followers = followers.filter((m) => toString(m) != toString(follower_id));
    } else {
      followers = [...followers, follower_id];
    }
    user.followers = followers;
   await  user.save();

    let follower = await User.findOne({ _id: follower_id });
    let following = [...follower.following];
    if (following.some((vendor) => toString(vendor) === toString(_id))) {
        console.log('exists')
      following = following.filter((m) => toString(m) != toString(_id));
    } else {
        console.log('not exists')
      following = [...following, _id];
    }
    follower.following = following;
   
    await follower.save();
    let body = {
      following: follower.following,
      followers: user.followers,
    };
    resolve(body);
  });
};


UserSchema.statics.getByUsername = async function getByUsername(
    username
  ) {
    return new Promise(async (resolve, reject) => {
   await User.aggregate([
            { $match: { username } },
            {
              $lookup: {
                from: "posts",
                localField: "_id",
                foreignField: "user_id",
                as: "posts",
              },
            },
      
            {
              $project: {
                posts: 1,
                _id: 1,
                username: 1,
                followers:1,
                following:1,
                email: 1,
                created_at: 1,
                updated_at: 1,
                avatar: 1,
              },
            },
            {
              $sort: {
                "posts.created_at": 1,
              },
            },
          ]).then((user) =>   resolve(user))
           

    });
  };
  
  UserSchema.statics.getFollowers = async function getFollowers(
    _id
  ) {
    return new Promise(async (resolve, reject) => {
          await User.aggregate([
                {
                    $match: { _id}
                },
                { $unwind: "$followers" },

                {
                    $lookup: {
                      from: "users",
                      localField: "followers",
                      foreignField: "_id",
                      as: "users",
                    },
                  },
                  {
                      $project:{
                        users:1
                      }
                  }
            ]).then(result => {
                resolve(result[0])
            })
           

    });
  };



    
  UserSchema.statics.getFollowing = async function getFollowing(
    _id
  ) {
    return new Promise(async (resolve, reject) => {
          await User.aggregate([
                {
                    $match: { _id}
                },
                { $unwind: "$following" },

                {
                    $lookup: {
                      from: "users",
                      localField: "following",
                      foreignField: "_id",
                      as: "users",
                    },
                  },
                  {
                      $project:{
                        users:1
                      }
                  }
            ]).then(result => {
                resolve(result[0])
            })
           

    });
  };


module.exports = User = mongoose.model("user", UserSchema);

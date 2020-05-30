const express = require("express");
const connetctDB = require("./config/db");
const app = express();
var cors = require("cors");
const fileUpload = require("express-fileupload");
const users_route = require("./routes/api/users");
const auth_auth = require("./routes/api/auth");
const post_route = require("./routes/api/post");
const comment_route = require("./routes/api/comment");
const like_route = require("./routes/api/like");
const follower_route = require("./routes/api/follower");

//Connect Database
connetctDB();
//Init Middleware
app.use(express.json({ extended: false }));
app.use(cors());
app.use(
  fileUpload({
    useTempFiles: true,
  })
);
app.get("/", (req, res) => res.send("API RUNNING"));

//Define routes

app.use("/api/user", users_route);
app.use("/api/auth", auth_auth);
app.use("/api/post", post_route);
app.use('/api/comment', comment_route)
app.use('/api/like', like_route)
app.use('/api/follow', follower_route)

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`SERVER STARTED ON PORT ${PORT}`));

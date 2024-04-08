//imports
const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");

//routes import
const userRoute = require("./api/routes/user");
const authRoute = require("./api/routes/auth");
const commentsRoute = require("./api/routes/comment");
const messagesRoute = require("./api/routes/messages");
const conversationRoute = require("./api/routes/conversations");

//middelware import
const {
  errorHandler,
  notFound,
} = require("./api/middlewares/errorsMiddleware");

//app instance
const app = express();

//connection DB
const { dataBaseConnect } = require("./api/config/db_config");
dataBaseConnect();

//middlewares
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//routes
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/comments", commentsRoute);
app.use("/api/v1/conversation", conversationRoute);
app.use("/api/v1/message", messagesRoute);

//404 & error handler
app.use(notFound);
app.use(errorHandler);

//export the app
module.exports = app;

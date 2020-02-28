const express = require("express");
const bodyParser = require("body-parser");
const HttpError = require("./models/http-error");

const placesRoutes = require("./routes/places-routes");
const userRoutes = require("./routes/users-routes");
const app = express();

// middleware - 'use' triggers on ALL requests.
app.use(bodyParser.json());

// routers
app.use("/api/places", placesRoutes);
app.use("/api/users", userRoutes);

// this runs if there is no response sent, because we do not support that route
app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

// error handler
app.use((error, req, res, next) => {
  // in case headers have somehow been already sent
  if (res.headerSent) {
    return next(error);
  }
  // send this instead
  res.status(error.code || 500).json({
    success: false,
    msg: error.message || "An unknown error occurred!"
  });
});

app.listen(5000, () => {
  console.log("server has started...");
});
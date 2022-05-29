require("dotenv").config();

const express = require("express");
require("express-async-errors");

const app = express();

const cors = require("cors");
const corsConfig = require("./config/cors");

const cookieParser = require("cookie-parser");
const auth = require("./middleware/auth");

const enableLoginAPI = require("./api/authorization");

const routes = [
  require("./api/user"),
  require("./api/patient"),
  require("./api/drug"),
  require("./api/dosage_form"),
  require("./api/pharmacological_group"),
  require("./api/component"),
  require("./api/allergy"),
  require("./api/special_instructions"),
  require("./api/disease"),
  require("./api/compare"),
];

app.use(cors(corsConfig));
app.use(express.json());
app.use(cookieParser());

enableLoginAPI(app);

app.use(auth);

routes.forEach((r) => r(app));

app.use(function (error, request, response, next) {
  const status = error.status || 400;
  response.status(status).send(error.message);
});

module.exports = app;

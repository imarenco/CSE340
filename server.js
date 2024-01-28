/* ******************************************
 * This server.js file is the primary file of the
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const env = require("dotenv").config();
const app = express();

const utilities = require("./utilities/");
const static = require("./routes/static");

const baseController = require("./controllers/baseController");
const inventoryRouter = require("./routes/inventoryRoute");

/* ***********************
 * Routes
 *************************/
app.use(static);

app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout");

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT;
const host = process.env.HOST;

app.get("/", baseController.buildHome);
app.use("/inv", inventoryRouter);

/* ***********************
 * Express Error Handler
 * Place after all other middleware
 *************************/
app.use(utilities.handleErrors(static));

app.use(async (req, res, next) => {
  next({ status: 404, message: "Page Not Found" });
});

app.use(async (err, req, res, next) => {
  const nav = await utilities.getNav();
  const message = err.status == 404 ? err.message : "Internal Server errror";
  res.render("partials/errors", {
    title: err.status || "Server Error",
    message,
    nav,
  });
});

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`);
});

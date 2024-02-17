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
const flash = require("connect-flash");
const pool = require("./database/");
const session = require("express-session");
const app = express();
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
const cookieParser = require("cookie-parser")

const utilities = require("./utilities/");
const static = require("./routes/static");

const baseController = require("./controllers/baseController");
const inventoryRouter = require("./routes/inventoryRoute");
const approveRoute = require("./routes/approveRoute");
const accountRouter = require("./routes/accountRoute");

app.use(
  session({
    store: new (require("connect-pg-simple")(session))({
      createTableIfMissing: true,
      pool,
    }),
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    name: "sessionId",
  })
);

app.use(flash());
app.use(function (req, res, next) {
  res.locals.messages = require("express-messages")(req, res);
  next();
});

app.use(cookieParser())
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

app.use(utilities.checkJWTToken)

app.get("/", baseController.buildHome);
app.use('/logout', (req, res)=>{ 
  res.clearCookie("jwt")
  return res.redirect("/")
});

app.use("/approve", approveRoute);
app.use("/inv", inventoryRouter);
app.use("/account", accountRouter);


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

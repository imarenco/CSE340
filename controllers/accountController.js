const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// Required Elements
const utilities = require("../utilities/");
const accountModel = require("../models/account-model.js");

//Builds Login View
async function buildLogin(req, res, next) {
  console.log("aca perrrrrro");
  let nav = await utilities.getNav();
  const error = req.flash("error")?.[0];

  if (error) {
    req.flash("notice", error);
  }
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
  });
}

// Build Registration View
async function buildRegistration(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  });
}

// Process Registration
async function registerAccount(req, res) {
  let nav = await utilities.getNav();
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  } = req.body;

  // Hash the password before storing
  let hashedPassword;
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash(
      "notice",
      "Sorry, there was an error processing the registration."
    );
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    });
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  );

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    );
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null, // Added later
    });
  } else {
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null, //added later
    });
  }
}

async function editAccount(req, res, next) {
  let nav = await utilities.getNav();

  const account = jwt.decode(req.cookies.jwt, process.env.ACCESS_TOKEN_SECRET);
  res.render("account/editAccount", {
    title: "Edit Account",
    nav,
    errors: null,
    ...account,
  });
}

async function accountLogin(req, res) {
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;
  const accountData = await accountModel.getAccountByEmail(account_email);

  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.");
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    });
    return;
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password;
      const accessToken = jwt.sign(
        accountData,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: 3600 * 1000 }
      );

      res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
      return res.redirect("/account/");
    }
  } catch (error) {
    return new Error("Access Forbidden");
  }
}

async function buildManagment(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/management", {
    title: "Account Management",
    nav,
    errors: null,
  });
}

async function updateAccount(req, res) {
  console.log("llegue");
  console.log("llegue");
  console.log("llegue");
  console.log("llegue");
  console.log("llegue");
  console.log("llegue");
  const account_id = res.locals.accountData.account_id;
  let nav = await utilities.getNav();
  const { account_firstname, account_lastname, account_email } = req.body;
  // if the details form is submitted
  console.log("acaperrraco", req.body.account_lastname, account_email);
  if (req.body.account_lastname) {
    const checkEmail =
      res?.locals?.accountData?.account_email === account_email ? false : true;

    console.log("acaperrraco", checkEmail);
    const emailExist = await accountModel.checkExistingEmail(
      res?.locals?.accountData?.account_email
    );
    console.log("acaperrraco2", checkEmail);
    if (checkEmail & emailExist) {
      req.flash("notice", "Sorry, that email address is already in use.");
      res.redirect("/account");

      // if email field has changed and new email is not in use
    } else {
      console.log("aacaaa");
      const regResult = await accountModel.updateAccount(
        account_id,
        account_firstname,
        account_lastname,
        account_email
      );

      console.log("result", regResult);
      if (regResult) {
        const accountData = await accountModel.getAccountByID(account_id);
        const accessToken = jwt.sign(
          accountData,
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: 3600 * 1000 }
        );
        res.cookie("jwt", accessToken, {
          httpOnly: true,
          maxAge: 3600 * 1000,
          overwrite: true,
        });
        res.locals.accountData = accountData;

        console.log("aacaaa2");
        req.flash(
          "notice",
          `Information Successfully Updated, Please Login Again to Refresh Your Account`
        );
        console.log("all fine");
        res.redirect("/account/");
      } else {
        req.flash("notice", "Sorry, there was an error processing the update.");
        res.status(500).render(`account/`, {
          title: "Update Account Failed",
          nav,
          accountdata: res.locals.accountData,
          errors: null,
        });
      }
    }
  }
}

async function updatePassword(req, res) {
  let nav = await utilities.getNav();
  let accountdata = res.locals.accountData;
  const account_id = res.locals.accountData.account_id;
  if (req.body.account_password) {
    console.log("Password Form Submitted");

    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hashSync(req.body.account_password, 10);
    } catch (e) {
      console.error(e);
    }
    regResult = await accountModel.changePassword(hashedPassword, account_id);
    if (regResult) {
      req.flash("notice", `Password Successfully Updated`);
      res.status(201).redirect("/account/");
    } else {
      req.flash(
        "notice",
        "Sorry, there was an error processing the password update."
      );
      res.status(500).render(`account/`, {
        title: "Registration",
        nav,
        accountdata,
        errors: null,
      });
    }
  }
}

module.exports = {
  buildLogin,
  buildRegistration,
  registerAccount,
  buildManagment,
  accountLogin,
  editAccount,
  updatePassword,
  updateAccount,
};

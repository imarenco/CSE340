const express = require("express");
const router = new express.Router();
const utilities = require("../utilities/");
const accountController = require("../controllers/accountController");
const regValidate = require("../utilities/account-validation");

router.get("/login", utilities.handleErrors(accountController.buildLogin));
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

router.get(
  "/register",
  utilities.handleErrors(accountController.buildRegistration)
);

router.get("/editAccount/:accountId", utilities.handleErrors(accountController.editAccount));


router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

router.get("/", utilities.handleErrors(accountController.buildManagment))

router.post(
  "/",
  utilities.handleErrors(accountController.buildManagment)
)

router.post(
  "/update",
  regValidate.updateRules(),
  regValidate.checkUpdateData,
utilities.handleErrors(accountController.updateAccount)
)

// Route to update account password
router.post(
  "/update/password",
  regValidate.passwordRules(),
  regValidate.checkPasswordData,
  utilities.handleErrors(accountController.updatePassword)
)


module.exports = router;

const invValidate = {};
const { body, validationResult } = require("express-validator");

const utilities = require("./index");

invValidate.classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .isLength({ min: 1 })
      .isAlpha()
      .withMessage("Please provide a classification name."),
  ];
};

invValidate.checkClassificationData = async (req, res, next) => {
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("./inventory/add-classification", {
      errors,
      title: "Add Classification",
      nav,
    });
    return;
  }
  next();
};

invValidate.inventoryRules = () => {
  return [
    body("classification_id")
      .trim()
      .isNumeric({ no_symbols: true })
      .withMessage("Please select a classification name."),
    body("inv_make")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Please provide vehicle make."),
    body("inv_model")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Please provide vehicle model."),
    body("inv_description")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide vehicle description."),
    body("inv_image")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide image path"),
    body("inv_thumbnail")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide thumbnail path."),
    body("inv_price")
      .trim()
      .isCurrency()
      .withMessage("Please provide vehicle price."),
    body("inv_year")
      .trim()
      .isInt({ min: 1880, max: 2024 })
      .withMessage("Please provide vehicle year"),
    body("inv_miles")
      .trim()
      .isInt({ min: 0 })
      .withMessage("Please provide vehicle miles"),
    body("inv_color")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide vehicle color"),
  ];
};

invValidate.checkInventoryData = async (req, res, next) => {
  const {
    classification_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
  } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    let selectList = await utilities.selectList();
    res.render("./inventory/add-inventory", {
      errors,
      title: "Add Vehicle",
      nav,
      selectList,
      classification_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
    });
    return;
  }
  next();
};

module.exports = invValidate;

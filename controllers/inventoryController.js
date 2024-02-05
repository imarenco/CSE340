const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const inventoryController = {};

inventoryController.buildListByClasificationId = async (req, res) => {
  const classification_id = req.params.classId;
  const inventoryList = await invModel.getInventoryByClassificationId(
    classification_id
  );
  const grid = await utilities.buildGrid(inventoryList);
  let nav = await utilities.getNav();
  res.render("./inventory/classification", {
    title: `${inventoryList?.[0]?.classification_name} vehicles`,
    nav,
    grid,
  });
};

inventoryController.buildDetailById = async (req, res) => {
  const inventory = await invModel.getInventoryById(req.params.inventoryId);
  const page = await utilities.buildDetailPage(inventory);
  const nav = await utilities.getNav();
  res.render("./inventory/detail", {
    title: `${inventory[0].inv_year} ${inventory[0].inv_make}  ${inventory[0].inv_model}`,
    nav,
    page: page,
  });
};

inventoryController.buildVehicleManagement = async function (req, res, next) {
  const nav = await utilities.getNav();

  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav,
  });
};

inventoryController.buildAddClassification = async function (req, res, next) {
  const nav = await utilities.getNav();

  res.render("./inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
  });
};

inventoryController.buildAddInventory = async function (req, res, next) {
  const nav = await utilities.getNav();

  let selectList = await utilities.selectList();
  res.render("./inventory/add-inventory", {
    title: "Add Vehicle",
    nav,
    selectList,
    errors: null,
  });
};

inventoryController.addInventory = async function (req, res) {
  let nav = await utilities.getNav();
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

  const regResult = await invModel.registerInventory(
    classification_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color
  );

  if (regResult) {
    req.flash("notice", `The ${inv_make} ${inv_model} was successfully added.`);
    res.status(201).render("./inventory/management", {
      title: "Vehicle Management",
      nav,
    });
  } else {
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).render("./inventory/add-inventory", {
      title: "Add Vehicle",
      nav,
    });
  }
};

inventoryController.addClassification = async function (req, res, next) {
  const { classification_name } = req.body;

  const regResult = await invModel.registerClassification(classification_name);
  const nav = await utilities.getNav();
  if (regResult) {
    req.flash(
      "message",
      `The ${classification_name} classification was successfully added.`
    );
    res.status(201).render("./inventory/management", {
      title: "Vehicle Management",
      nav,
    });
  } else {
    req.flash("message", "Sorry, the registration failed.");
    res.render("./inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null,
    });
  }
};

module.exports = inventoryController;

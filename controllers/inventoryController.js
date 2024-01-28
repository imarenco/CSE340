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

module.exports = inventoryController;

const approveModel = require("../models/approve-model");
const invModel = require("../models/inventory-model");
const utilities = require("../utilities");

const approveCont = {};

approveCont.buildlManagement = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("approval/approval-management", {
    title: "Approval Management",
    nav,
  });
};

approveCont.getList = async (req, res, next) => {
  const type = req.params.type;
  const response =
    type == "classification"
      ? await approveModel.getClassificationsWithoutApproval()
      : await approveModel.getInventoryWithoutApproval();

  if (response) {
    return res.json(response);
  } else {
    next(new Error("No data returned"));
  }
};

approveCont.rejectUpdate = async function (req, res) {
  const type = req.params.type;
  const { inv_id, classification_id } = req.body;
  type === "classification"
    ? await invModel.deleteClassification(classification_id)
    : await invModel.deleteInventory(inv_id);

  req.flash(
    "notice",
    `The ${type} has been rejected and deleted successfully.`
  );
  res.redirect("/approve/management/");
};

approveCont.approveUpdate = async function (req, res) {
  const type = req.params.type;
  const { inv_id, account_id, classification_id } = req.body;
  type === "classification"
    ? await approveModel.approveClassification(classification_id, account_id)
    : await approveModel.approveInventory(inv_id, account_id);

  req.flash(
    "notice",
    `The ${type} has been approved successfully. id: ${
      inv_id || classification_id
    }`
  );
  res.redirect("/approve/management/");
};

module.exports = approveCont;

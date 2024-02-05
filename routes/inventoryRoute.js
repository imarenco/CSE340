const express = require("express");
const router = new express.Router();
const controller = require("../controllers/inventoryController");
const inventoryValidate = require("../utilities/inventory-validate");

router.get("/type/:classId", controller.buildListByClasificationId);
router.get("/detail/:inventoryId", controller.buildDetailById);

router.get("/", controller.buildVehicleManagement);
router.get("/addClassification", controller.buildAddClassification);
router.get("/addVehicle", controller.buildAddInventory);

router.post(
  "/addVehicle",
  inventoryValidate.inventoryRules(),
  inventoryValidate.checkInventoryData,
  controller.addInventory
);

router.post(
  "/addClassification",
  inventoryValidate.classificationRules(),
  inventoryValidate.checkClassificationData,
  controller.addClassification
);

module.exports = router;

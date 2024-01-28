const express = require("express");
const router = new express.Router();
const controller = require("../controllers/inventoryController");

router.get("/type/:classId", controller.buildListByClasificationId);
router.get("/detail/:inventoryId", controller.buildDetailById);

module.exports = router;

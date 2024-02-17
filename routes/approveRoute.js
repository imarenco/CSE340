const express = require("express");
const router = express.Router();
const approveController = require("../controllers/approveController");
const utilities = require("../utilities");

router.get("/", utilities.handleErrors(approveController.buildlManagement));

router.get(
  "/management",
  utilities.handleErrors(approveController.buildlManagement)
);

router.get("/list/:type", utilities.handleErrors(approveController.getList));

router.post(
  "/confirm/reject/:type",
  utilities.handleErrors(approveController.rejectUpdate)
);

router.post(
  "/confirm/approve/:type",
  utilities.handleErrors(approveController.approveUpdate)
);

module.exports = router;

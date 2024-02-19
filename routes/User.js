const express = require("express");
const { isLoggedIn } = require("../middlewares/General");
const {
  buyVehicle,
  showVehicles,
  DepositMoney,
  fetchTotalBalance,
  fetchUserVehicles,
  fetchUserVehicleTotalAmount,
} = require("../controllers/Vehicle");
const router = express.Router();

// user
router.post("/buy-vehicle", isLoggedIn, buyVehicle);
router.get("/fetch-user-vehicles", isLoggedIn, fetchUserVehicles);
router.get("/see-all-vehicle", isLoggedIn, showVehicles);
router.post("/deposit-amount", isLoggedIn, DepositMoney);
router.get("/fetch-total-balance", isLoggedIn, fetchTotalBalance);
router.get("/fetch-total-vehicle-balance", isLoggedIn, fetchUserVehicleTotalAmount);

module.exports = router;

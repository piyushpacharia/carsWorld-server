const express = require("express");
const { isLoggedIn } = require("../middlewares/General");
const { addVehicle, fetchUserPurchase, fetchUserDeposits, fetchUsers, showAdminVehicles } = require("../controllers/Admin");
const router = express.Router();
router.post("/add-vehicle", isLoggedIn, addVehicle);
router.get("/purchase-details", isLoggedIn, fetchUserPurchase);
router.get("/deposit-details", isLoggedIn, fetchUserDeposits);
router.get("/user-details", isLoggedIn, fetchUsers);
router.get("/show-admin-vehicles", isLoggedIn, showAdminVehicles);


module.exports =router;
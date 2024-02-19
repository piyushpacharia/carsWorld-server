const Vehicle = require("../models/Vehicle");
const AdminVehicle = require("../models/AdminVehicle");
const DepositCoins = require("../models/DepositModel");
const User = require("../models/User");

const addVehicle = async (req, res) => {
  try {
    const user = req.user;
    console.log("User:", user);
    const { vehicleName, vehicleModel, vehiclePrice } = req.body;
    // check if user admin or not

    if (!user || user.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized access" });
    }

    const newVehicle = await AdminVehicle.create({
      vehicleName,
      vehicleModel,
      vehiclePrice,
    });
    return res.status(201).json({
      success: true,
      message: "New Vehicle Added",
      vehicle: newVehicle,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

const fetchUserPurchase = async (req, res) => {
  try {
    const userPurchases = await Vehicle.find().populate('purchasedBy', 'name');
    return res.status(200).json({ success: true, userPurchases });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const fetchUserDeposits = async (req, res) => {
  try {
    const depositInfo = await DepositCoins.find().populate('depositedBy', 'name');
    return res.status(200).json({ success: true, depositInfo });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const fetchUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "user" });
    return res.status(200).json({ success: true, users });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
const showAdminVehicles = async (req, res) => {
  try {
    const vehicles = await AdminVehicle.find();
    return res.status(200).json({ success: true, vehicles });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = {
  addVehicle,
  fetchUserPurchase,
  fetchUserDeposits,
  fetchUsers,
  showAdminVehicles,
};

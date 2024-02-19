const Vehicle = require("../models/Vehicle");
const AdminVehicle = require("../models/AdminVehicle");
const DepositModel = require("../models/DepositModel");
const User = require("../models/User");

const DepositMoney = async (req, res) => {
  const { _id: depositedBy } = req.user;
  const { depositAmount, upiID } = req.body;

  try {
    if (!depositAmount || !upiID || upiID.length < 6 || depositAmount < 100) {
      return res
        .status(400)
        .json({
          success: false,
          message: "UPI ID length greater then 6 and minimum deposit of 100",
        });
    }

    // Calculate inflation
    const INFLATION_RATE = 5;
    const inflation = Math.floor(depositAmount / 1000) * INFLATION_RATE;

    await DepositModel.create({ depositAmount, upiID, inflation, depositedBy });

    const user = await User.findById(depositedBy);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Convert depositAmount and inflation to numbers and validate
    const depositAmountNumber = Number(depositAmount);
    const inflationNumber = Number(inflation);
    if (isNaN(depositAmountNumber) || isNaN(inflationNumber)) {
      return res.status(400).json({
        success: false,
        message: "Invalid deposit amount or inflation",
      });
    }

    // Add deposited amount and inflation to the user's balance
    user.balance += depositAmountNumber + inflationNumber;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Amount deposited successfully",
    });
  } catch (error) {
    console.error("Error depositing money:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

const buyVehicle = async (req, res) => {
  try {
    const { vehicleName, vehicleModel, vehiclePrice } = req.body;
    const user = req.user;

    if (user.balance >= vehiclePrice) {
      await Vehicle.create({
        userId: user._id,
        vehicleName,
        vehicleModel,
        vehiclePrice,
        vehicleImage: req.body.vehicleImage,
        purchasedBy: req.user._id,
      });

      user.balance -= vehiclePrice;
      await user.save();

      return res
        .status(200)
        .json({ success: true, message: "New Vehicle Purchased" });
    } else {
      return res
        .status(403)
        .json({ success: false, message: "Insufficient balance" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

const showVehicles = async (req, res) => {
  try {
    const vehicles = await AdminVehicle.find();
    return res.status(200).json({ success: true, vehicles });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

const fetchTotalBalance = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    return res.status(200).json({ success: true, totalBalance: user.balance });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

const fetchUserVehicles = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const userVehicles = await Vehicle.find({ userId: userId });

    return res.status(200).json({ success: true, vehicles: userVehicles });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};
const fetchUserVehicleTotalAmount = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const userVehicles = await Vehicle.find({ userId: userId });
    let totalAmount = 0;
    userVehicles.forEach(vehicle => {
      totalAmount += vehicle.vehiclePrice;
    });

    return res.status(200).json({ success: true, totalVehicleAmount: totalAmount });
  } catch (error) {
    console.error("Error fetching user vehicle total amount:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = {
  buyVehicle,
  showVehicles,
  DepositMoney,
  fetchTotalBalance,
  fetchUserVehicles,
  fetchUserVehicleTotalAmount
};

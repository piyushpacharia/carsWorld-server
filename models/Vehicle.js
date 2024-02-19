const mongoose = require("mongoose");

const masterUserSchema = new mongoose.Schema(
  {
    userId: {
      type: String, 
      ref: "coinUsers",
      required: true,
    },
    vehicleName: {
      type: String,
      required: true,
    },
    vehicleModel: {
      type: String,
      required: true,
    },
    vehiclePrice: {
      type: Number,
      required: true,
    },
    vehicleImage: {
      type: String,
      required: true,
    },
    purchasedBy:{
      type: mongoose.Schema.Types.ObjectId, 
      ref: "coinUsers",
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("UserPurchase", masterUserSchema);

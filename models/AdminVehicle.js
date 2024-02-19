const mongoose = require("mongoose");

const adminAddedVehicleSchema = new mongoose.Schema(
  {
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
      default:
        "https://imgd.aeplcdn.com/370x208/n/cw/ec/40432/scorpio-n-exterior-right-front-three-quarter-75.jpeg?isig=0&q=80",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AdminVehicle", adminAddedVehicleSchema);

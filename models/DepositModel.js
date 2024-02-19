const mongoose = require("mongoose");

const depositModelSchema = new mongoose.Schema(
  {
    depositAmount: {
      type: Number,
      required: true,
    },
    upiID: {
      type: String,
      required: true,
    },
    inflation: {
      type: Number,
      required: true,
    },
    depositedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "coinUsers", 
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("DepositModel", depositModelSchema);

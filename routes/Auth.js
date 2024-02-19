const express = require("express");

const router = express.Router();
const { checkBodyParams } = require("../middlewares/General");
const {
  signUp,
  login,
  activateAccount,
} = require("../controllers/Auth");

router.post("/signup", checkBodyParams, signUp);

router.get("/activate-account/:token", activateAccount);

router.post("/login", login);



module.exports = router;

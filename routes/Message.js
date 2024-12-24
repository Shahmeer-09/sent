const express = require("express");
const router = express.Router();
const { sendMessage , getallmessages, deletconversation} = require("../controllers/MessageController");
const verifyjwt = require("../middlewares/verifyjwt");

router.post("/sendMessage", verifyjwt, sendMessage);
router.get("/getMessages", verifyjwt, getallmessages);
router.post("/delMessages", verifyjwt, deletconversation)
module.exports = router;

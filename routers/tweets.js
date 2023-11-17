const { tweetsController } = require("../controllers");
const { uploader } = require("../helper/uploader");
const { validateToken, authorizeUser } = require("../middleware/validation");

const router = require("express").Router();

router.post(
  "/",
  validateToken,
  authorizeUser,
  uploader("/tweet").single("fileupload"),
  tweetsController.createTweets
);

router.get("/", tweetsController.getTweet);

module.exports = router;

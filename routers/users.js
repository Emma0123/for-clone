const router = require("express").Router();
const { usersController } = require("../controllers");
const jwt = require("jsonwebtoken")
const { validateRegis, validateToken } = require("../middleware/validation");

router.get("/", (req, res, next) => {}, usersController.getData);
router.post("/regis", validateRegis, 
usersController.register)

router.post("/login", usersController.login)
router.get("/keeplogin", validateToken, usersController.keepLogin)
router.get("/verify", validateToken, usersController.verify)

module.exports = router;
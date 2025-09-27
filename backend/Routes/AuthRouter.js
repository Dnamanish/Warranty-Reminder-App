const router = require("express").Router();
const { signupValidation, loginValidation } = require("../Middlewares/Validation");
const { signup, login } = require("../controllers/AuthControl");


router.post("/login", loginValidation, login);
router.post("/signup", signupValidation, signup);

module.exports = router;

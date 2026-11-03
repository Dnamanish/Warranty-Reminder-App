const UserModel = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (user) {
      return res
        .status(409)
        .json({ message: "user already exist", success: false });
    }
    const userModel = new UserModel({ name, email, password });
    userModel.password = await bcrypt.hash(password, 10);
    await userModel.save();
    res.status(201).json({ message: "signup successful", success: true });
  } catch (error) {
    res.status(500).json({ message: "internal server error", success: false });
  }
};

const login = async (req, res) => {
  const loginStart = performance.now();

  try {
    const { email, password } = req.body;

    // 1. Measure MongoDB user lookup
    const dbStart = performance.now();
    const user = await UserModel.findOne({ email });
    const dbTime = performance.now() - dbStart;

    if (!user) {
      console.log(`Login timings — DB lookup: ${dbTime.toFixed(2)} ms`);
      return res
        .status(403)
        .json({ message: "Authentication failed", success: false });
    }

    // 2. Measure password comparison
    const bcryptStart = performance.now();
    const isPassEqual = await bcrypt.compare(password, user.password);
    const bcryptTime = performance.now() - bcryptStart;

    if (!isPassEqual) {
      console.log(
        `Login timings — DB: ${dbTime.toFixed(2)} ms, Bcrypt: ${bcryptTime.toFixed(2)} ms`,
      );

      return res
        .status(403)
        .json({ message: "Authentication failed", success: false });
    }

    // 3. Measure JWT generation
    const jwtStart = performance.now();

    const jwtToken = jwt.sign(
      { email: user.email, _id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    const jwtTime = performance.now() - jwtStart;
    const totalTime = performance.now() - loginStart;

    console.log(
      `Login timings — DB: ${dbTime.toFixed(2)} ms | Bcrypt: ${bcryptTime.toFixed(2)} ms | JWT: ${jwtTime.toFixed(2)} ms | Total: ${totalTime.toFixed(2)} ms`,
    );

    return res.status(200).json({
      message: "Login successful",
      success: true,
      jwtToken,
      email,
      name: user.name,
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

module.exports = {
  signup,
  login,
};

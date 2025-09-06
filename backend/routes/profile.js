const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth"); // ✅ Correct path
const User = require("../models/User");

// @GET /api/profile/me
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @PUT /api/profile/update
router.put("/update", auth, async (req, res) => {
  try {
    const { name, profileImage } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, profileImage },
      { new: true }
    ).select("-password");

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;

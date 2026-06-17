const express = require("express");

const router = express.Router();

const upload = require("../middleware/uploadMiddleware");

const { protect } = require("../middleware/authMiddleware");

const {
  uploadProfileImage,
} = require("../controllers/userController");

router.post(
  "/profile-image",
  protect,
  upload.single("image"),
  uploadProfileImage
);

module.exports = router;
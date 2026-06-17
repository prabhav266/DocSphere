const pool = require("../config/db");

const uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No image uploaded",
      });
    }

    const imagePath = `/uploads/${req.file.filename}`;

    await pool.query(
      `
      UPDATE users
      SET profile_image = $1
      WHERE id = $2
      `,
      [imagePath, req.user.id]
    );

    res.status(200).json({
      message: "Profile image updated",
      profile_image: imagePath,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

module.exports = {
  uploadProfileImage,
};
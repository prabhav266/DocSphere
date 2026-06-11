const express = require("express");

const upload = require(
  "../middleware/uploadMiddleware"
);

const {
  fetchDocuments,
  getDocument,
  uploadDocument,
  downloadDocument,
  searchDocument,
} = require(
  "../controllers/documentController"
);

const {
  protect,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", fetchDocuments);

router.get("/", fetchDocuments);
router.get("/search", searchDocument);

router.post(
  "/upload",
  protect,
  upload.single("document"),
  uploadDocument
);

router.get("/:id/download", downloadDocument);
router.get("/:id", getDocument);

module.exports = router;
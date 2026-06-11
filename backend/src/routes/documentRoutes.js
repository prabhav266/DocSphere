const express = require("express");

const upload = require(
  "../middleware/uploadMiddleware"
);

const {
  fetchDocuments,
  getDocument,
  uploadDocument,
} = require(
  "../controllers/documentController"
);

const router = express.Router();

router.get("/", fetchDocuments);

router.get("/:id", getDocument);

router.post(
  "/upload",
  upload.single("document"),
  uploadDocument
);

module.exports = router;
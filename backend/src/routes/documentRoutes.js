const express = require("express");
const router = express.Router();

const {
  getDocuments,
  uploadDocument
} = require("../controllers/documentController");

router.get("/", getDocuments);
router.post("/upload", uploadDocument);

module.exports = router;
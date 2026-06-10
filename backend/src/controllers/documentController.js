const getDocuments = (req, res) => {
  res.json({
    message: "Get all documents"
  });
};

const uploadDocument = (req, res) => {
  res.json({
    message: "Upload document"
  });
};

module.exports = {
  getDocuments,
  uploadDocument
};
const {
  getAllDocuments,
  getDocumentById,
  createDocument,
  incrementDownloads,
  searchDocuments,
} = require("../services/documentService");

const fetchDocuments = async (req, res) => {
  try {
    const documents = await getAllDocuments();

    res.status(200).json(documents);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

const getDocument = async (req, res) => {
  try {
    const { id } = req.params;

    const document = await getDocumentById(id);

    if (!document) {
      return res.status(404).json({
        message: "Document not found",
      });
    }

    res.status(200).json(document);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

const uploadDocument = async (req, res) => {
  try {
    const {
      title,
      description,
      visibility,
    } = req.body;

    if (!req.file) {
      return res.status(400).json({
        message: "File is required",
      });
    }if (!title || !description) {
  return res.status(400).json({
    message:
      "Title and description are required",
  });
}

    const uploaded_by = req.user.id;

    const file_url =
      `/uploads/${req.file.filename}`;

    const document =
      await createDocument(
        uploaded_by,
        title,
        description,
        req.file.originalname,
        file_url,
        req.file.mimetype,
        req.file.size,
        visibility || "public"
      );

    res.status(201).json(document);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

const path = require("path");

const downloadDocument =
  async (req, res) => {
    try {
      const document =
        await getDocumentById(
          req.params.id
        );

      if (!document) {
        return res.status(404).json({
          message:
            "Document not found",
        });
      }

      await incrementDownloads(
        req.params.id
      );

      const filePath =
        path.join(
          __dirname,
          "../../",
          document.file_url
        );

      res.download(filePath);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Server Error",
      });
    }
  };

  const searchDocument = async (req, res) => {
  try {
    const { q } = req.query;

    const documents =
      await searchDocuments(q || "");

    res.status(200).json(documents);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};
module.exports = {
  fetchDocuments,
  getDocument,
  uploadDocument,
  downloadDocument,
  searchDocument,
};
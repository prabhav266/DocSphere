const pool = require("../config/db");

const getAllDocuments = async () => {
  const result = await pool.query(
    "SELECT * FROM documents ORDER BY created_at DESC"
  );

  return result.rows;
};

const getDocumentById = async (id) => {
  const result = await pool.query(
    "SELECT * FROM documents WHERE id = $1",
    [id]
  );

  return result.rows[0];
};

const createDocument = async (
  uploaded_by,
  title,
  description,
  file_name,
  file_url,
  file_type,
  file_size,
  visibility
) => {
  const result = await pool.query(
    `
    INSERT INTO documents
    (
      uploaded_by,
      title,
      description,
      file_name,
      file_url,
      file_type,
      file_size,
      visibility
    )
    VALUES
    ($1,$2,$3,$4,$5,$6,$7,$8)
    RETURNING *
    `,
    [
      uploaded_by,
      title,
      description,
      file_name,
      file_url,
      file_type,
      file_size,
      visibility,
    ]
  );

  return result.rows[0];
};

const incrementViews = async (id) => {
  await pool.query(
    `
    UPDATE documents
    SET total_views = total_views + 1
    WHERE id = $1
    `,
    [id]
  );
};
const incrementDownloads = async (id) => {
  await pool.query(
    `
    UPDATE documents
    SET total_downloads = total_downloads + 1
    WHERE id = $1
    `,
    [id]
  );
};

const searchDocuments = async (query) => {
  const result = await pool.query(
    `
    SELECT *
    FROM documents
    WHERE title ILIKE $1
    ORDER BY created_at DESC
    `,
    [`%${query}%`]
  );

  return result.rows;
};

module.exports = {
  getAllDocuments,
  getDocumentById,
  createDocument,
  incrementViews,
  incrementDownloads,
  searchDocuments,
};
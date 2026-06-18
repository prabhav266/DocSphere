import React, { useState, useEffect } from "react";
import {
  Download,
  Share2,
  FileText,
  ArrowLeft,
  Trash2,
  Loader2,
  Eye,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import { useDocuments } from "../../context/DocumentContext";

const Viewer = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { getDocumentById, deleteDocument, removeDocument } = useDocuments();

  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const found = getDocumentById(id);

    if (found) {
      setDoc(found);
      setLoading(false);
    } else {
      navigate("/dashboard/library");
    }
  }, [id, getDocumentById, navigate]);

  const handleDelete = async () => {
    {
      try {
        const response = await fetch(
          `http://localhost:5000/api/documents/${doc.id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${localStorage.getItem(
                "token"
              )}`,
            },
          }
        );

        const data = await response.json();

        console.log(data);

        if (response.ok) {


          navigate("/dashboard/library");
          window.location.reload();
        } else {
          alert(data.message);
        }
      } catch (error) {
        console.error(error);
        alert("Delete failed");
      }
    }
  };
  const handleDownload = () => {
    window.open(
      `http://localhost:5000/api/documents/${doc.id}/download`,
      "_blank"
    );
  };

  const handleOpen = () => {
    window.open(
      `http://localhost:5000${doc.file_url}`,
      "_blank"
    );
  };

  const handleShare = async () => {
    try {
      const shareLink = `${window.location.origin}/dashboard/view/${doc.id}`;

      await navigator.clipboard.writeText(shareLink);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);

    } catch (error) {
      console.error(error);
    }
  };
  if (loading) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
        <p className="mt-4 text-slate-400">
          Loading document...
        </p>
      </div>
    );
  }

  if (!doc) return null;

  return (
    <div className="max-w-6xl mx-auto px-6 py-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <Button
          variant="ghost"
          className="text-red-500"
          onClick={handleDelete}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Document Card */}
      <div className="max-w-xl mx-auto bg-slate-900 border border-slate-700 rounded-2xl shadow-xl p-8">

        <div className="flex flex-col items-center">

          <FileText className="h-20 w-20 text-blue-500 mb-4" />

          <h1 className="text-2xl font-bold text-white text-center">
            {doc.title}
          </h1>

          <span className="mt-3 px-4 py-1 rounded-full bg-blue-500/20 text-blue-400 text-sm">
            {doc.type}
          </span>

          {/* Info Grid */}
          <div className="mt-6 w-full">
            <div className="grid grid-cols-2 gap-4">

              <div className="bg-slate-800 rounded-xl p-4">
                <p className="text-slate-400 text-sm">
                  File Size
                </p>

                <p className="text-white font-semibold">
                  {doc.file_size
                    ? `${(doc.file_size / 1024 / 1024).toFixed(2)} MB`
                    : "Unknown"}
                </p>
              </div>

              <div className="bg-slate-800 rounded-xl p-4">
                <p className="text-slate-400 text-sm">
                  Downloads
                </p>

                <p className="text-white font-semibold">
                  {doc.total_downloads || 0}
                </p>
              </div>

            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">

            <Button

              className="gap-2 px-6"
              onClick={handleOpen}
            >
              <Eye className="h-4 w-4" />
              Open
            </Button>

            <Button
              className="gap-2 px-6"
              onClick={handleDownload}
            >
              <Download className="h-4 w-4" />
              Download
            </Button>

            <Button
              className="gap-2 px-6"
              onClick={handleShare}
            >
              <Share2 className="h-4 w-4" />
              {copied ? "Copied!" : "Share"}
            </Button>

          </div>

        </div>

      </div>




    </div>
  );
};

export default Viewer;
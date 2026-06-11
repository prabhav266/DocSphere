import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  Download, 
  Share2, 
  Maximize2,
  FileText,
  ArrowLeft,
  Trash2,
  Loader2
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import { useDocuments } from '../../context/DocumentContext';

const Viewer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getDocumentById, deleteDocument } = useDocuments();
  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sample PDF for demonstration since we are using a mock backend
  const SAMPLE_PDF_URL = "https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf";

  useEffect(() => {
    const found = getDocumentById(id);
    if (found) {
      setDoc(found);
      // Simulate loading content
      setTimeout(() => setLoading(false), 800);
    } else {
      // If documents are still loading from context, wait a bit
      const timer = setTimeout(() => {
        const retryFound = getDocumentById(id);
        if (retryFound) {
          setDoc(retryFound);
          setLoading(false);
        } else {
          navigate('/dashboard/library');
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [id, getDocumentById, navigate]);

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this document?")) {
      deleteDocument(doc.id);
      navigate('/dashboard/library');
    }
  };

  if (!doc) return null;

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
          <div className="min-w-0">
            <h1 className="text-xl font-bold truncate max-w-[200px] md:max-w-md">{doc.title}</h1>
            <p className="text-xs text-slate-500">{doc.type} • {doc.size} • Uploaded on {doc.date}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="text-red-500 hover:bg-red-50" onClick={handleDelete}>
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button variant="secondary" size="sm" className="gap-2">
            <Share2 className="h-4 w-4" /> Share
          </Button>
          <Button size="sm" className="gap-2">
            <Download className="h-4 w-4" /> Download
          </Button>
        </div>
      </div>

      <div className="flex-1 bg-slate-100 dark:bg-slate-900 rounded-xl overflow-hidden flex flex-col relative border border-slate-300 dark:border-slate-700 shadow-sm">
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center space-y-4">
             <Loader2 className="h-10 w-10 text-primary-600 animate-spin" />
             <p className="text-sm font-medium text-slate-500">Loading document viewer...</p>
          </div>
        ) : (
          <iframe
            src={`${doc.type === 'PDF' ? SAMPLE_PDF_URL : ''}#toolbar=0&navpanes=0`}
            title={doc.title}
            className="w-full h-full border-none"
            style={{ backgroundColor: 'white' }}
          >
            {doc.type !== 'PDF' && (
              <div className="flex flex-col items-center justify-center h-full space-y-4 p-12 text-center">
                 <FileText className="h-20 w-20 text-slate-300" />
                 <h2 className="text-xl font-bold">Preview not available for {doc.type} files</h2>
                 <p className="text-slate-500 max-w-md">The online viewer currently only supports direct PDF previews. You can download the file to view it on your device.</p>
                 <Button variant="secondary">Download {doc.type}</Button>
              </div>
            )}
          </iframe>
        )}
      </div>
    </div>
  );
};

export default Viewer;

import React, { useState } from 'react';
import { CloudUpload, X, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { Card } from '../../components/Card';
import Button from '../../components/Button';
import { useDocuments } from '../../context/DocumentContext';
import { useNavigate } from 'react-router-dom';

const Upload = () => {
  const { addDocument } = useDocuments();
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    // Basic validation
    const validFiles = selectedFiles.filter(f => {
      const ext = f.name.split('.').pop().toLowerCase();
      return ['pdf', 'docx', 'pptx', 'txt'].includes(ext);
    });

    if (validFiles.length < selectedFiles.length) {
       alert("Some files were skipped. Only PDF, DOCX, PPTX, and TXT are supported.");
    }

    setFiles(prev => [...prev, ...validFiles.map(f => ({ file: f, status: 'pending' }))]);
  };

  const startUpload = async () => {
    if (files.length === 0) return;
    
    setIsUploading(true);
    setProgress(0);
    
    // Simulate progress bar for UI feel
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 150);

    try {
      // Perform all uploads
      await Promise.all(files.map(async (fileObj, index) => {
        try {
          await addDocument(fileObj.file);
          setFiles(prev => {
            const newFiles = [...prev];
            newFiles[index] = { ...newFiles[index], status: 'completed' };
            return newFiles;
          });
        } catch (err) {
          setFiles(prev => {
            const newFiles = [...prev];
            newFiles[index] = { ...newFiles[index], status: 'error' };
            return newFiles;
          });
          throw err;
        }
      }));
      
      setProgress(100);
      clearInterval(progressInterval);
      
      // Auto redirect after success
      setTimeout(() => {
         navigate('/dashboard/library');
      }, 1500);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Some files failed to upload. Please try again.");
      setIsUploading(false);
      clearInterval(progressInterval);
    }
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Upload Documents</h1>
        <p className="text-slate-500 dark:text-slate-400">Add new resources to your DocSphere library.</p>
      </div>

      <Card className="p-12 border-dashed border-2 border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-primary-50 dark:bg-primary-900/20 rounded-full flex items-center justify-center mb-4">
          <CloudUpload className="h-8 w-8 text-primary-600" />
        </div>
        <h3 className="text-lg font-bold mb-2">Drag and drop your files here</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Support for PDF, DOCX, PPTX and TXT up to 50MB.</p>
        <label className="cursor-pointer">
          <input type="file" multiple className="hidden" onChange={handleFileChange} accept=".pdf,.docx,.pptx,.txt" />
          <Button variant="secondary" as="span">Browse Files</Button>
        </label>
      </Card>

      {files.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold">Selected Files ({files.length})</h3>
            {!isUploading && progress < 100 && (
              <Button size="sm" onClick={startUpload}>Upload All</Button>
            )}
          </div>
          
          <div className="space-y-3">
            {files.map((fileObj, index) => (
              <div key={index} className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800">
                <FileText className="h-5 w-5 text-slate-400" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{fileObj.file.name}</p>
                  <p className="text-xs text-slate-500">{(fileObj.file.size / 1024).toFixed(1)} KB</p>
                </div>
                {fileObj.status === 'completed' ? (
                  <div className="flex items-center gap-2 text-green-600 text-xs font-bold">
                    <CheckCircle2 className="h-5 w-5" /> 
                    <span>Uploaded</span>
                  </div>
                ) : isUploading ? (
                  <div className="w-20 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-primary-600 transition-all duration-300" style={{ width: `${progress}%` }}></div>
                  </div>
                ) : (
                  <button onClick={() => removeFile(index)} className="p-1 hover:bg-red-50 hover:text-red-600 rounded-md transition-colors text-slate-400">
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {isUploading && (
            <div className="mt-6 space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <span>Processing files...</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-primary-600 transition-all duration-300" style={{ width: `${progress}%` }}></div>
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  );
};

export default Upload;

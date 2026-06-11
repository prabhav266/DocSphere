import React, { createContext, useContext, useState, useEffect } from 'react';
import { documentService } from '../api/documentService';

const DocumentContext = createContext();

export const DocumentProvider = ({ children }) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDocuments = async () => {
    try {
      const data = await documentService.getAll();
      setDocuments(data);
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const addDocument = async (file) => {
    try {
      const savedDoc = await documentService.create(file);
      setDocuments(prev => [savedDoc, ...prev]);
      return savedDoc;
    } catch (error) {
      console.error('Error adding document:', error);
      throw error;
    }
  };

  const deleteDocument = async (id) => {
    try {
      await documentService.delete(id);
      setDocuments(prev => prev.filter(doc => doc.id.toString() !== id.toString()));
    } catch (error) {
      console.error('Error deleting document:', error);
      throw error;
    }
  };

  const getDocumentById = (id) => {
    return documents.find(doc => doc.id.toString() === id.toString());
  };

  return (
    <DocumentContext.Provider value={{ documents, loading, addDocument, deleteDocument, getDocumentById, refreshDocuments: fetchDocuments }}>
      {children}
    </DocumentContext.Provider>
  );
};

export const useDocuments = () => useContext(DocumentContext);

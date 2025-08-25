'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUpload, FiFile, FiX, FiLock } from 'react-icons/fi';
import { EncryptionUtils } from '@/utils/encryption';

interface FileUploadProps {
  onFileUpload: (file: File, encryptedData?: any, encryptionKey?: string) => void;
  isUploading: boolean;
}

export default function FileUpload({ onFileUpload, isUploading }: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string>('');
  const [encryptionKey, setEncryptionKey] = useState<string>('');
  const [isEncrypted, setIsEncrypted] = useState(true);
  
  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    setError('');
    
    if (rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0];
      if (rejection.errors[0]?.code === 'file-too-large') {
        setError('File is too large. Please select a file smaller than 100MB.');
      } else if (rejection.errors[0]?.code === 'file-invalid-type') {
        setError('Invalid file type. Please select a valid file.');
      } else {
        setError('Please select a valid file.');
      }
      return;
    }
    
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setSelectedFile(file);
      
      // Generate encryption key if encryption is enabled
      if (isEncrypted) {
        const key = EncryptionUtils.generateKey();
        setEncryptionKey(key);
      }
    }
  }, [isEncrypted]);
  
  const { getRootProps, getInputProps, isDragReject } = useDropzone({ 
    onDrop,
    multiple: false,
    maxSize: 100 * 1024 * 1024, // 100MB limit
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
    onDropAccepted: () => setDragActive(false),
    onDropRejected: () => setDragActive(false),
  });

  const removeFile = () => {
    setSelectedFile(null);
    setError('');
    setEncryptionKey('');
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    if (isEncrypted && !encryptionKey) {
      setError('Encryption key generation failed. Please try again.');
      return;
    }

    try {
      let encryptedData = null;
      let finalKey = encryptionKey;

      if (isEncrypted) {
        // Read and encrypt the file
        const arrayBuffer = await selectedFile.arrayBuffer();
        encryptedData = EncryptionUtils.encryptFile(arrayBuffer, encryptionKey);
        finalKey = encryptionKey;
      }

      onFileUpload(selectedFile, encryptedData, finalKey);
    } catch (error) {
      console.error('Error processing file:', error);
      setError('Failed to process file. Please try again.');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'];
    const documentTypes = ['pdf', 'doc', 'docx', 'txt', 'rtf'];
    const videoTypes = ['mp4', 'avi', 'mov', 'wmv', 'flv'];
    const audioTypes = ['mp3', 'wav', 'flac', 'aac'];
    
    if (imageTypes.includes(extension || '')) return '🖼️';
    if (documentTypes.includes(extension || '')) return '📄';
    if (videoTypes.includes(extension || '')) return '🎥';
    if (audioTypes.includes(extension || '')) return '🎵';
    return '📁';
  };

  return (
    <div className="space-y-4">
      {/* Encryption Toggle */}
      <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FiLock className="w-5 h-5 text-blue-600 mr-2" />
            <div>
              <h3 className="font-medium text-blue-900">End-to-End Encryption</h3>
              <p className="text-sm text-blue-700">Your file will be encrypted before sharing</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isEncrypted}
              onChange={(e) => setIsEncrypted(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>

      {!selectedFile ? (
        <div 
          {...getRootProps()} 
          className={`
            relative w-full p-12 border-2 border-dashed rounded-2xl text-center cursor-pointer transition-all duration-300
            ${dragActive 
              ? 'border-blue-500 bg-blue-50 scale-105' 
              : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
            }
            ${isDragReject ? 'border-red-400 bg-red-50' : ''}
            ${isUploading ? 'opacity-50 pointer-events-none' : ''}
          `}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className={`
              p-4 rounded-full transition-all duration-300
              ${dragActive ? 'bg-blue-100 scale-110' : 'bg-gray-100'}
              ${isDragReject ? 'bg-red-100' : ''}
            `}>
              <FiUpload className={`w-8 h-8 transition-colors duration-300 ${
                dragActive ? 'text-blue-600' : 'text-gray-500'
              } ${isDragReject ? 'text-red-500' : ''}`} />
            </div>
            <div>
              <p className="text-xl font-semibold text-gray-900 mb-2">
                {dragActive ? 'Drop your file here' : 'Choose a file to share'}
              </p>
              <p className="text-gray-500 mb-4">
                Drag and drop your file here, or click to browse
              </p>
              <div className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm">
                <FiFile className="w-4 h-4 mr-2" />
                Max file size: 100MB
              </div>
            </div>
          </div>
          
          {isDragReject && (
            <div className="absolute inset-0 bg-red-50 border-2 border-red-400 rounded-2xl flex items-center justify-center">
              <div className="text-center">
                <FiX className="w-12 h-12 text-red-500 mx-auto mb-2" />
                <p className="text-red-700 font-medium">Invalid file type</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-3xl">{getFileIcon(selectedFile.name)}</div>
              <div>
                <h3 className="font-semibold text-gray-900 truncate max-w-xs">
                  {selectedFile.name}
                </h3>
                <p className="text-sm text-gray-500">
                  {formatFileSize(selectedFile.size)}
                </p>
                {isEncrypted && encryptionKey && (
                  <p className="text-sm text-green-600 flex items-center">
                    <FiLock className="w-3 h-3 mr-1" />
                    Encrypted
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={removeFile}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              disabled={isUploading}
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
          
          <button
            onClick={handleUpload}
            disabled={isUploading}
            className="w-full mt-4 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? 'Uploading...' : 'Upload File'}
          </button>
        </div>
      )}
      
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
          <div className="flex items-center">
            <FiX className="w-5 h-5 text-red-500 mr-3" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
}

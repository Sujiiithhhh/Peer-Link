'use client';

import { useState } from 'react';
import { FiDownload, FiKey, FiAlertCircle, FiCheckCircle, FiLock } from 'react-icons/fi';
import { EncryptionUtils, InviteCodeData } from '@/utils/encryption';

interface FileDownloadProps {
  onDownload: (port: number, encryptionKey?: string) => Promise<void>;
  isDownloading: boolean;
}

export default function FileDownload({ onDownload, isDownloading }: FileDownloadProps) {
  const [inviteCode, setInviteCode] = useState('');
  const [encryptionKey, setEncryptionKey] = useState('');
  const [error, setError] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [decodedData, setDecodedData] = useState<InviteCodeData | null>(null);
  
  const validateInviteCode = (code: string) => {
    try {
      // Try to decrypt the invite data
      const decrypted = EncryptionUtils.decryptInviteData(code, 'peerlink-secret-key');
      setDecodedData(decrypted);
      setIsValid(true);
      setError('');
      return true;
    } catch (err) {
      // If decryption fails, try as regular port number
      const port = parseInt(code.trim(), 10);
      const isValidPort = !isNaN(port) && port > 0 && port <= 65535;
      setIsValid(isValidPort);
      setDecodedData(null);
      setError('');
      return isValidPort;
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInviteCode(value);
    validateInviteCode(value);
  };

  const handleEncryptionKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEncryptionKey(e.target.value);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!validateInviteCode(inviteCode)) {
      setError('Please enter a valid invite code');
      return;
    }

    let port: number;
    let key: string | undefined;

    if (decodedData) {
      // Using encrypted invite data
      port = decodedData.port;
      key = decodedData.encryptionKey;
    } else {
      // Using regular port number
      port = parseInt(inviteCode.trim(), 10);
      key = encryptionKey || undefined;
    }
    
    try {
      await onDownload(port, key);
    } catch (err) {
      setError('Failed to download the file. Please check the invite code and try again.');
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200">
        <div className="flex items-center mb-3">
          <div className="p-2 bg-blue-100 rounded-lg mr-3">
            <FiKey className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-blue-900">Receive a File</h3>
            <p className="text-sm text-blue-700">
              Enter the invite code shared with you to download the file
            </p>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl border border-blue-100">
          <div className="flex items-center space-x-2 text-sm text-blue-600">
            <FiCheckCircle className="w-4 h-4" />
            <span>Secure P2P connection</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-blue-600 mt-1">
            <FiLock className="w-4 h-4" />
            <span>End-to-end encryption supported</span>
          </div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="inviteCode" className="block text-sm font-semibold text-gray-700 mb-2">
            Invite Code
          </label>
          <div className="relative">
            <input
              type="text"
              id="inviteCode"
              value={inviteCode}
              onChange={handleInputChange}
              placeholder="Enter the invite code or scan QR code"
              className={`
                w-full p-4 pr-12 border-2 rounded-xl text-lg font-mono transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                ${isValid && inviteCode.trim() 
                  ? 'border-green-300 bg-green-50' 
                  : 'border-gray-300 hover:border-gray-400'
                }
                ${error ? 'border-red-300 bg-red-50' : ''}
                ${isDownloading ? 'opacity-50 cursor-not-allowed' : ''}
              `}
              disabled={isDownloading}
              required
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              {isValid && inviteCode.trim() && (
                <FiCheckCircle className="w-6 h-6 text-green-500" />
              )}
              {error && (
                <FiAlertCircle className="w-6 h-6 text-red-500" />
              )}
            </div>
          </div>
          
          {error && (
            <div className="mt-2 flex items-center space-x-2 text-sm text-red-600">
              <FiAlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}
          
          {isValid && inviteCode.trim() && !error && (
            <div className="mt-2 flex items-center space-x-2 text-sm text-green-600">
              <FiCheckCircle className="w-4 h-4" />
              <span>Valid invite code</span>
            </div>
          )}
        </div>

        {/* Show file info if decoded data is available */}
        {decodedData && (
          <div className="bg-green-50 p-4 rounded-xl border border-green-200">
            <h4 className="font-medium text-green-900 mb-2">File Information</h4>
            <div className="space-y-1 text-sm text-green-800">
              <p><strong>Filename:</strong> {decodedData.filename}</p>
              <p><strong>Size:</strong> {formatFileSize(decodedData.fileSize)}</p>
              <p><strong>Encryption:</strong> {decodedData.encryptionKey ? 'Enabled' : 'Disabled'}</p>
            </div>
          </div>
        )}

        {/* Encryption key input (only if not using encrypted invite) */}
        {!decodedData && (
          <div>
            <label htmlFor="encryptionKey" className="block text-sm font-semibold text-gray-700 mb-2">
              Encryption Key (if file is encrypted)
            </label>
            <input
              type="password"
              id="encryptionKey"
              value={encryptionKey}
              onChange={handleEncryptionKeyChange}
              placeholder="Enter the encryption key if provided"
              className="w-full p-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              disabled={isDownloading}
            />
            <p className="text-xs text-gray-600 mt-1">
              Only required if the sender provided a separate encryption key
            </p>
          </div>
        )}
        
        <button
          type="submit"
          className={`
            w-full flex items-center justify-center px-6 py-4 rounded-xl font-semibold text-lg
            transition-all duration-200 transform hover:scale-105
            ${isValid && inviteCode.trim() && !isDownloading
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }
            ${isDownloading ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          disabled={!isValid || isDownloading || !inviteCode.trim()}
        >
          {isDownloading ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              <span>Downloading...</span>
            </div>
          ) : (
            <>
              <FiDownload className="mr-2 w-5 h-5" />
              <span>Download File</span>
            </>
          )}
        </button>
      </form>
      
      <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
        <h4 className="font-medium text-gray-900 mb-2">How it works:</h4>
        <ol className="text-sm text-gray-600 space-y-1">
          <li>1. Ask the sender for their invite code or QR code</li>
          <li>2. Enter the code in the field above</li>
          <li>3. If the file is encrypted, enter the encryption key</li>
          <li>4. Click download to receive the file</li>
          <li>5. The file will be saved to your downloads folder</li>
        </ol>
      </div>
    </div>
  );

  function formatFileSize(bytes: number) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

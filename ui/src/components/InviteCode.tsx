'use client';

import { useState } from 'react';
import { FiCopy, FiCheck, FiShare2, FiClock, FiCode, FiEye, FiEyeOff } from 'react-icons/fi';
import QRCodeComponent from './QRCode';
import { EncryptionUtils, InviteCodeData } from '@/utils/encryption';

interface InviteCodeProps {
  port: number | null;
  encryptionKey?: string;
  filename?: string;
  fileSize?: number;
}

export default function InviteCode({ port, encryptionKey, filename, fileSize }: InviteCodeProps) {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [showKey, setShowKey] = useState(false);
  
  if (!port) return null;

  // Generate encrypted invite data
  const inviteData: InviteCodeData = {
    port,
    encryptionKey: encryptionKey || '',
    filename: filename || 'unknown-file',
    fileSize: fileSize || 0
  };

  const encryptedInviteData = EncryptionUtils.encryptInviteData(inviteData, 'peerlink-secret-key');
  const inviteCode = EncryptionUtils.generateInviteCode();
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(inviteCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = inviteCode;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const copyEncryptedData = async () => {
    try {
      await navigator.clipboard.writeText(encryptedInviteData);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.error('Failed to copy encrypted data:', err);
    }
  };
  
  return (
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-200 shadow-lg">
      <div className="flex items-center mb-4">
        <div className="p-2 bg-green-100 rounded-lg mr-3">
          <FiShare2 className="w-5 h-5 text-green-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-green-900">File Ready to Share!</h3>
          <p className="text-sm text-green-700">
            Share this invite code with anyone you want to share the file with
          </p>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-xl border border-green-200 mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Invite Code
        </label>
        <div className="flex items-center">
          <div className="flex-1 bg-gray-50 p-4 rounded-l-lg border border-r-0 border-gray-300 font-mono text-2xl font-bold text-gray-900 text-center">
            {inviteCode}
          </div>
          <button
            onClick={copyToClipboard}
            className={`
              p-4 rounded-r-lg transition-all duration-200 flex items-center justify-center
              ${copied 
                ? 'bg-green-500 text-white' 
                : 'bg-blue-500 hover:bg-blue-600 text-white hover:shadow-md'
              }
            `}
            aria-label="Copy invite code"
          >
            {copied ? (
              <>
                <FiCheck className="w-5 h-5 mr-2" />
                <span className="font-medium">Copied!</span>
              </>
            ) : (
              <>
                <FiCopy className="w-5 h-5 mr-2" />
                <span className="font-medium">Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* QR Code Section */}
      <div className="mb-4">
        <button
          onClick={() => setShowQR(!showQR)}
          className="w-full flex items-center justify-center px-4 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
        >
          <FiCode className="w-5 h-5 mr-2" />
          {showQR ? 'Hide QR Code' : 'Show QR Code'}
        </button>
        
        {showQR && (
          <div className="mt-4">
            <QRCodeComponent 
              data={encryptedInviteData}
              title="Scan QR Code to Receive File"
              description="Share this QR code with the recipient"
            />
          </div>
        )}
      </div>

      {/* Encryption Key Section */}
      {encryptionKey && (
        <div className="bg-white p-4 rounded-xl border border-green-100 mb-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-gray-900">Encryption Key</h4>
            <button
              onClick={() => setShowKey(!showKey)}
              className="text-blue-600 hover:text-blue-700"
            >
              {showKey ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
            </button>
          </div>
          <div className="font-mono text-sm bg-gray-50 p-3 rounded-lg">
            {showKey ? encryptionKey : '••••••••••••••••••••••••••••••••'}
          </div>
          <p className="text-xs text-gray-600 mt-2">
            This key is used to decrypt the file. Share it securely with the recipient.
          </p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-xl border border-green-100">
          <div className="flex items-center mb-2">
            <FiClock className="w-4 h-4 text-green-600 mr-2" />
            <h4 className="font-medium text-gray-900">Session Duration</h4>
          </div>
          <p className="text-sm text-gray-600">
            This code will be valid as long as your file sharing session is active
          </p>
        </div>
        
        <div className="bg-white p-4 rounded-xl border border-green-100">
          <div className="flex items-center mb-2">
            <FiShare2 className="w-4 h-4 text-green-600 mr-2" />
            <h4 className="font-medium text-gray-900">Sharing Tips</h4>
          </div>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Share via text message</li>
            <li>• Send through email</li>
            <li>• Use any messaging app</li>
            <li>• Scan QR code with camera</li>
          </ul>
        </div>
      </div>
      
      {copied && (
        <div className="mt-4 p-3 bg-green-100 border border-green-300 rounded-lg">
          <div className="flex items-center">
            <FiCheck className="w-4 h-4 text-green-600 mr-2" />
            <span className="text-sm font-medium text-green-800">
              Invite code copied to clipboard!
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

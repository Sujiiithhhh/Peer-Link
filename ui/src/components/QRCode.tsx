'use client';

import { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { FiDownload, FiShare2 } from 'react-icons/fi';

interface QRCodeProps {
  data: string;
  title?: string;
  description?: string;
}

export default function QRCodeComponent({ data, title = "Scan to receive file", description }: QRCodeProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(true);

  useEffect(() => {
    const generateQR = async () => {
      try {
        setIsGenerating(true);
        const qrDataUrl = await QRCode.toDataURL(data, {
          width: 256,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        });
        setQrDataUrl(qrDataUrl);
      } catch (error) {
        console.error('Error generating QR code:', error);
      } finally {
        setIsGenerating(false);
      }
    };

    if (data) {
      generateQR();
    }
  }, [data]);

  const downloadQR = () => {
    if (qrDataUrl) {
      const link = document.createElement('a');
      link.download = 'peerlink-invite.png';
      link.href = qrDataUrl;
      link.click();
    }
  };

  const shareQR = async () => {
    if (navigator.share && qrDataUrl) {
      try {
        // Convert data URL to blob for sharing
        const response = await fetch(qrDataUrl);
        const blob = await response.blob();
        const file = new File([blob], 'peerlink-invite.png', { type: 'image/png' });
        
        await navigator.share({
          title: 'PeerLink Invite',
          text: 'Scan this QR code to receive the file',
          files: [file]
        });
      } catch (error) {
        console.error('Error sharing QR code:', error);
        // Fallback to copying to clipboard
        copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(data);
      // You could add a toast notification here
    } catch (error) {
      console.error('Error copying to clipboard:', error);
    }
  };

  if (isGenerating) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
        <span className="ml-2 text-gray-600">Generating QR code...</span>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        {description && (
          <p className="text-sm text-gray-600">{description}</p>
        )}
      </div>
      
      <div className="flex justify-center mb-4">
        <div className="p-4 bg-white border-2 border-gray-200 rounded-lg">
          <img 
            src={qrDataUrl} 
            alt="QR Code" 
            className="w-48 h-48"
            style={{ imageRendering: 'pixelated' }}
          />
        </div>
      </div>
      
      <div className="flex justify-center space-x-3">
        <button
          onClick={downloadQR}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <FiDownload className="w-4 h-4 mr-2" />
          Download
        </button>
        <button
          onClick={shareQR}
          className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          <FiShare2 className="w-4 h-4 mr-2" />
          Share
        </button>
      </div>
      
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-600 text-center">
          Point your camera at this QR code to receive the file securely
        </p>
      </div>
    </div>
  );
} 
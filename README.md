# PeerLink - Secure P2P File Sharing with End-to-End Encryption

PeerLink is a secure peer-to-peer file sharing application that provides end-to-end encryption and QR code invite functionality for easy file sharing.

## 🚀 Features

### 🔐 End-to-End Encryption
- **AES-256-GCM encryption** for all files
- **Client-side encryption** - files are encrypted before upload
- **Secure key generation** using cryptographically secure random numbers
- **Automatic decryption** on download with the correct key

### 📱 QR Code Invites
- **QR code generation** for easy sharing
- **Encrypted invite codes** containing file metadata
- **Mobile-friendly** - scan QR codes with any camera app
- **Download and share** QR codes as images

### 🔒 Security Features
- **No server-side file storage** - files are only stored temporarily
- **Secure P2P connections** between peers
- **Encrypted metadata** in invite codes
- **Automatic session cleanup** when sharing ends

### 📁 File Sharing
- **Drag & drop** file upload interface
- **Real-time validation** of invite codes
- **File type detection** with visual icons
- **Progress indicators** for upload/download
- **Support for all file types** up to 100MB

## 🛠️ Technology Stack

### Frontend
- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **CryptoJS** - Client-side encryption
- **QRCode** - QR code generation
- **React Dropzone** - File upload

### Backend
- **Java 17** - Server runtime
- **AES-GCM** - Encryption algorithm
- **ZXing** - QR code generation
- **Jackson** - JSON processing
- **Apache Commons** - File handling

## 🚀 Quick Start

### Prerequisites
- Java 17 or higher
- Node.js 18 or higher
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd PeerLink-main
   ```

2. **Install frontend dependencies**
   ```bash
   cd ui
   npm install
   ```

3. **Build the backend**
   ```bash
   cd ..
   ./maven-mvnd-1.0.2-windows-amd64/bin/mvnd.cmd clean compile
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   java -cp "target/classes;target/dependency/*" p2p.App
   ```

2. **Start the frontend development server**
   ```bash
   cd ui
   npm run dev
   ```

3. **Open your browser**
   Navigate to `http://localhost:3000`

## 📖 Usage Guide

### Sharing a File

1. **Upload a file**
   - Drag and drop a file or click to browse
   - Enable encryption (recommended)
   - Click "Upload File"

2. **Share the invite**
   - Copy the invite code
   - Or generate a QR code for easy sharing
   - Share the code/QR with the recipient

3. **Recipient downloads**
   - Enter the invite code or scan QR code
   - File downloads automatically
   - Decryption happens client-side

### Security Best Practices

- **Always enable encryption** for sensitive files
- **Share encryption keys securely** (separate from invite codes)
- **Use QR codes** for in-person sharing
- **Verify file integrity** after download
- **Clean up sessions** when sharing is complete

## 🔧 Configuration

### Environment Variables
- `PORT` - Backend server port (default: 8080)
- `UPLOAD_DIR` - Temporary file storage directory
- `MAX_FILE_SIZE` - Maximum file size in bytes

### Security Settings
- Encryption algorithm: AES-256-GCM
- Key derivation: PBKDF2 with 1000 iterations
- QR code error correction: High (H)
- Session timeout: Configurable

## 🏗️ Architecture

### Frontend Architecture
```
ui/
├── src/
│   ├── app/           # Next.js app router
│   ├── components/    # React components
│   └── utils/         # Utility functions
├── public/            # Static assets
└── package.json       # Dependencies
```

### Backend Architecture
```
src/main/java/p2p/
├── App.java              # Main application
├── controller/           # HTTP handlers
├── service/             # Business logic
└── utils/               # Utilities
```

### Data Flow
1. **File Upload**: File → Encryption → Upload → Generate Invite
2. **File Download**: Invite → Download → Decryption → File
3. **QR Code**: Invite Data → QR Generation → Share → Scan

## 🔒 Security Model

### Encryption
- **Client-side encryption** using AES-256-GCM
- **Secure key generation** with cryptographically secure random numbers
- **No key storage** on server
- **Automatic IV generation** for each encryption

### Network Security
- **P2P connections** between peers
- **No central file storage**
- **Temporary file storage** with automatic cleanup
- **CORS protection** for web interface

### Privacy
- **No file metadata logging**
- **No user tracking**
- **Anonymous file sharing**
- **Session-based sharing**

## 🐛 Troubleshooting

### Common Issues

1. **File upload fails**
   - Check file size (max 100MB)
   - Verify network connection
   - Ensure backend is running

2. **QR code not scanning**
   - Ensure good lighting
   - Check QR code size
   - Verify invite code is valid

3. **Decryption fails**
   - Verify encryption key is correct
   - Check file wasn't corrupted
   - Ensure same encryption algorithm

### Debug Mode
Enable debug logging by setting the `DEBUG` environment variable:
```bash
export DEBUG=true
java -cp "target/classes;target/dependency/*" p2p.App
```

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Note**: This application is for educational and personal use. Always follow your organization's security policies when sharing files.

import CryptoJS from 'crypto-js';

export interface EncryptedData {
  encrypted: string;
  iv: string;
  salt: string;
}

export interface InviteCodeData {
  port: number;
  encryptionKey: string;
  filename: string;
  fileSize: number;
}

export class EncryptionUtils {
  private static readonly KEY_SIZE = 256;
  private static readonly ITERATION_COUNT = 1000;

  /**
   * Generate a random encryption key
   */
  static generateKey(): string {
    const wordArray = CryptoJS.lib.WordArray.random(32);
    return CryptoJS.enc.Base64.stringify(wordArray);
  }

  /**
   * Encrypt file data using AES-256-CBC
   */
  static encryptFile(fileData: ArrayBuffer, key: string): EncryptedData {
    try {
      // Convert ArrayBuffer to WordArray
      const uint8Array = new Uint8Array(fileData);
      const wordArray = CryptoJS.lib.WordArray.create(uint8Array);
      
      // Generate salt and IV
      const salt = CryptoJS.lib.WordArray.random(128 / 8);
      const iv = CryptoJS.lib.WordArray.random(128 / 8);

      // Derive key using PBKDF2
      const derivedKey = CryptoJS.PBKDF2(key, salt, {
        keySize: this.KEY_SIZE / 32,
        iterations: this.ITERATION_COUNT
      });

      // Encrypt the data
      const encrypted = CryptoJS.AES.encrypt(wordArray, derivedKey, {
        iv: iv,
        padding: CryptoJS.pad.Pkcs7,
        mode: CryptoJS.mode.CBC
      });

      return {
        encrypted: encrypted.toString(),
        iv: CryptoJS.enc.Hex.stringify(iv),
        salt: CryptoJS.enc.Hex.stringify(salt)
      };
    } catch (error) {
      console.error('Encryption error:', error);
      throw new Error('Failed to encrypt file data');
    }
  }

  /**
   * Decrypt file data using AES-256-CBC
   */
  static decryptFile(encryptedData: EncryptedData, key: string): ArrayBuffer {
    try {
      // Parse salt and IV from hex strings
      const salt = CryptoJS.enc.Hex.parse(encryptedData.salt);
      const iv = CryptoJS.enc.Hex.parse(encryptedData.iv);

      // Derive key using PBKDF2
      const derivedKey = CryptoJS.PBKDF2(key, salt, {
        keySize: this.KEY_SIZE / 32,
        iterations: this.ITERATION_COUNT
      });

      // Decrypt the data
      const decrypted = CryptoJS.AES.decrypt(encryptedData.encrypted, derivedKey, {
        iv: iv,
        padding: CryptoJS.pad.Pkcs7,
        mode: CryptoJS.mode.CBC
      });

      // Convert WordArray to ArrayBuffer
      const wordArray = decrypted;
      const words = wordArray.words;
      const arrayBuffer = new ArrayBuffer(words.length * 4);
      const uint8Array = new Uint8Array(arrayBuffer);
      
      for (let i = 0; i < words.length; i++) {
        const word = words[i];
        uint8Array[i * 4] = (word >>> 24) & 0xff;
        uint8Array[i * 4 + 1] = (word >>> 16) & 0xff;
        uint8Array[i * 4 + 2] = (word >>> 8) & 0xff;
        uint8Array[i * 4 + 3] = word & 0xff;
      }

      return arrayBuffer;
    } catch (error) {
      console.error('Decryption error:', error);
      throw new Error('Failed to decrypt file data');
    }
  }

  /**
   * Encrypt invite code data
   */
  static encryptInviteData(data: InviteCodeData, key: string): string {
    try {
      const jsonString = JSON.stringify(data);
      const encrypted = CryptoJS.AES.encrypt(jsonString, key).toString();
      return encrypted;
    } catch (error) {
      console.error('Invite data encryption error:', error);
      throw new Error('Failed to encrypt invite data');
    }
  }

  /**
   * Decrypt invite code data
   */
  static decryptInviteData(encryptedData: string, key: string): InviteCodeData {
    try {
      const decrypted = CryptoJS.AES.decrypt(encryptedData, key);
      const jsonString = decrypted.toString(CryptoJS.enc.Utf8);
      
      if (!jsonString) {
        throw new Error('Decryption resulted in empty string');
      }
      
      return JSON.parse(jsonString);
    } catch (error) {
      console.error('Invite data decryption error:', error);
      throw new Error('Failed to decrypt invite data');
    }
  }

  /**
   * Generate a secure random string for invite codes
   */
  static generateInviteCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    const randomValues = new Uint8Array(8);
    
    // Use crypto.getRandomValues if available, fallback to Math.random
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      crypto.getRandomValues(randomValues);
      for (let i = 0; i < 8; i++) {
        result += chars.charAt(randomValues[i] % chars.length);
      }
    } else {
      for (let i = 0; i < 8; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
    }
    
    return result;
  }

  /**
   * Convert ArrayBuffer to base64 string
   */
  static arrayBufferToBase64(buffer: ArrayBuffer): string {
    try {
      const bytes = new Uint8Array(buffer);
      let binary = '';
      for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      return btoa(binary);
    } catch (error) {
      console.error('ArrayBuffer to Base64 error:', error);
      throw new Error('Failed to convert ArrayBuffer to Base64');
    }
  }

  /**
   * Convert base64 string to ArrayBuffer
   */
  static base64ToArrayBuffer(base64: string): ArrayBuffer {
    try {
      const binaryString = atob(base64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      return bytes.buffer;
    } catch (error) {
      console.error('Base64 to ArrayBuffer error:', error);
      throw new Error('Failed to convert Base64 to ArrayBuffer');
    }
  }

  /**
   * Validate if a string is a valid encryption key
   */
  static isValidKey(key: string): boolean {
    try {
      // Try to decode the base64 key
      const decoded = CryptoJS.enc.Base64.parse(key);
      return decoded.words.length >= 4; // At least 128 bits
    } catch {
      return false;
    }
  }

  /**
   * Generate a secure random password for encryption
   */
  static generatePassword(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let result = '';
    const randomValues = new Uint8Array(16);
    
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      crypto.getRandomValues(randomValues);
      for (let i = 0; i < 16; i++) {
        result += chars.charAt(randomValues[i] % chars.length);
      }
    } else {
      for (let i = 0; i < 16; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
    }
    
    return result;
  }
} 
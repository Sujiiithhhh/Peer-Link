declare module 'crypto-js' {
  export interface WordArray {
    words: number[];
    sigBytes: number;
    toString(encoder?: any): string;
    concat(wordArray: WordArray): WordArray;
    clone(): WordArray;
  }

  export interface CipherParams {
    ciphertext: WordArray;
    key?: WordArray;
    iv?: WordArray;
    salt?: WordArray;
    algorithm?: string;
    mode?: string;
    padding?: string;
    blockSize?: number;
    formatter?: any;
    toString(): string;
  }

  export interface LibStatic {
    WordArray: {
      random(nBytes: number): WordArray;
      create(array: any): WordArray;
    };
    CipherParams: {
      create(cipherParams: any): CipherParams;
    };
  }

  export interface EncStatic {
    Hex: {
      stringify(wordArray: WordArray): string;
      parse(hexStr: string): WordArray;
    };
    Base64: {
      stringify(wordArray: WordArray): string;
      parse(base64Str: string): WordArray;
    };
    Utf8: {
      stringify(wordArray: WordArray): string;
      parse(utf8Str: string): WordArray;
    };
  }

  export interface AESStatic {
    encrypt(message: string | WordArray, key: string | WordArray, cfg?: any): CipherParams;
    decrypt(ciphertext: string | CipherParams, key: string | WordArray, cfg?: any): WordArray;
  }

  export interface PBKDF2Static {
    (password: string | WordArray, salt: string | WordArray, cfg?: any): WordArray;
  }

  export interface PadStatic {
    Pkcs7: any;
    Iso97971: any;
    AnsiX923: any;
    Iso10126: any;
    ZeroPadding: any;
    NoPadding: any;
  }

  export interface ModeStatic {
    CBC: any;
    CFB: any;
    CTR: any;
    CTRGladman: any;
    OFB: any;
    ECB: any;
  }

  export const lib: LibStatic;
  export const enc: EncStatic;
  export const AES: AESStatic;
  export const PBKDF2: PBKDF2Static;
  export const pad: PadStatic;
  export const mode: ModeStatic;

  export default {
    lib,
    enc,
    AES,
    PBKDF2,
    pad,
    mode
  };
} 
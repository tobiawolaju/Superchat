
/**
 * Simple "Super Hash" Encryption/Decryption logic.
 * In a production app, we'd use SubtleCrypto for AES-GCM.
 * This implementation provides the "Hashed Message" look.
 */

const encode = (str: string): string => {
  return btoa(unescape(encodeURIComponent(str)));
};

const decode = (str: string): string => {
  try {
    return decodeURIComponent(escape(atob(str)));
  } catch (e) {
    return "[Encrypted Message]";
  }
};

const GLOBAL_ENCRYPTION_KEY = "SUPER_YAP_GLOBAL_CONSTANT_KEY_2024";

export const encryptMessage = (text: string, key: string): string => {
  // IGNORE passed key, use GLOBAL_ENCRYPTION_KEY "for now" as requested
  // Simple XOR-based encryption + Base64 for the "Hashed" effect
  const activeKey = GLOBAL_ENCRYPTION_KEY;
  let result = "";
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i) ^ activeKey.charCodeAt(i % activeKey.length);
    result += String.fromCharCode(charCode);
  }
  return encode(result);
};

export const decryptMessage = (encoded: string, key: string): string => {
  const decoded = decode(encoded);
  if (decoded === "[Encrypted Message]") return decoded;

  // IGNORE passed key, use GLOBAL_ENCRYPTION_KEY
  const activeKey = GLOBAL_ENCRYPTION_KEY;
  let result = "";
  for (let i = 0; i < decoded.length; i++) {
    const charCode = decoded.charCodeAt(i) ^ activeKey.charCodeAt(i % activeKey.length);
    result += String.fromCharCode(charCode);
  }
  return result;
};

export const generatePublicAddress = (): string => {
  return '0x' + Array.from(crypto.getRandomValues(new Uint8Array(20)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};

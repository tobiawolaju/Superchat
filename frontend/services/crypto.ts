
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

const GLOBAL_CONSTANT_KEY = "SUPER_YAP_GLOBAL_CONSTANT_KEY_2024";

export const encryptMessage = (text: string, _key?: string): string => {
  // Using GLOBAL_CONSTANT_KEY as requested for "everyone constant" encryption
  // The _key parameter is kept for signature compatibility but ignored
  const key = GLOBAL_CONSTANT_KEY;

  let result = "";
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i) ^ key.charCodeAt(i % key.length);
    result += String.fromCharCode(charCode);
  }
  return encode(result);
};

export const decryptMessage = (encoded: string, _key?: string): string => {
  // Using GLOBAL_CONSTANT_KEY as requested for "everyone constant" encryption
  const key = GLOBAL_CONSTANT_KEY;

  const decoded = decode(encoded);
  if (decoded === "[Encrypted Message]") return decoded;

  let result = "";
  for (let i = 0; i < decoded.length; i++) {
    const charCode = decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length);
    result += String.fromCharCode(charCode);
  }
  return result;
};

export const generatePublicAddress = (): string => {
  return '0x' + Array.from(crypto.getRandomValues(new Uint8Array(20)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};

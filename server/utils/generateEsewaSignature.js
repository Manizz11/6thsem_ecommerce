import CryptoJS from 'crypto-js';

export const generateEsewaSignature = (secretKey, signatureString) => {
  const hash = CryptoJS.HmacSHA256(signatureString, secretKey);
  return CryptoJS.enc.Base64.stringify(hash);
};
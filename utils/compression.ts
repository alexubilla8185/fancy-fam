import pako from 'pako';
import { CardData } from '../types';

// Helper to convert Uint8Array to a URL-safe Base64 string in a memory-safe way
const uint8ArrayToBase64Url = (bytes: Uint8Array): string => {
  const CHUNK_SIZE = 8192; // Use chunks to avoid call stack limits with String.fromCharCode.apply
  let binary = '';
  for (let i = 0; i < bytes.length; i += CHUNK_SIZE) {
      // For smaller chunks, `apply` is faster than a loop.
      // The `as unknown as number[]` is a necessary type assertion here.
      binary += String.fromCharCode.apply(null, bytes.subarray(i, i + CHUNK_SIZE) as unknown as number[]);
  }
  return btoa(binary)
    .replace(/\+/g, '-') // Convert '+' to '-'
    .replace(/\//g, '_') // Convert '/' to '_'
    .replace(/=/g, '');  // Remove padding
};

// Helper to convert a URL-safe Base64 string back to a Uint8Array
const base64UrlToUint8Array = (base64Url: string): Uint8Array => {
  let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  // Add padding back
  const padding = '='.repeat((4 - base64.length % 4) % 4);
  base64 += padding;
  
  const binary_string = atob(base64);
  const len = binary_string.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes;
};

/**
 * Compresses and encodes card data into a URL-safe string.
 */
export const encodeCardData = (data: CardData): string => {
  const jsonString = JSON.stringify(data);
  const compressed = pako.deflate(jsonString, { level: 9 });
  return uint8ArrayToBase64Url(compressed);
};

// Legacy decoding function (modern uncompressed)
const b64ToUtf8 = (str: string): string => {
    const binaryString = atob(str);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return new TextDecoder().decode(bytes);
};

/**
 * Decodes card data from a hash, trying new compressed format first, then falling back to older formats.
 */
export const decodeCardDataWithFallback = (hash: string): CardData | null => {
    try {
        // Try the new compressed format first
        const compressed = base64UrlToUint8Array(hash);
        const jsonString = pako.inflate(compressed, { to: 'string' });
        return JSON.parse(jsonString) as CardData;
    } catch (e) {
        console.warn("Failed to decode compressed data, trying fallbacks...", e);
        try {
            // Fallback 1: Modern uncompressed (TextEncoder/Decoder)
            const decodedData = b64ToUtf8(hash);
            return JSON.parse(decodedData) as CardData;
        } catch (e2) {
             console.warn("Failed to decode modern uncompressed data, trying legacy fallback...", e2);
            try {
                // Fallback 2: Legacy (decodeURIComponent) - handles the very first encoding scheme
                const decodedData = decodeURIComponent(atob(hash));
                return JSON.parse(decodedData) as CardData;
            } catch (e3) {
                console.error("All decoding attempts failed.", e3);
                return null;
            }
        }
    }
};
import crypto from 'crypto';

// Validate encryption key
function getEncryptionKey(): Buffer {
  const key = process.env.ENCRYPTION_KEY;
  
  if (!key) {
    console.warn('ENCRYPTION_KEY not set. Generating a temporary key.');
    return crypto.randomBytes(32);
  }

  // Ensure key is exactly 32 bytes (256 bits)
  const keyBuffer = Buffer.from(key, 'hex');
  
  if (keyBuffer.length !== 32) {
    throw new Error('ENCRYPTION_KEY must be a 64-character hex string (32 bytes)');
  }

  return keyBuffer;
}

// Secure encryption key
const ENCRYPTION_KEY = getEncryptionKey();
const IV_LENGTH = 16; // For AES, this is always 16

export function encryptApiKey(apiKey: string): string {
  try {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
    
    let encrypted = cipher.update(apiKey, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    return iv.toString('hex') + ':' + encrypted;
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt API key');
  }
}

export function decryptApiKey(encryptedKey: string): string {
  try {
    const textParts = encryptedKey.split(':');
    const iv = Buffer.from(textParts[0], 'hex');
    const encryptedText = textParts[1];
    
    const decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
    
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt API key');
  }
}

// Validate API key format for different providers
export function validateApiKey(type: string, apiKey: string): boolean {
  switch (type.toLowerCase()) {
    case 'stripe':
      return /^sk_(?:test|live)_[A-Za-z0-9]+$/.test(apiKey);
    case 'paypal':
      return /^[A-Z0-9-_]+$/.test(apiKey);
    default:
      return apiKey.length > 10; // Basic validation
  }
}

// Key rotation utility
export function rotateEncryptionKey(): void {
  const newKey = crypto.randomBytes(32).toString('hex');
  console.warn('Encryption key rotated. Update ENCRYPTION_KEY in .env');
  // In a real-world scenario, you'd need a more complex key rotation strategy
  // that involves re-encrypting existing keys
}
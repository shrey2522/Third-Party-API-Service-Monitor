const crypto = require('crypto');

const ALGORITHM = 'aes-256-cbc';

// Safety check to prevent crash if key is missing
if (!process.env.MASTER_ENCRYPTION_KEY) {
    console.error('❌ ERROR: MASTER_ENCRYPTION_KEY is not defined in environment variables!');
    console.error('Encryption/Decryption will fail until this is set.');
}

const KEY = process.env.MASTER_ENCRYPTION_KEY 
    ? Buffer.from(process.env.MASTER_ENCRYPTION_KEY, 'hex')
    : Buffer.alloc(32); // Fallback to empty buffer to prevent crash

/**
 * Encrypt a string
 * @param {string} text - The plain text to encrypt
 * @returns {string} - The encrypted string in format 'iv:encryptedData'
 */
const encrypt = (text) => {
    if (!text) return null;
    
    try {
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);
        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        
        // We return the IV along with the encrypted data so we can decrypt it later
        return `${iv.toString('hex')}:${encrypted}`;
    } catch (error) {
        console.error('Encryption error:', error);
        return null;
    }
};

/**
 * Decrypt an encrypted string
 * @param {string} encryptedText - The text in 'iv:encryptedData' format
 * @returns {string} - The original plain text
 */
const decrypt = (encryptedText) => {
    if (!encryptedText) return null;
    
    try {
        const [ivHex, encryptedData] = encryptedText.split(':');
        if (!ivHex || !encryptedData) return null;
        
        const iv = Buffer.from(ivHex, 'hex');
        const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);
        let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        
        return decrypted;
    } catch (error) {
        console.error('Decryption error:', error);
        return null;
    }
};

module.exports = {
    encrypt,
    decrypt
};

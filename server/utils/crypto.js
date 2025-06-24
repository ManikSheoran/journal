const crypto = require('crypto');
require('dotenv').config();
const process = require('process');

const ENCRYPTION_KEY = process.env.JOURNAL_SECRET_KEY;

if (!ENCRYPTION_KEY || Buffer.from(ENCRYPTION_KEY, 'utf-8').length !== 32) {
    throw new Error('JOURNAL_SECRET_KEY environment variable must be a 32-byte key.');
}

const IV_LENGTH = 16;

function encrypt(text) {
    if (typeof text !== 'string') text = String(text ?? '');
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY, 'utf-8'), iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
}

function decrypt(text) {
    if (!text || typeof text !== 'string' || !text.includes(':')) {
        return text || '';
    }
    try {
        const textParts = text.split(':');
        const ivHex = textParts.shift();
        if (!ivHex) return text;
        const encryptedText = textParts.join(':');
        const iv = Buffer.from(ivHex, 'hex');
        const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY, 'utf-8'), iv);
        let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    } catch (error) {
        console.error("Decryption failed:", error);
        return text;
    }
}

module.exports = { encrypt, decrypt };
import crypto from 'crypto';
import QRCode from 'qrcode';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const HMAC_SECRET = process.env.HMAC_SECRET || 'default_secret_for_development';

/**
 * Generate HMAC signature for a payload
 * @param {Object} payload - The data to sign
 * @returns {string} - The HMAC signature
 */
export function generateSignature(payload) {
  const hmac = crypto.createHmac('sha256', HMAC_SECRET);
  hmac.update(JSON.stringify(payload));
  return hmac.digest('hex');
}

/**
 * Verify HMAC signature for a payload
 * @param {Object} payload - The data that was signed
 * @param {string} signature - The signature to verify
 * @returns {boolean} - Whether the signature is valid
 */
export function verifySignature(payload, signature) {
  const expectedSignature = generateSignature(payload);
  try {
    return crypto.timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    );
  } catch (error) {
    return false;
  }
}

/**
 * Generate a QR code data URL from a payload
 * @param {Object} data - The data to encode in the QR code
 * @returns {Promise<string>} - The QR code data URL
 */
export async function generateQRCode(data) {
  try {
    return await QRCode.toDataURL(JSON.stringify(data));
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw error;
  }
}

/**
 * Create a secure QR code payload with HMAC signature
 * @param {Object} data - The data to include in the QR code
 * @returns {Object} - The payload with signature
 */
export function createSecureQRPayload(data) {
  // Add timestamp for freshness
  const payload = {
    ...data,
    ts: Date.now()
  };
  
  // Generate and add signature
  const signature = generateSignature(payload);
  return {
    ...payload,
    signature
  };
}

/**
 * Generate a human-friendly recommendation reason
 * @param {Object} session - The session object
 * @param {Object} attendee - The attendee object
 * @returns {string} - A recommendation reason
 */
export function generateRecommendationReason(session, attendee) {
  const reasons = [];
  
  // Check for matching interests/tags
  const matchingTags = session.tags.filter(tag => 
    attendee.interests.includes(tag.toLowerCase())
  );
  
  if (matchingTags.length > 0) {
    reasons.push(`matches your interest in ${matchingTags.join(', ')}`);
  }
  
  // Add popularity factor
  if (session.popularity > 75) {
    reasons.push('is very popular among attendees');
  } else if (session.bookmarks > 40) {
    reasons.push('has been bookmarked by many participants');
  }
  
  // Add speaker expertise
  reasons.push(`features ${session.speaker}, an expert in the field`);
  
  // Select 1-2 random reasons for diversity
  const selectedReasons = reasons.sort(() => 0.5 - Math.random()).slice(0, 2);
  
  return `Recommended because this session ${selectedReasons.join(' and ')}`;
}

export default {
  generateSignature,
  verifySignature,
  generateQRCode,
  createSecureQRPayload,
  generateRecommendationReason
};
import crypto from 'crypto';

const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || process.env.FIREBASE_ADMIN_PRIVATE_KEY || 'default-portfolio-admin-secret-2026';

export interface AdminSessionData {
  uid: string;
  email: string;
  isAdmin: boolean;
  exp: number;
}

export function createSessionToken(email: string): string {
  const payload: AdminSessionData = {
    uid: 'admin-' + Buffer.from(email).toString('hex').slice(0, 10),
    email,
    isAdmin: true,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
  };

  const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(payloadBase64)
    .digest('base64url');

  return `${payloadBase64}.${signature}`;
}

export function verifySessionToken(token: string): AdminSessionData | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return null;

    const [payloadBase64, signature] = parts;
    const expectedSignature = crypto
      .createHmac('sha256', SESSION_SECRET)
      .update(payloadBase64)
      .digest('base64url');

    const sigBuf = Buffer.from(signature);
    const expBuf = Buffer.from(expectedSignature);
    if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
      return null;
    }

    const payload = JSON.parse(Buffer.from(payloadBase64, 'base64url').toString('utf8')) as AdminSessionData;
    if (Date.now() > payload.exp) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

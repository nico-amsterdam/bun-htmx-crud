import { createHmac, getRandomValues, KeyObject } from 'crypto'

// function from Lucia auth, see https://lucia-auth.com/sessions/basic
export function generateSecureRandomString(): string {
  // Human readable alphabet (a-z, 0-9 without l, o, 0, 1 to avoid confusion)
  const alphabet = 'abcdefghijkmnpqrstuvwxyz23456789';

  // Generate 24 bytes = 192 bits of entropy.
  // We're only going to use 5 bits per byte so the total entropy will be 192 * 5 / 8 = 120 bits
  const bytes = new Uint8Array(24);
  getRandomValues(bytes);

  let id = '';
  for (let i = 0; i < bytes.length; i++) {
    // >> 3 "removes" the right-most 3 bits of the byte
    id += alphabet[bytes[i] >> 3];
  }
  return id;
}

export function getIp(headers: Record<string, string | undefined>): string {
  return headers['cf-connecting-ip'] || ''
}

// Allow to switch from Mobile to Desktop view without relogin.
export function stripMobileDesktopFromUserAgent(userAgent: string | undefined): string {
  return (userAgent || '').replace(/ \([^)]+\)/, '').replaceAll(/ Edg(A|iOS)?(\/[0-9.]+)/g, ' Edg').replaceAll(/ Mobile(\/[0-9.])*/g, '').replaceAll(/ OPR(\/[0-9.]+)/g, ' OPR')
}

export function calcStateHmac(headers: Record<string, string | undefined>, secretKeyObject: KeyObject): string {
  return createHmac("sha256", secretKeyObject)
    .update(getIp(headers)
      + 'some pepper'
      + stripMobileDesktopFromUserAgent(headers['user-agent'])
      + headers['x-forwarded-proto']
      + headers['x-forwarded-for'])
    .digest('hex')
    .substring(0, 10)
}


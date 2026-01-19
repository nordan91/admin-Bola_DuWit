interface OTPEntry {
  code: string;
  expiresAt: number;
  attempts: number;
}

const OTP_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes
const MAX_ATTEMPTS = 3;
const otpStore = new Map<string, OTPEntry>();

const cleanupExpiredEntries = () => {
  const now = Date.now();
  for (const [email, entry] of otpStore.entries()) {
    if (now > entry.expiresAt) {
      otpStore.delete(email);
    }
  }
};

setInterval(cleanupExpiredEntries, 60 * 1000);

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function createOTP(email: string): OTPEntry {
  const entry: OTPEntry = {
    code: generateOTP(),
    expiresAt: Date.now() + OTP_EXPIRY_MS,
    attempts: 0,
  };

  otpStore.set(email, entry);
  return entry;
}

export function verifyOTP(email: string, code: string): { valid: boolean; reason?: string } {
  const entry = otpStore.get(email);

  if (!entry) {
    return { valid: false, reason: 'Kode OTP tidak ditemukan. Silakan kirim ulang.' };
  }

  if (Date.now() > entry.expiresAt) {
    otpStore.delete(email);
    return { valid: false, reason: 'Kode OTP telah kedaluwarsa.' };
  }

  if (entry.attempts >= MAX_ATTEMPTS) {
    otpStore.delete(email);
    return { valid: false, reason: 'Percobaan verifikasi melebihi batas. Kode direset.' };
  }

  entry.attempts += 1;

  if (entry.code !== code) {
    return {
      valid: false,
      reason: `Kode salah. Sisa percobaan ${Math.max(0, MAX_ATTEMPTS - entry.attempts)}.`,
    };
  }

  otpStore.delete(email);
  return { valid: true };
}

export function clearOTP(email: string) {
  otpStore.delete(email);
}

export function getRemainingSeconds(email: string): number {
  const entry = otpStore.get(email);
  if (!entry) return 0;
  const remaining = Math.max(0, entry.expiresAt - Date.now());
  return Math.floor(remaining / 1000);
}

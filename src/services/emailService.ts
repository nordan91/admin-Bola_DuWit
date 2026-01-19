import emailjs from '@emailjs/browser';

interface SendOtpOptions {
  toEmail: string;
  userName: string;
  otpCode: string;
}

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

const ensureConfig = () => {
  if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
    throw new Error('Konfigurasi EmailJS belum lengkap. Pastikan env VITE_EMAILJS_* sudah diisi.');
  }
};

export async function sendOtpEmail({ toEmail, userName: _userName, otpCode }: SendOtpOptions) {
  ensureConfig();

  const expiryTime = new Date(Date.now() + 15 * 60 * 1000).toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  });

  await emailjs.send(
    SERVICE_ID as string,
    TEMPLATE_ID as string,
    {
      email: toEmail,
      passcode: otpCode,
      time: expiryTime,
    },
    PUBLIC_KEY as string,
  );
}

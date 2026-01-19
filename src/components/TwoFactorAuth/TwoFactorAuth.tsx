import { useEffect, useRef, useState } from 'react';
import { createOTP, verifyOTP, clearOTP, getRemainingSeconds } from '../../services/otpService';
import { sendOtpEmail } from '../../services/emailService';
import './TwoFactorAuth.css';

interface TwoFactorAuthProps {
  email: string;
  userName: string;
  onVerified: () => void;
  onCancel: () => void;
}

const OTP_LENGTH = 6;

export function TwoFactorAuth({ email, userName, onVerified, onCancel }: TwoFactorAuthProps) {
  const [otpDigits, setOtpDigits] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const intervalRef = useRef<number | null>(null);
  const hasRequestedInitialOtp = useRef(false);

  useEffect(() => {
    if (!hasRequestedInitialOtp.current) {
      hasRequestedInitialOtp.current = true;
      sendOtp();
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = window.setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const sendOtp = async () => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const otpData = createOTP(email);
      await sendOtpEmail({
        toEmail: email,
        userName,
        otpCode: otpData.code,
      });

      setCooldown(getRemainingSeconds(email));
      startTimer();
      setSuccessMessage('Kode OTP berhasil dikirim ke email Anda.');
    } catch (err: any) {
      clearOTP(email);
      setError(err.message || 'Gagal mengirim kode OTP. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return;

    const nextDigits = [...otpDigits];
    nextDigits[index] = value;
    setOtpDigits(nextDigits);

    if (value && index < OTP_LENGTH - 1) {
      const nextInput = document.querySelector<HTMLInputElement>(`input[data-otp-index="${index + 1}"]`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace' && !otpDigits[index] && index > 0) {
      const prevInput = document.querySelector<HTMLInputElement>(`input[data-otp-index="${index - 1}"]`);
      prevInput?.focus();
    }
  };

  const handleVerify = () => {
    setError(null);
    const code = otpDigits.join('');

    if (code.length !== OTP_LENGTH) {
      setError('Masukkan 6 digit kode OTP.');
      return;
    }

    const result = verifyOTP(email, code);
    if (result.valid) {
      onVerified();
    } else {
      setError(result.reason || 'Kode OTP tidak valid.');
    }
  };

  const handleResend = () => {
    clearOTP(email);
    setOtpDigits(Array(OTP_LENGTH).fill(''));
    sendOtp();
  };

  const handleCancel = () => {
    clearOTP(email);
    setOtpDigits(Array(OTP_LENGTH).fill(''));
    onCancel();
  };

  return (
    <div className="two-fa-wrapper">
      <div className="two-fa-card">
        <h2>Verifikasi Dua Faktor</h2>
        <p className="two-fa-description">
          Kami telah mengirimkan kode 6 digit ke email <strong>{email}</strong>. Masukkan kode tersebut untuk melanjutkan.
        </p>

        <div className="two-fa-inputs">
          {otpDigits.map((digit, index) => (
            <input
              key={index}
              data-otp-index={index}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(event) => handleChange(index, event.target.value)}
              onKeyDown={(event) => handleKeyDown(index, event)}
            />
          ))}
        </div>

        {error && <div className="two-fa-error">{error}</div>}
        {successMessage && <div className="two-fa-success">{successMessage}</div>}

        <div className="two-fa-actions">
          <button type="button" className="btn-primary" onClick={handleVerify} disabled={isLoading}>
            Verifikasi
          </button>
          <button type="button" className="btn-secondary" onClick={handleCancel} disabled={isLoading}>
            Kembali
          </button>
        </div>

        <div className="two-fa-footer">
          <p>
            Tidak menerima kode?{' '}
            <button type="button" className="link-button" onClick={handleResend} disabled={isLoading || cooldown > 0}>
              {cooldown > 0 ? `Kirim ulang (${cooldown}s)` : 'Kirim ulang sekarang'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { EyeIcon } from '../icons/EyeIcon';
import { EyeOffIcon } from '../icons/EyeOffIcon';
import { apiService } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import './LoginPage.css';

interface LoginPageProps {
  onLoginSuccess?: () => void;
}

export function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [kata_sandi, setkata_sandi] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await apiService.login({ email, kata_sandi });
      
      // Store token and user data, update auth state
      login(response.data.token, response.data.user);
      
      // Call success callback
      if (onLoginSuccess) {
        onLoginSuccess();
      }
    } catch (err: any) {
      setError(err.message || 'Login gagal. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <img 
            src="/logo_boladuwit.png" 
            alt="Bola DuWit Logo" 
            className="login-logo"
          />
          <div className="login-title-wrapper">
            <p className="login-subtitle">Admin Panel</p>
          </div>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {error && (
            <div className="login-error">
              {error}
            </div>
          )}
          <div className="form-group">
            <label htmlFor="email" className="form-label">email</label>
            <input
              id="email"
              type="text"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">password</label>
            <div className="password-input-wrapper">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                value={kata_sandi}
                onChange={(e) => setkata_sandi(e.target.value)}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? (
                  <EyeOffIcon width={20} height={20} color="#9CA3AF" />
                ) : (
                  <EyeIcon width={20} height={20} color="#9CA3AF" />
                )}
              </button>
            </div>
          </div>

          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? 'Memproses...' : 'Sign in'}
          </button>
        </form>


      </div>
    </div>
  );
}
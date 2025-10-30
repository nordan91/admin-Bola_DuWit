import { useState } from 'react';
import { EyeIcon } from '../icons/EyeIcon';
import { ChevronDownIcon } from '../icons/ChevronDownIcon';
import './LoginPage.css';

interface LoginPageProps {
  onLoginSuccess?: () => void;
}

export function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const language = 'English';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate credentials
    if (username === 'admin' && password === 'admin') {
      if (onLoginSuccess) {
        onLoginSuccess();
      }
    } else {
      setError('Username atau password salah. Gunakan username: admin, password: admin');
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <img 
            src="/Logo_bola_duwit.jpg" 
            alt="Bola DuWit Logo" 
            className="login-logo"
          />
          <div className="login-title-wrapper">
            <h1 className="login-title">Bola DuWit</h1>
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
            <label htmlFor="username" className="form-label">Username</label>
            <input
              id="username"
              type="text"
              className="form-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <div className="password-input-wrapper">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
              >
                <EyeIcon width={20} height={20} color="#9CA3AF" />
              </button>
            </div>
          </div>

          <button type="submit" className="login-button">
            Sign in
          </button>
        </form>

        <div className="login-footer">
          <div className="language-selector">
            <span className="language-label">Language:</span>
            <button className="language-button" type="button">
              <span className="language-value">{language}</span>
              <ChevronDownIcon width={16} height={16} color="#5DADE2" />
            </button>
          </div>
          <div className="timestamp">2021-08-13 16:20:02</div>
        </div>

      </div>
    </div>
  );
}
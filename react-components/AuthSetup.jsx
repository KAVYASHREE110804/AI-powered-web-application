import React, { useState } from 'react';
import PropTypes from 'prop-types';

const colors = {
  rausch: '#FF385C',
  dark: '#222222',
  secondary: '#717171',
  border: '#DDDDDD',
  babu: '#00A699',
  arches: '#FFB400',
  background: '#F7F7F7',
  white: '#FFFFFF',
};

const styles = {
  page: {
    margin: 0,
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', sans-serif",
    backgroundColor: colors.background,
    minHeight: '100vh',
  },
  navbar: {
    height: '80px',
    backgroundColor: colors.white,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 32px',
    borderBottom: `1px solid ${colors.border}`,
  },
  logo: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: colors.dark,
  },
  tokens: {
    fontSize: '16px',
    color: colors.secondary,
  },
  avatar: {
    width: '40px',
    height: '40px',
    backgroundColor: colors.secondary,
    borderRadius: '50%',
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    maxWidth: '1200px',
    margin: '32px auto',
    gap: '32px',
  },
  panel: {
    background: colors.white,
    borderRadius: '12px',
    boxShadow:
      '0 1px 2px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(0, 0, 0, 0.05)',
    padding: '24px',
    flex: 1,
  },
  authOptions: {
    marginBottom: '24px',
  },
  authToggle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '16px',
  },
  authToggleLabel: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: colors.dark,
  },
  authToggleDescription: {
    fontSize: '14px',
    color: colors.secondary,
  },
  switch: {
    position: 'relative',
    display: 'inline-block',
    width: '34px',
    height: '20px',
  },
  switchInput: {
    opacity: 0,
    width: 0,
    height: 0,
  },
  slider: (checked) => ({
    position: 'absolute',
    cursor: 'pointer',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: checked ? colors.rausch : colors.border,
    transition: '.4s',
    borderRadius: '20px',
  }),
  sliderKnob: (checked) => ({
    position: 'absolute',
    height: '14px',
    width: '14px',
    left: '3px',
    bottom: '3px',
    backgroundColor: colors.white,
    transition: '.4s',
    borderRadius: '50%',
    transform: checked ? 'translateX(14px)' : 'none',
  }),
  loginPreview: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  loginInput: {
    width: '100%',
    padding: '14px',
    fontSize: '15px',
    border: `1px solid ${colors.border}`,
    borderRadius: '8px',
    boxSizing: 'border-box',
  },
  signInButton: {
    background: colors.rausch,
    color: colors.white,
    border: 'none',
    padding: '14px',
    fontSize: '15px',
    fontWeight: 600,
    borderRadius: '8px',
    cursor: 'pointer',
    width: '100%',
  },
  saveButton: {
    background: colors.rausch,
    color: colors.white,
    border: 'none',
    padding: '14px 0',
    fontSize: '15px',
    fontWeight: 600,
    borderRadius: '8px',
    marginTop: '24px',
    width: '100%',
    cursor: 'pointer',
  },
};

function ToggleSwitch({ checked, onChange }) {
  return (
    <label className="switch" style={styles.switch}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        style={styles.switchInput}
      />
      <span className="slider" style={styles.slider(checked)}>
        <span style={styles.sliderKnob(checked)} />
      </span>
    </label>
  );
}

ToggleSwitch.propTypes = {
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
};

function AuthSetup({ logoText, tokenText, authOptions, onSave }) {
  const [toggles, setToggles] = useState(() =>
    authOptions.reduce((acc, option) => {
      acc[option.id] = option.enabled;
      return acc;
    }, {})
  );
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const setToggle = (id, value) => {
    setToggles((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <div style={styles.page}>
      <div className="navbar" style={styles.navbar}>
        <div className="logo" style={styles.logo}>{logoText}</div>
        <div className="tokens" style={styles.tokens}>{tokenText}</div>
        <div className="avatar" style={styles.avatar} />
      </div>
      <div className="container" style={styles.container}>
        <div className="panel auth-options" style={{ ...styles.panel, ...styles.authOptions }}>
          {authOptions.map((option) => (
            <div key={option.id} className="auth-toggle" style={styles.authToggle}>
              <div>
                <label style={styles.authToggleLabel}>{option.label}</label>
                <div className="description" style={styles.authToggleDescription}>
                  {option.description}
                </div>
              </div>
              <ToggleSwitch
                checked={toggles[option.id]}
                onChange={(value) => setToggle(option.id, value)}
              />
            </div>
          ))}
        </div>
        <div className="panel login-preview" style={{ ...styles.panel, ...styles.loginPreview }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.loginInput}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.loginInput}
          />
          <button type="button" style={styles.signInButton}>Sign In</button>
        </div>
      </div>
      <button
        type="button"
        className="save-button"
        style={styles.saveButton}
        onClick={() => onSave && onSave(toggles)}
      >
        Save &amp; Apply
      </button>
    </div>
  );
}

AuthSetup.propTypes = {
  logoText: PropTypes.string,
  tokenText: PropTypes.string,
  authOptions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      enabled: PropTypes.bool,
    })
  ),
  onSave: PropTypes.func,
};

AuthSetup.defaultProps = {
  logoText: 'Bolt AI',
  tokenText: '200,000 tokens',
  authOptions: [
    {
      id: 'emailPassword',
      label: 'Email/Password',
      description: 'Allow users to log in with email and password',
      enabled: false,
    },
    {
      id: 'googleOAuth',
      label: 'Google OAuth',
      description: 'Enable login using Google accounts',
      enabled: false,
    },
    {
      id: 'phoneOtp',
      label: 'Phone OTP',
      description: "Enable login using a one-time password sent to the user's phone",
      enabled: false,
    },
  ],
  onSave: null,
};

export default AuthSetup;

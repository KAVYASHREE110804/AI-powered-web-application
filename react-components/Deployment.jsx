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
    color: colors.dark,
    minHeight: '100vh',
  },
  navbar: {
    height: '80px',
    backgroundColor: colors.white,
    borderBottom: `1px solid ${colors.border}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 24px',
  },
  logo: {
    fontSize: '18px',
    fontWeight: 600,
    color: colors.dark,
  },
  tokens: {
    fontSize: '14px',
    color: colors.secondary,
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: colors.secondary,
  },
  content: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    padding: '48px 24px',
  },
  stepper: {
    display: 'flex',
    gap: '16px',
    marginBottom: '32px',
  },
  step: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    fontWeight: 600,
    fontSize: '16px',
  },
  completed: {
    backgroundColor: colors.babu,
    color: colors.white,
  },
  current: {
    backgroundColor: colors.rausch,
    color: colors.white,
  },
  upcoming: {
    backgroundColor: colors.border,
    color: colors.secondary,
  },
  info: {
    backgroundColor: colors.white,
    border: `1px solid ${colors.border}`,
    boxShadow: '0 1px 2px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.05)',
    borderRadius: '12px',
    padding: '24px',
    textAlign: 'center',
    maxWidth: '400px',
    marginBottom: '16px',
  },
  url: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background,
    border: `1px solid ${colors.border}`,
    borderRadius: '8px',
    padding: '8px 16px',
    marginTop: '24px',
    fontSize: '14px',
    color: colors.dark,
  },
  qrCode: {
    width: '120px',
    height: '120px',
    backgroundColor: colors.border,
    color: colors.secondary,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '8px',
    margin: '16px auto',
    fontSize: '14px',
  },
  button: {
    display: 'inline-block',
    padding: '14px 24px',
    fontWeight: 600,
    fontSize: '15px',
    borderRadius: '8px',
    textAlign: 'center',
    cursor: 'pointer',
  },
  buttonPrimary: {
    backgroundColor: colors.rausch,
    color: colors.white,
    border: 'none',
  },
  buttonSecondary: {
    backgroundColor: colors.white,
    color: colors.rausch,
    border: `1px solid ${colors.rausch}`,
    marginTop: '16px',
  },
};

const stepVariants = {
  completed: styles.completed,
  current: styles.current,
  upcoming: styles.upcoming,
};

function Deployment({ logoText, tokenText, steps, deploymentUrl, onDeployToAndroid }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(deploymentUrl);
    }
    setCopied(true);
  };

  return (
    <div style={styles.page}>
      <div className="navbar" style={styles.navbar}>
        <div className="logo" style={styles.logo}>{logoText}</div>
        <div className="tokens" style={styles.tokens}>{tokenText}</div>
        <div className="avatar" style={styles.avatar} />
      </div>

      <div className="content" style={styles.content}>
        <div className="stepper" style={styles.stepper}>
          {steps.map((step, index) => (
            <div
              key={index}
              className={`step ${step.state}`}
              style={{ ...styles.step, ...stepVariants[step.state] }}
            >
              {step.label}
            </div>
          ))}
        </div>

        <div className="info" style={styles.info}>
          <h2>Deployment Link</h2>
          <div className="url" style={styles.url}>
            <span>{deploymentUrl}</span>
            <button
              type="button"
              className="button-primary"
              style={{
                ...styles.button,
                ...styles.buttonPrimary,
                padding: '8px 16px',
                fontSize: '14px',
              }}
              onClick={handleCopy}
            >
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <div className="qr-code" style={styles.qrCode}>QR Code</div>
          <button
            type="button"
            className="button-secondary"
            style={{ ...styles.button, ...styles.buttonSecondary }}
            onClick={() => onDeployToAndroid && onDeployToAndroid()}
          >
            Deploy to Android
          </button>
        </div>
      </div>
    </div>
  );
}

Deployment.propTypes = {
  logoText: PropTypes.string,
  tokenText: PropTypes.string,
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      state: PropTypes.oneOf(['completed', 'current', 'upcoming']).isRequired,
    })
  ),
  deploymentUrl: PropTypes.string,
  onDeployToAndroid: PropTypes.func,
};

Deployment.defaultProps = {
  logoText: 'Bolt AI',
  tokenText: '200,000 tokens',
  steps: [
    { label: '✓', state: 'completed' },
    { label: '✓', state: 'completed' },
    { label: '3', state: 'current' },
    { label: '4', state: 'upcoming' },
  ],
  deploymentUrl: 'https://myapp.netlify.app',
  onDeployToAndroid: null,
};

export default Deployment;

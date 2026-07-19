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
    padding: '0 32px',
    boxSizing: 'border-box',
  },
  logo: {
    fontSize: '18px',
    fontWeight: 'bold',
  },
  tokenIndicator: {
    fontSize: '16px',
    color: colors.secondary,
  },
  userAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: colors.secondary,
  },
  errorBanner: {
    backgroundColor: '#FFE5E5',
    color: colors.rausch,
    padding: '16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '14px',
    fontWeight: 'bold',
  },
  errorBannerButton: {
    background: 'none',
    border: 'none',
    color: colors.rausch,
    fontSize: '16px',
    cursor: 'pointer',
  },
  topBar: {
    backgroundColor: colors.white,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 32px',
    borderBottom: `1px solid ${colors.border}`,
  },
  appName: {
    fontSize: '18px',
    fontWeight: 'bold',
  },
  tokenProgress: {
    fontSize: '14px',
    color: colors.secondary,
  },
  deployButton: {
    backgroundColor: colors.rausch,
    color: colors.white,
    padding: '14px 24px',
    fontWeight: 600,
    fontSize: '15px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  content: {
    display: 'flex',
    height: 'calc(100vh - 160px)',
  },
  aiConversation: {
    width: '50%',
    backgroundColor: colors.white,
    overflowY: 'auto',
    padding: '32px',
    boxSizing: 'border-box',
  },
  aiMessage: {
    marginBottom: '16px',
    padding: '16px',
    borderRadius: '12px',
    fontSize: '14px',
    backgroundColor: colors.background,
    color: colors.dark,
  },
  userMessage: {
    marginBottom: '16px',
    padding: '16px',
    borderRadius: '12px',
    fontSize: '14px',
    backgroundColor: colors.rausch,
    color: colors.white,
    textAlign: 'right',
  },
  appPreview: {
    width: '50%',
    backgroundColor: colors.background,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  appIframe: {
    width: '80%',
    height: '80%',
    backgroundColor: '#e0e0e0',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    color: colors.secondary,
  },
};

function Builder({ logoText, tokenText, appName, errorMessage, messages, onDeploy }) {
  const [showErrorBanner, setShowErrorBanner] = useState(true);

  return (
    <div style={styles.page}>
      <div className="navbar" style={styles.navbar}>
        <div className="logo" style={styles.logo}>{logoText}</div>
        <div className="token-indicator" style={styles.tokenIndicator}>{tokenText}</div>
        <div className="user-avatar" style={styles.userAvatar} />
      </div>

      {showErrorBanner && (
        <div className="error-banner" style={styles.errorBanner}>
          {errorMessage}
          <button
            type="button"
            style={styles.errorBannerButton}
            onClick={() => setShowErrorBanner(false)}
          >
            ✕
          </button>
        </div>
      )}

      <div className="top-bar" style={styles.topBar}>
        <div className="app-name" style={styles.appName}>{appName}</div>
        <div className="token-progress" style={styles.tokenProgress}>{tokenText}</div>
        <button
          type="button"
          className="deploy-button"
          style={styles.deployButton}
          onClick={() => onDeploy && onDeploy()}
        >
          Deploy
        </button>
      </div>

      <div className="content" style={styles.content}>
        <div className="ai-conversation" style={styles.aiConversation}>
          {messages.map((message, index) => (
            <div
              key={index}
              className={message.sender === 'user' ? 'user-message' : 'ai-message'}
              style={message.sender === 'user' ? styles.userMessage : styles.aiMessage}
            >
              {message.text}
            </div>
          ))}
        </div>
        <div className="app-preview" style={styles.appPreview}>
          <div className="app-iframe" style={styles.appIframe}>App Preview</div>
        </div>
      </div>
    </div>
  );
}

Builder.propTypes = {
  logoText: PropTypes.string,
  tokenText: PropTypes.string,
  appName: PropTypes.string,
  errorMessage: PropTypes.string,
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      sender: PropTypes.oneOf(['ai', 'user']).isRequired,
      text: PropTypes.string.isRequired,
    })
  ),
  onDeploy: PropTypes.func,
};

Builder.defaultProps = {
  logoText: 'Bolt AI',
  tokenText: '45,230 / 200,000 tokens',
  appName: 'My App Name',
  errorMessage: '⚠ Build error detected — Click to auto-fix',
  messages: [
    { sender: 'ai', text: 'What features do you want in your app?' },
    { sender: 'user', text: 'I need a login page and a dashboard for Analytics.' },
    { sender: 'ai', text: "Got it! I'll build a dashboard and login page for you." },
    { sender: 'user', text: 'Can you integrate Google OAuth for the login?' },
    { sender: 'ai', text: "Sure! I'm adding Google OAuth integration now." },
  ],
  onDeploy: null,
};

export default Builder;

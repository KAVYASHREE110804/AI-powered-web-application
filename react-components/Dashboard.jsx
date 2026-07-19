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
    background: colors.white,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 24px',
    borderBottom: `1px solid ${colors.border}`,
  },
  logo: {
    fontWeight: 'bold',
    fontSize: '20px',
    color: colors.dark,
  },
  tokens: {
    fontWeight: 600,
    fontSize: '16px',
    color: colors.secondary,
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: colors.secondary,
  },
  mainContainer: {
    display: 'flex',
  },
  sidebar: {
    width: '240px',
    background: colors.white,
    padding: '32px 16px',
    borderRight: `1px solid ${colors.border}`,
    boxSizing: 'border-box',
  },
  sidebarList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  sidebarItem: {
    marginBottom: '16px',
  },
  sidebarLink: {
    textDecoration: 'none',
    color: colors.dark,
    fontWeight: 600,
    fontSize: '16px',
  },
  dashboardContent: {
    flex: 1,
    padding: '32px',
  },
  heading: {
    fontSize: '24px',
    marginBottom: '16px',
  },
  promptContainer: {
    textAlign: 'center',
    marginBottom: '32px',
  },
  promptTextarea: {
    width: '100%',
    maxWidth: '600px',
    height: '120px',
    border: `1px solid ${colors.border}`,
    borderRadius: '12px',
    padding: '16px',
    fontSize: '16px',
    resize: 'none',
    fontFamily: 'inherit',
  },
  promptButton: {
    marginTop: '16px',
    padding: '14px 24px',
    background: colors.rausch,
    color: colors.white,
    border: 'none',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: 600,
    cursor: 'pointer',
  },
  projectsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '24px',
  },
  projectCard: {
    background: colors.white,
    padding: '16px',
    border: `1px solid ${colors.border}`,
    borderRadius: '12px',
    boxShadow:
      '0 1px 2px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(0, 0, 0, 0.05)',
  },
  projectTitle: {
    fontSize: '18px',
    margin: '0 0 8px',
  },
  status: {
    display: 'inline-block',
    borderRadius: '20px',
    padding: '4px 12px',
    fontSize: '14px',
    color: colors.white,
    fontWeight: 600,
  },
  info: {
    marginBottom: '16px',
    fontSize: '14px',
    color: colors.secondary,
  },
  openButton: {
    padding: '14px 24px',
    background: colors.rausch,
    color: colors.white,
    border: 'none',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: 600,
    cursor: 'pointer',
    width: '100%',
  },
};

const statusBackgrounds = {
  deployed: colors.babu,
  building: colors.arches,
  error: colors.rausch,
};

function Dashboard({ logoText, tokenText, navItems, projects, onSubmit, onOpenProject }) {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(prompt);
    }
  };

  return (
    <div style={styles.page}>
      <div className="navbar" style={styles.navbar}>
        <div className="logo" style={styles.logo}>{logoText}</div>
        <div className="tokens" style={styles.tokens}>{tokenText}</div>
        <div className="avatar" style={styles.avatar} />
      </div>

      <div className="main-container" style={styles.mainContainer}>
        <div className="sidebar" style={styles.sidebar}>
          <ul style={styles.sidebarList}>
            {navItems.map((item) => (
              <li key={item} style={styles.sidebarItem}>
                <a href="#" style={styles.sidebarLink}>{item}</a>
              </li>
            ))}
          </ul>
        </div>

        <div className="dashboard-content" style={styles.dashboardContent}>
          <div className="prompt-container" style={styles.promptContainer}>
            <textarea
              placeholder="Describe the app you want to build..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              style={styles.promptTextarea}
            />
            <button type="button" onClick={handleSubmit} style={styles.promptButton}>
              Submit
            </button>
          </div>

          <h1 style={styles.heading}>Your Projects</h1>

          <div className="projects-grid" style={styles.projectsGrid}>
            {projects.map((project) => (
              <div key={project.name} className="project-card" style={styles.projectCard}>
                <h3 style={styles.projectTitle}>{project.name}</h3>
                <span
                  className={`status ${project.status}`}
                  style={{
                    ...styles.status,
                    background: statusBackgrounds[project.status],
                  }}
                >
                  {project.statusLabel}
                </span>
                <div className="info" style={styles.info}>
                  Last modified: {project.lastModified}
                </div>
                <button
                  type="button"
                  style={styles.openButton}
                  onClick={() => onOpenProject && onOpenProject(project)}
                >
                  Open
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

Dashboard.propTypes = {
  logoText: PropTypes.string,
  tokenText: PropTypes.string,
  navItems: PropTypes.arrayOf(PropTypes.string),
  projects: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      status: PropTypes.oneOf(['deployed', 'building', 'error']).isRequired,
      statusLabel: PropTypes.string.isRequired,
      lastModified: PropTypes.string.isRequired,
    })
  ),
  onSubmit: PropTypes.func,
  onOpenProject: PropTypes.func,
};

Dashboard.defaultProps = {
  logoText: 'Bolt AI',
  tokenText: '200,000 tokens',
  navItems: ['Home', 'My Projects', 'Netlify', 'Supabase', 'Settings ⚙'],
  projects: [
    {
      name: 'My First App',
      status: 'deployed',
      statusLabel: '✓ Deployed',
      lastModified: '10/03/2023',
    },
    {
      name: 'CRM Tool',
      status: 'building',
      statusLabel: '◉ Building',
      lastModified: '09/29/2023',
    },
    {
      name: 'Portfolio Website',
      status: 'error',
      statusLabel: '✕ Error',
      lastModified: '09/25/2023',
    },
  ],
  onSubmit: null,
  onOpenProject: null,
};

export default Dashboard;

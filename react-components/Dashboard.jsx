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
    gap: '16px',
  },
  logo: {
    fontWeight: 'bold',
    fontSize: '20px',
    color: colors.dark,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontFamily: 'inherit',
    padding: 0,
  },
  tokens: {
    fontWeight: 600,
    fontSize: '16px',
    color: colors.secondary,
  },
  navRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  navLink: {
    textDecoration: 'none',
    color: colors.dark,
    fontWeight: 600,
    fontSize: '16px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontFamily: 'inherit',
    padding: 0,
  },
  profileWrap: {
    position: 'relative',
  },
  avatarButton: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: colors.secondary,
    border: 'none',
    cursor: 'pointer',
    padding: 0,
  },
  profileDropdown: {
    position: 'absolute',
    top: '48px',
    right: 0,
    background: colors.white,
    border: `1px solid ${colors.border}`,
    borderRadius: '12px',
    boxShadow:
      '0 1px 2px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(0, 0, 0, 0.05)',
    padding: '8px 0',
    minWidth: '160px',
    zIndex: 10,
  },
  dropdownItem: {
    display: 'block',
    width: '100%',
    textAlign: 'left',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontWeight: 600,
    fontSize: '16px',
    color: colors.dark,
    padding: '8px 16px',
  },
  dashboardContent: {
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
  filterTabs: {
    display: 'flex',
    gap: '24px',
    borderBottom: `1px solid ${colors.border}`,
    marginBottom: '24px',
  },
  filterTab: (active) => ({
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontSize: '16px',
    fontWeight: 600,
    color: active ? colors.dark : colors.secondary,
    padding: '0 0 12px',
    borderBottom: active
      ? `2px solid ${colors.rausch}`
      : '2px solid transparent',
  }),
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

function Dashboard({
  logoText,
  tokenText,
  navLinks,
  filterTabs,
  projects,
  onSubmit,
  onOpenProject,
}) {
  const [prompt, setPrompt] = useState('');
  const [activeFilterTab, setActiveFilterTab] = useState(filterTabs[0]);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(prompt);
    }
  };

  return (
    <div style={styles.page}>
      <div className="navbar" style={styles.navbar}>
        <button type="button" className="logo" style={styles.logo}>
          {logoText}
        </button>
        <div className="tokens" style={styles.tokens}>{tokenText}</div>
        <div className="nav-right" style={styles.navRight}>
          {navLinks.map((link) => (
            <button key={link} type="button" style={styles.navLink}>
              {link}
            </button>
          ))}
          <div style={styles.profileWrap}>
            <button
              type="button"
              className="avatar"
              style={styles.avatarButton}
              onClick={() => setProfileMenuOpen((open) => !open)}
            />
            {profileMenuOpen && (
              <div className="profile-dropdown" style={styles.profileDropdown}>
                <button type="button" style={styles.dropdownItem}>
                  Settings ⚙
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="dashboard-content" style={styles.dashboardContent}>
        <div className="prompt-container" style={styles.promptContainer}>
          <textarea
            placeholder="Describe the app you want to build..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            style={styles.promptTextarea}
          />
          <div>
            <button type="button" onClick={handleSubmit} style={styles.promptButton}>
              Submit
            </button>
          </div>
        </div>

        <h1 style={styles.heading}>Your Projects</h1>

        <div className="filter-tabs" style={styles.filterTabs}>
          {filterTabs.map((tab) => (
            <button
              key={tab}
              type="button"
              style={styles.filterTab(tab === activeFilterTab)}
              onClick={() => setActiveFilterTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

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
  );
}

Dashboard.propTypes = {
  logoText: PropTypes.string,
  tokenText: PropTypes.string,
  navLinks: PropTypes.arrayOf(PropTypes.string),
  filterTabs: PropTypes.arrayOf(PropTypes.string),
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
  navLinks: ['Netlify', 'Supabase'],
  filterTabs: ['My Projects'],
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

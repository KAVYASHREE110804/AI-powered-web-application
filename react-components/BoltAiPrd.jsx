import React, { useState } from 'react';
import PropTypes from 'prop-types';

const COLORS = {
  rausch: '#FF385C',
  dark: '#222222',
  secondary: '#717171',
  babu: '#00A699',
  arches: '#FFB400',
  border: '#DDDDDD',
  hoverGray: '#F7F7F7',
  white: '#FFFFFF',
};

const FONT_FAMILY =
  "'Circular', -apple-system, BlinkMacSystemFont, 'Roboto', sans-serif";

const styles = {
  page: {
    margin: 0,
    fontFamily: FONT_FAMILY,
    backgroundColor: COLORS.white,
    color: COLORS.dark,
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  navbar: {
    position: 'sticky',
    top: 0,
    zIndex: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '16px',
    padding: '16px 40px',
    backgroundColor: COLORS.white,
    borderBottom: `1px solid ${COLORS.border}`,
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: COLORS.rausch,
    fontWeight: 700,
    fontSize: '22px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontFamily: FONT_FAMILY,
    padding: 0,
  },
  searchPill: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    border: `1px solid ${COLORS.border}`,
    borderRadius: '24px',
    padding: '8px 8px 8px 24px',
    backgroundColor: COLORS.white,
    boxShadow: '0 2px 16px rgba(0,0,0,0.12)',
    minWidth: '320px',
  },
  searchInput: {
    border: 'none',
    outline: 'none',
    fontSize: '14px',
    fontWeight: 500,
    color: COLORS.dark,
    fontFamily: FONT_FAMILY,
    background: 'transparent',
    flex: 1,
  },
  searchButton: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: COLORS.rausch,
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  navRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  navLink: {
    fontSize: '14px',
    fontWeight: 500,
    color: COLORS.dark,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontFamily: FONT_FAMILY,
    padding: '8px 16px',
    borderRadius: '24px',
  },
  profileMenu: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    border: `1px solid ${COLORS.border}`,
    borderRadius: '24px',
    padding: '8px 8px 8px 16px',
    backgroundColor: COLORS.white,
    cursor: 'pointer',
  },
  profileCircle: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: COLORS.secondary,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabsBar: {
    display: 'flex',
    justifyContent: 'center',
    gap: '32px',
    padding: '16px 40px 0',
    borderBottom: `1px solid ${COLORS.border}`,
  },
  tab: (active) => ({
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontFamily: FONT_FAMILY,
    fontSize: '14px',
    fontWeight: active ? 600 : 400,
    color: active ? COLORS.dark : COLORS.secondary,
    padding: '0 0 16px',
    borderBottom: active
      ? `2px solid ${COLORS.dark}`
      : '2px solid transparent',
  }),
  header: {
    padding: '32px 40px 0',
  },
  headerTitle: {
    fontSize: '26px',
    fontWeight: 700,
    color: COLORS.dark,
    margin: '0 0 8px',
  },
  headerOverview: {
    fontSize: '14px',
    fontWeight: 400,
    color: COLORS.secondary,
    margin: 0,
    maxWidth: '720px',
    lineHeight: 1.5,
  },
  gridSection: {
    padding: '24px 40px 48px',
    flex: 1,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: '24px',
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    cursor: 'pointer',
  },
  cardImage: {
    position: 'relative',
    width: '100%',
    aspectRatio: 1,
    backgroundColor: COLORS.hoverGray,
    border: `1px solid ${COLORS.border}`,
    borderRadius: '12px',
    boxSizing: 'border-box',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardImageLabel: {
    fontSize: '14px',
    fontWeight: 500,
    color: COLORS.secondary,
  },
  heartButton: {
    position: 'absolute',
    top: '8px',
    right: '8px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitleRow: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: '8px',
  },
  cardTitle: {
    fontSize: '15px',
    fontWeight: 600,
    color: COLORS.dark,
    margin: 0,
  },
  cardRating: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '14px',
    fontWeight: 400,
    color: COLORS.dark,
    flexShrink: 0,
  },
  cardDescription: {
    fontSize: '14px',
    fontWeight: 400,
    color: COLORS.secondary,
    margin: 0,
    lineHeight: 1.4,
  },
  cardMeta: {
    fontSize: '14px',
    fontWeight: 700,
    color: COLORS.dark,
    margin: 0,
  },
  footer: {
    borderTop: `1px solid ${COLORS.border}`,
    backgroundColor: COLORS.hoverGray,
    padding: '24px 40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '16px',
  },
  footerText: {
    fontSize: '14px',
    fontWeight: 400,
    color: COLORS.secondary,
  },
  footerLinks: {
    display: 'flex',
    gap: '24px',
    flexWrap: 'wrap',
  },
  footerLink: {
    fontSize: '14px',
    fontWeight: 400,
    color: COLORS.secondary,
    textDecoration: 'none',
  },
};

const TABS = [
  { id: 'features', label: 'Key Features' },
  { id: 'stories', label: 'User Stories' },
  { id: 'scenarios', label: 'Business Scenarios' },
  { id: 'roles', label: 'User Roles' },
  { id: 'specs', label: 'Tech Specs' },
];

const LISTINGS = [
  {
    id: 'feature-1',
    category: 'features',
    title: 'No-Code App Development',
    description: 'Users can create applications without writing any code.',
    tag: 'Observed',
    meta: 'Build apps in 10–12 minutes',
  },
  {
    id: 'feature-2',
    category: 'features',
    title: 'Third-Party Integrations',
    description:
      'Integrates with tools like Netlify and Supabase for backend and database functionalities.',
    tag: 'Observed',
    meta: 'Netlify + Supabase',
  },
  {
    id: 'feature-3',
    category: 'features',
    title: 'User Authentication & Registration',
    description:
      'Supports creating login and signup pages with authentication and database connections.',
    tag: 'Observed',
    meta: 'Connect to Supabase',
  },
  {
    id: 'feature-4',
    category: 'features',
    title: 'Pre-Built Templates',
    description:
      'Likely provides pre-built templates for faster app creation, as users can create apps within 10–12 minutes.',
    tag: 'Inferred',
    meta: 'Faster app creation',
  },
  {
    id: 'feature-5',
    category: 'features',
    title: 'Hosting Capabilities',
    description: 'Allows users to host up to 10 applications for free.',
    tag: 'Observed',
    meta: '10 free apps',
  },
  {
    id: 'feature-6',
    category: 'features',
    title: 'AI-Powered Features',
    description: 'Uses AI to assist in app creation and development.',
    tag: 'Observed',
    meta: 'AI-assisted builds',
  },
  {
    id: 'story-1',
    category: 'stories',
    title: 'Small Business Owner',
    description:
      'I want to create a functional app for my business within 10 minutes without coding knowledge so that I can save time and resources.',
    tag: 'Inferred',
    meta: 'User Story',
  },
  {
    id: 'story-2',
    category: 'stories',
    title: 'Developer',
    description:
      'I want to integrate my app with a backend and database using Supabase and Netlify so that I can manage data and hosting efficiently.',
    tag: 'Inferred',
    meta: 'User Story',
  },
  {
    id: 'story-3',
    category: 'stories',
    title: 'Non-Technical User',
    description:
      'I want to use pre-built templates to create an app quickly and easily.',
    tag: 'Inferred',
    meta: 'User Story',
  },
  {
    id: 'story-4',
    category: 'stories',
    title: 'Entrepreneur',
    description:
      'I want to create a prototype app to test my business idea before investing in full-scale development.',
    tag: 'Inferred',
    meta: 'User Story',
  },
  {
    id: 'scenario-1',
    category: 'scenarios',
    title: 'Rapid Prototyping',
    description:
      'Businesses or individuals can quickly create prototypes of applications for testing and validation purposes.',
    tag: 'Inferred',
    meta: 'Business Scenario',
  },
  {
    id: 'scenario-2',
    category: 'scenarios',
    title: 'Cost-Effective Development',
    description:
      'Small businesses or startups with limited budgets can use Bolt AI to create applications without hiring developers.',
    tag: 'Inferred',
    meta: 'Business Scenario',
  },
  {
    id: 'scenario-3',
    category: 'scenarios',
    title: 'Time-Sensitive Projects',
    description:
      'Organizations can use Bolt AI to meet tight deadlines for application development.',
    tag: 'Inferred',
    meta: 'Business Scenario',
  },
  {
    id: 'scenario-4',
    category: 'scenarios',
    title: 'Non-Technical Users',
    description:
      'Entrepreneurs or individuals with no coding knowledge can create applications for personal or business use.',
    tag: 'Inferred',
    meta: 'Business Scenario',
  },
  {
    id: 'role-1',
    category: 'roles',
    title: 'Developers',
    description:
      'Users who can integrate the backend and database using tools like Supabase and Netlify.',
    tag: 'Observed',
    meta: 'User Role',
  },
  {
    id: 'role-2',
    category: 'roles',
    title: 'Entrepreneurs',
    description:
      'Individuals looking to create applications for business purposes without coding knowledge.',
    tag: 'Inferred',
    meta: 'User Role',
  },
  {
    id: 'role-3',
    category: 'roles',
    title: 'Small Business Owners',
    description: 'Users who need cost-effective solutions for app development.',
    tag: 'Inferred',
    meta: 'User Role',
  },
  {
    id: 'role-4',
    category: 'roles',
    title: 'Hobbyists',
    description:
      'Non-technical users creating apps for personal projects or experimentation.',
    tag: 'Inferred',
    meta: 'User Role',
  },
  {
    id: 'spec-1',
    category: 'specs',
    title: 'No-Code Interface',
    description: 'The platform allows users to create apps without writing code.',
    tag: 'Observed',
    meta: 'Tech Spec',
  },
  {
    id: 'spec-2',
    category: 'specs',
    title: 'Third-Party Integrations',
    description:
      'Integrates with Netlify for hosting and Supabase for backend and database functionalities.',
    tag: 'Observed',
    meta: 'Netlify + Supabase',
  },
  {
    id: 'spec-3',
    category: 'specs',
    title: 'Authentication & User Management',
    description:
      'Supports login, signup, and authentication features integrated with a database.',
    tag: 'Observed',
    meta: 'Tech Spec',
  },
  {
    id: 'spec-4',
    category: 'specs',
    title: 'Hosting Capabilities',
    description: 'Users can host up to 10 applications for free.',
    tag: 'Observed',
    meta: '10 free apps',
  },
  {
    id: 'spec-5',
    category: 'specs',
    title: 'AI Assistance',
    description: 'AI is used to streamline the app creation process.',
    tag: 'Observed',
    meta: 'Tech Spec',
  },
  {
    id: 'spec-6',
    category: 'specs',
    title: 'Cost Structure',
    description:
      'Free accounts are available, and premium plans start at $99.',
    tag: 'Observed',
    meta: '$99 premium',
  },
  {
    id: 'spec-7',
    category: 'specs',
    title: 'Deployment',
    description: 'Apps can be deployed directly to platforms like Netlify.',
    tag: 'Observed',
    meta: 'Deploy to Netlify',
  },
  {
    id: 'spec-8',
    category: 'specs',
    title: 'Token System',
    description:
      'Users are provided with free tokens (200K tokens per account) for app creation.',
    tag: 'Observed',
    meta: '200K tokens free',
  },
];

const PRODUCT_NAME = 'Bolt AI';

const PRODUCT_OVERVIEW =
  'Bolt AI is a no-code platform that enables users to create and deploy functional applications within 10-12 minutes. It integrates with tools like Netlify and Supabase to handle backend and database functionalities. The platform is designed to simplify app development for users without coding knowledge.';

const FOOTER_LINKS = [
  'Product Overview',
  'Business Scenarios',
  'User Roles',
  'Key Features',
  'User Stories',
  'Technical Specifications',
];

function StarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill={COLORS.arches}>
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  );
}

function HeartIcon({ filled }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill={filled ? COLORS.rausch : COLORS.white}
      stroke={filled ? COLORS.rausch : COLORS.dark}
      strokeWidth="2"
    >
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );
}

HeartIcon.propTypes = {
  filled: PropTypes.bool.isRequired,
};

function ListingCard({ listing, favorited, onToggleFavorite }) {
  return (
    <div style={styles.card}>
      <div style={styles.cardImage}>
        <span style={styles.cardImageLabel}>{listing.title}</span>
        <button
          type="button"
          style={styles.heartButton}
          onClick={() => onToggleFavorite(listing.id)}
        >
          <HeartIcon filled={favorited} />
        </button>
      </div>
      <div style={styles.cardTitleRow}>
        <h3 style={styles.cardTitle}>{listing.title}</h3>
        <div style={styles.cardRating}>
          <StarIcon />
          {listing.tag}
        </div>
      </div>
      <p style={styles.cardDescription}>{listing.description}</p>
      <p style={styles.cardMeta}>{listing.meta}</p>
    </div>
  );
}

ListingCard.propTypes = {
  listing: PropTypes.shape({
    id: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    tag: PropTypes.oneOf(['Observed', 'Inferred']).isRequired,
    meta: PropTypes.string.isRequired,
  }).isRequired,
  favorited: PropTypes.bool.isRequired,
  onToggleFavorite: PropTypes.func.isRequired,
};

function BoltAiPrd({ productName, productOverview, tabs, listings, footerLinks }) {
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const [favorites, setFavorites] = useState({});
  const [searchQuery, setSearchQuery] = useState('');

  const toggleFavorite = (id) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const visibleListings = listings.filter(
    (listing) =>
      listing.category === activeTab &&
      (searchQuery.trim() === '' ||
        listing.title.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
        listing.description
          .toLowerCase()
          .includes(searchQuery.trim().toLowerCase()))
  );

  return (
    <div style={styles.page}>
      <nav style={styles.navbar}>
        <button type="button" style={styles.logo}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill={COLORS.rausch}>
            <path d="M13 2L4.5 13.5H11l-1.5 8.5L18 10.5h-6.5L13 2z" />
          </svg>
          {productName}
        </button>

        <div style={styles.searchPill}>
          <input
            style={styles.searchInput}
            placeholder="Search the PRD"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="button" style={styles.searchButton}>
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke={COLORS.white}
              strokeWidth="3"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
        </div>

        <div style={styles.navRight}>
          <button type="button" style={styles.navLink}>
            Become a host
          </button>
          <button type="button" style={styles.navLink}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke={COLORS.dark}
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
          </button>
          <div style={styles.profileMenu}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke={COLORS.dark}
              strokeWidth="3"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
            <div style={styles.profileCircle}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill={COLORS.white}>
                <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z" />
              </svg>
            </div>
          </div>
        </div>
      </nav>

      <div style={styles.tabsBar}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            style={styles.tab(tab.id === activeTab)}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <header style={styles.header}>
        <h1 style={styles.headerTitle}>{productName}</h1>
        <p style={styles.headerOverview}>{productOverview}</p>
      </header>

      <section style={styles.gridSection}>
        <div style={styles.grid}>
          {visibleListings.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              favorited={Boolean(favorites[listing.id])}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      </section>

      <footer style={styles.footer}>
        <span style={styles.footerText}>
          {productName} — Product Requirements Document
        </span>
        <div style={styles.footerLinks}>
          {footerLinks.map((link) => (
            <a key={link} href="#" style={styles.footerLink}>
              {link}
            </a>
          ))}
        </div>
      </footer>
    </div>
  );
}

BoltAiPrd.propTypes = {
  productName: PropTypes.string,
  productOverview: PropTypes.string,
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ),
  listings: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      category: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      tag: PropTypes.oneOf(['Observed', 'Inferred']).isRequired,
      meta: PropTypes.string.isRequired,
    })
  ),
  footerLinks: PropTypes.arrayOf(PropTypes.string),
};

BoltAiPrd.defaultProps = {
  productName: PRODUCT_NAME,
  productOverview: PRODUCT_OVERVIEW,
  tabs: TABS,
  listings: LISTINGS,
  footerLinks: FOOTER_LINKS,
};

export default BoltAiPrd;

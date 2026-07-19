import React, { useState } from 'react';
import PropTypes from 'prop-types';

const colors = {
  rausch: '#FF385C',
  dark: '#222222',
  secondary: '#717171',
  babu: '#00A699',
  arches: '#FFB400',
  white: '#FFFFFF',
  border: '#DDDDDD',
  hoverGray: '#F7F7F7',
};

const fontFamily =
  "'Circular', -apple-system, BlinkMacSystemFont, 'Roboto', sans-serif";

const styles = {
  page: {
    margin: 0,
    fontFamily,
    backgroundColor: colors.white,
    color: colors.dark,
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  navbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 40px',
    borderBottom: `1px solid ${colors.border}`,
    backgroundColor: colors.white,
    gap: '16px',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: colors.rausch,
    fontWeight: 800,
    fontSize: '22px',
    textDecoration: 'none',
  },
  navSearch: {
    display: 'flex',
    alignItems: 'center',
    border: `1px solid ${colors.border}`,
    borderRadius: '24px',
    boxShadow: '0 2px 16px rgba(0,0,0,0.12)',
    padding: '8px 8px 8px 24px',
    gap: '16px',
    backgroundColor: colors.white,
  },
  navSearchSegment: {
    fontSize: '14px',
    fontWeight: 500,
    color: colors.dark,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontFamily,
    padding: 0,
  },
  navSearchDivider: {
    width: '1px',
    height: '24px',
    backgroundColor: colors.border,
  },
  navSearchGuests: {
    fontSize: '14px',
    fontWeight: 400,
    color: colors.secondary,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontFamily,
    padding: 0,
  },
  navSearchButton: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: colors.rausch,
    color: colors.white,
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
  },
  navRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  hostLink: {
    fontSize: '14px',
    fontWeight: 500,
    color: colors.dark,
    textDecoration: 'none',
    padding: '8px 16px',
    borderRadius: '24px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontFamily,
  },
  globeButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '8px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileMenu: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    border: `1px solid ${colors.border}`,
    borderRadius: '24px',
    padding: '8px 8px 8px 16px',
    background: colors.white,
    cursor: 'pointer',
  },
  profileCircle: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: colors.secondary,
    color: colors.white,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: 500,
  },
  hero: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '48px 40px 32px',
    gap: '24px',
  },
  tabs: {
    display: 'flex',
    gap: '32px',
  },
  tab: (active) => ({
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontFamily,
    fontSize: '16px',
    fontWeight: active ? 600 : 400,
    color: active ? colors.dark : colors.secondary,
    paddingBottom: '8px',
    borderBottom: active
      ? `2px solid ${colors.rausch}`
      : '2px solid transparent',
  }),
  heroSearch: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    maxWidth: '848px',
    border: `1px solid ${colors.border}`,
    borderRadius: '24px',
    boxShadow: '0 2px 16px rgba(0,0,0,0.12)',
    backgroundColor: colors.white,
    padding: '8px',
    gap: '8px',
  },
  heroField: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    padding: '8px 16px',
    borderRadius: '24px',
    minWidth: 0,
  },
  heroFieldLabel: {
    fontSize: '12px',
    fontWeight: 500,
    color: colors.dark,
  },
  heroFieldInput: {
    border: 'none',
    outline: 'none',
    fontSize: '14px',
    fontWeight: 400,
    color: colors.dark,
    fontFamily,
    background: 'transparent',
    width: '100%',
  },
  heroFieldDivider: {
    width: '1px',
    height: '32px',
    backgroundColor: colors.border,
  },
  heroSearchButton: {
    backgroundColor: colors.rausch,
    color: colors.white,
    border: 'none',
    borderRadius: '24px',
    padding: '16px 24px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily,
  },
  listingsSection: {
    padding: '32px 40px 48px',
    flex: 1,
  },
  listingsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '24px',
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  cardImage: {
    position: 'relative',
    width: '100%',
    paddingTop: '75%',
    backgroundColor: colors.border,
    borderRadius: '8px',
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
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '8px',
  },
  cardTitle: {
    fontSize: '16px',
    fontWeight: 600,
    color: colors.dark,
    margin: 0,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  cardRating: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '14px',
    fontWeight: 400,
    color: colors.dark,
    flexShrink: 0,
  },
  cardLocation: {
    fontSize: '14px',
    fontWeight: 400,
    color: colors.secondary,
    margin: 0,
  },
  cardPrice: {
    fontSize: '16px',
    fontWeight: 700,
    color: colors.dark,
    margin: 0,
  },
  cardPriceUnit: {
    fontWeight: 400,
  },
  footer: {
    borderTop: `1px solid ${colors.border}`,
    backgroundColor: colors.hoverGray,
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
    color: colors.secondary,
  },
  footerLinks: {
    display: 'flex',
    gap: '24px',
    flexWrap: 'wrap',
  },
  footerLink: {
    fontSize: '14px',
    fontWeight: 400,
    color: colors.secondary,
    textDecoration: 'none',
  },
};

function HeartIcon({ filled }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill={filled ? colors.rausch : 'rgba(0,0,0,0.5)'}
      stroke={colors.white}
      strokeWidth="2"
    >
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );
}

HeartIcon.propTypes = {
  filled: PropTypes.bool.isRequired,
};

function GlobeIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke={colors.dark}
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill={colors.arches}>
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  );
}

function AirbnbHome({ tabs, listings, footerLinks }) {
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [favorites, setFavorites] = useState({});
  const [location, setLocation] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('');

  const toggleFavorite = (id) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div style={styles.page}>
      <nav className="navbar" style={styles.navbar}>
        <a href="#" className="logo" style={styles.logo}>
          <svg width="30" height="30" viewBox="0 0 24 24" fill={colors.rausch}>
            <path d="M12 2c1.1 0 2 .6 2.6 1.7l6.6 12.9c.5 1 .8 1.8.8 2.7 0 1.5-1.2 2.7-2.7 2.7-1.2 0-2.3-.6-3.6-2-1.3 1.4-2.5 2-3.7 2s-2.4-.6-3.7-2c-1.3 1.4-2.4 2-3.6 2C3.2 22 2 20.8 2 19.3c0-.9.3-1.7.8-2.7L9.4 3.7C10 2.6 10.9 2 12 2zm0 6.5c-1.4 0-2.5 1.1-2.5 2.5 0 1.7 1.1 3.4 2.5 5 1.4-1.6 2.5-3.3 2.5-5 0-1.4-1.1-2.5-2.5-2.5z" />
          </svg>
          airbnb
        </a>

        <div className="nav-search" style={styles.navSearch}>
          <button type="button" style={styles.navSearchSegment}>
            Anywhere
          </button>
          <div style={styles.navSearchDivider} />
          <button type="button" style={styles.navSearchSegment}>
            Any week
          </button>
          <div style={styles.navSearchDivider} />
          <button type="button" style={styles.navSearchGuests}>
            Add guests
          </button>
          <button type="button" style={styles.navSearchButton}>
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke={colors.white}
              strokeWidth="3"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
        </div>

        <div className="nav-right" style={styles.navRight}>
          <button type="button" style={styles.hostLink}>
            Become a host
          </button>
          <button type="button" style={styles.globeButton}>
            <GlobeIcon />
          </button>
          <div className="profile-menu" style={styles.profileMenu}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke={colors.dark}
              strokeWidth="3"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
            <div style={styles.profileCircle}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill={colors.white}>
                <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z" />
              </svg>
            </div>
          </div>
        </div>
      </nav>

      <section className="hero" style={styles.hero}>
        <div className="tabs" style={styles.tabs}>
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              style={styles.tab(tab === activeTab)}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="hero-search" style={styles.heroSearch}>
          <div style={styles.heroField}>
            <span style={styles.heroFieldLabel}>Where</span>
            <input
              style={styles.heroFieldInput}
              placeholder="Search destinations"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <div style={styles.heroFieldDivider} />
          <div style={styles.heroField}>
            <span style={styles.heroFieldLabel}>Check in</span>
            <input
              style={styles.heroFieldInput}
              placeholder="Add dates"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
            />
          </div>
          <div style={styles.heroFieldDivider} />
          <div style={styles.heroField}>
            <span style={styles.heroFieldLabel}>Check out</span>
            <input
              style={styles.heroFieldInput}
              placeholder="Add dates"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
            />
          </div>
          <div style={styles.heroFieldDivider} />
          <div style={styles.heroField}>
            <span style={styles.heroFieldLabel}>Who</span>
            <input
              style={styles.heroFieldInput}
              placeholder="Add guests"
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
            />
          </div>
          <button type="button" style={styles.heroSearchButton}>
            Search
          </button>
        </div>
      </section>

      <section className="listings" style={styles.listingsSection}>
        <div className="listings-grid" style={styles.listingsGrid}>
          {listings.map((listing) => (
            <div key={listing.id} className="listing-card" style={styles.card}>
              <div style={styles.cardImage}>
                <button
                  type="button"
                  className="heart-button"
                  style={styles.heartButton}
                  onClick={() => toggleFavorite(listing.id)}
                >
                  <HeartIcon filled={Boolean(favorites[listing.id])} />
                </button>
              </div>
              <div style={styles.cardTitleRow}>
                <h3 style={styles.cardTitle}>{listing.title}</h3>
                <div style={styles.cardRating}>
                  <StarIcon />
                  {listing.rating}
                </div>
              </div>
              <p style={styles.cardLocation}>{listing.location}</p>
              <p style={styles.cardPrice}>
                ${listing.price} <span style={styles.cardPriceUnit}>night</span>
              </p>
            </div>
          ))}
        </div>
      </section>

      <footer className="footer" style={styles.footer}>
        <span style={styles.footerText}>© 2026 Airbnb, Inc.</span>
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

AirbnbHome.propTypes = {
  tabs: PropTypes.arrayOf(PropTypes.string),
  listings: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      title: PropTypes.string.isRequired,
      location: PropTypes.string.isRequired,
      rating: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      price: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
    })
  ),
  footerLinks: PropTypes.arrayOf(PropTypes.string),
};

AirbnbHome.defaultProps = {
  tabs: ['Stays', 'Experiences', 'Online Experiences'],
  listings: [
    {
      id: 1,
      title: 'Beachfront villa with pool',
      location: 'Goa, India',
      rating: '4.92',
      price: 240,
    },
    {
      id: 2,
      title: 'Cozy studio in the city center',
      location: 'Bengaluru, India',
      rating: '4.85',
      price: 85,
    },
    {
      id: 3,
      title: 'Mountain cabin with valley view',
      location: 'Manali, India',
      rating: '4.97',
      price: 130,
    },
    {
      id: 4,
      title: 'Modern loft near the waterfront',
      location: 'Mumbai, India',
      rating: '4.78',
      price: 175,
    },
    {
      id: 5,
      title: 'Heritage home with courtyard',
      location: 'Jaipur, India',
      rating: '4.9',
      price: 110,
    },
    {
      id: 6,
      title: 'Treehouse retreat in the forest',
      location: 'Wayanad, India',
      rating: '4.95',
      price: 150,
    },
  ],
  footerLinks: ['Privacy', 'Terms', 'Sitemap', 'Company details'],
};

export default AirbnbHome;

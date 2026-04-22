import React from 'react';
import { Link } from 'react-router-dom';
import { IMAGES } from '../../lib/constants';

const ArtistSection = ({ t }) => {
  return (
    <section className="mastermind-section">
      <div className="mastermind-inner">

        {/* ── LEFT: Content ── */}
        <div>
          {/* Eyebrow */}
          <div className="mastermind-eyebrow">
            <span className="mastermind-eyebrow-line"></span>
            <span className="mastermind-eyebrow-text">
              {t('landing', 'artistSectionLabel')}
            </span>
          </div>

          {/* Blockquote */}
          <div className="mastermind-quote">
            <p className="mastermind-quote-text">
              {t('landing', 'artistQuote')}
            </p>
          </div>

          {/* Bio */}
          <p className="mastermind-bio">
            {t('landing', 'artistBio')}
          </p>

          {/* CTA */}
          <Link to="/about" className="mastermind-cta">
            <span>{t('landing', 'artistCta')}</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* ── RIGHT: Cinematic Image ── */}
        <div className="mastermind-image-wrap">

          {/* Outer glow ring */}
          <div className="mastermind-glow-ring"></div>

          {/* Image container */}
          <div className="mastermind-image-container">
            <img
              src={IMAGES.ARTIST_AT_WORK}
              alt="Artist at work"
              loading="lazy"
            />

            {/* Gradient overlay */}
            <div className="mastermind-image-overlay"></div>

            {/* Decorative corner lines */}
            <div className="mastermind-corner mastermind-corner-tl"></div>
            <div className="mastermind-corner mastermind-corner-tr"></div>
            <div className="mastermind-corner mastermind-corner-bl"></div>
            <div className="mastermind-corner mastermind-corner-br"></div>

            {/* Floating signature badge */}
            <div className="mastermind-signature">
              <div className="mastermind-signature-avatar">CM</div>
              <div>
                <div className="mastermind-signature-name">Carmen</div>
                <div className="mastermind-signature-role">{t('landing', 'artistSectionLabel') || 'Visual Artist'}</div>
              </div>
              <div className="mastermind-status-dot"></div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default ArtistSection;

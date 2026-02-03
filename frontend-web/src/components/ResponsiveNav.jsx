import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ResponsiveNav({ title, links, onLogout, currentPath }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <nav style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '1rem 0' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 1rem' }}>
        {/* Desktop Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: '700', background: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {title}
          </div>

          {/* Desktop Menu */}
          <div style={{ display: 'none', gap: '2rem', alignItems: 'center' }} className="nav-desktop">
            {links.map((link) => (
              <a
                key={link.path}
                href={link.path}
                style={{
                  color: currentPath === link.path ? '#0ea5e9' : '#64748b',
                  textDecoration: 'none',
                  fontWeight: currentPath === link.path ? '600' : '400',
                  fontSize: '0.95rem',
                  transition: 'color 0.2s'
                }}
              >
                {link.label}
              </a>
            ))}
            <button
              onClick={handleLogout}
              style={{
                padding: '0.5rem 1.25rem',
                background: 'white',
                border: '1px solid #cbd5e1',
                color: '#64748b',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '500',
                fontSize: '0.95rem'
              }}
            >
              Đăng xuất
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0.5rem'
            }}
            className="nav-mobile"
          >
            <div style={{ width: '24px', height: '2px', background: '#0ea5e9', transition: 'all 0.3s' }}></div>
            <div style={{ width: '24px', height: '2px', background: '#0ea5e9', transition: 'all 0.3s' }}></div>
            <div style={{ width: '24px', height: '2px', background: '#0ea5e9', transition: 'all 0.3s' }}></div>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            marginTop: '1rem',
            paddingTop: '1rem',
            borderTop: '1px solid #e2e8f0'
          }}>
            {links.map((link) => (
              <a
                key={link.path}
                href={link.path}
                style={{
                  color: currentPath === link.path ? '#0ea5e9' : '#64748b',
                  textDecoration: 'none',
                  fontWeight: currentPath === link.path ? '600' : '400',
                  fontSize: '0.95rem',
                  padding: '0.5rem 0'
                }}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <button
              onClick={handleLogout}
              style={{
                padding: '0.75rem',
                background: 'white',
                border: '1px solid #cbd5e1',
                color: '#64748b',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '500',
                fontSize: '0.95rem',
                textAlign: 'left'
              }}
            >
              Đăng xuất
            </button>
          </div>
        )}
      </div>

      <style>{`
        @media (min-width: 1024px) {
          .nav-desktop {
            display: flex !important;
          }
          .nav-mobile {
            display: none !important;
          }
        }
      `}</style>
    </nav>
  );
}

export default ResponsiveNav;

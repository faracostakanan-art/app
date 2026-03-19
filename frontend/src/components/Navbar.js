import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { label: 'Accueil', href: '#accueil' },
  { label: 'Fonctionnalités', href: '#fonctionnalites' },
];

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      data-testid="navbar"
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 backdrop-blur-xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] border-b border-slate-100'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a
            href="#accueil"
            data-testid="navbar-logo"
            className="flex items-center gap-2.5 group"
          >
            <img
              src="https://customer-assets.emergentagent.com/job_code-web-dev/artifacts/67secxw0_IMG_0348.png"
              alt="Société Générale"
              className="h-10 w-auto transition-transform group-hover:scale-105"
            />
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                data-testid={`nav-link-${link.href.slice(1)}`}
                className="nav-link text-sm"
              >
                {link.label}
              </a>
            ))}
            <a
              href="/register"
              data-testid="nav-cta-button"
              className="btn-primary text-sm !py-2.5 !px-6"
            >
              Mettre à jour
            </a>
          </div>

          {/* Mobile Toggle */}
          <button
            data-testid="mobile-menu-toggle"
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div
            data-testid="mobile-menu"
            className="md:hidden pb-6 animate-fade-up"
          >
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  data-testid={`mobile-nav-link-${link.href.slice(1)}`}
                  className="py-3 px-4 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-[#0A0A0A] transition-colors font-medium text-sm"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <a
                href="/register"
                data-testid="mobile-cta-button"
                className="btn-primary mt-3 text-sm text-center"
                onClick={() => setMobileOpen(false)}
              >
                Mettre à jour
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

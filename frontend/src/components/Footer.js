import { Shield } from 'lucide-react';

const footerLinks = {
  Produit: ['Securipass', 'Application Mobile', 'Sécurité', 'Tarifs'],
  Ressources: ['Guide d\'utilisation', 'FAQ', 'Support', 'Documentation'],
  Légal: ['Mentions légales', 'Politique de confidentialité', 'CGU', 'Cookies'],
};

export const Footer = () => {
  return (
    <footer
      data-testid="footer"
      className="bg-[#0A0A0A] text-white pt-16 md:pt-20 pb-8"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-16 pb-12 border-b border-white/10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <a href="#accueil" className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 bg-[#E30613] rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <span className="font-extrabold text-white text-base tracking-tight" style={{ fontFamily: 'Chivo, sans-serif' }}>
                Société Générale
              </span>
            </a>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
              Votre solution d'authentification forte pour des transactions bancaires sécurisées.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4
                className="text-sm font-bold text-white mb-4 tracking-wide"
                style={{ fontFamily: 'Chivo, sans-serif' }}
              >
                {category}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#accueil"
                      data-testid={`footer-link-${link.toLowerCase().replace(/\s+/g, '-').replace(/['']/g, '')}`}
                      className="text-sm text-slate-400 hover:text-white transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8">
          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} Société Générale. Tous droits réservés.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-xs text-slate-500">Conforme DSP2</span>
            <span className="text-xs text-slate-500">ISO 27001</span>
            <span className="text-xs text-slate-500">PCI DSS</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

import { useEffect, useRef } from 'react';
import { ShieldCheck, Smartphone, Fingerprint, Bell, Wifi, KeyRound } from 'lucide-react';

const features = [
  {
    icon: ShieldCheck,
    title: 'Authentification Forte',
    description: 'Double vérification pour chaque opération sensible. Sécurisez vos paiements et virements avec une validation à deux facteurs.',
    accent: true,
  },
  {
    icon: Smartphone,
    title: 'Mobile First',
    description: 'Validez vos transactions directement depuis votre smartphone, où que vous soyez, à tout moment.',
    accent: false,
  },
  {
    icon: Fingerprint,
    title: 'Biométrie Avancée',
    description: 'Utilisez votre empreinte digitale ou la reconnaissance faciale pour une authentification rapide et sécurisée.',
    accent: false,
  },
  {
    icon: Bell,
    title: 'Notifications Temps Réel',
    description: 'Recevez une notification instantanée pour chaque demande de validation. Restez informé en permanence.',
    accent: false,
  },
  {
    icon: Wifi,
    title: 'Fonctionne Hors Ligne',
    description: 'Générez des codes de sécurité même sans connexion internet grâce à la technologie OTP intégrée.',
    accent: false,
  },
  {
    icon: KeyRound,
    title: 'Clé de Sécurité Unique',
    description: 'Chaque appareil dispose d\'une clé cryptographique unique, impossible à dupliquer ou à transférer.',
    accent: true,
  },
];

export const Features = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.05 }
    );
    const elements = sectionRef.current?.querySelectorAll('.reveal');
    elements?.forEach((el) => observer.observe(el));
    return () => elements?.forEach((el) => observer.unobserve(el));
  }, []);

  return (
    <section
      id="fonctionnalites"
      ref={sectionRef}
      data-testid="features-section"
      className="relative py-20 md:py-32 bg-[#F5F5F7]"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-20">
          <div className="reveal animate-fade-up">
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[#E30613]">
              Fonctionnalités
            </span>
          </div>
          <h2
            data-testid="features-title"
            className="reveal animate-fade-up animate-delay-100 text-3xl md:text-5xl font-bold tracking-tight text-[#0A0A0A] mt-4"
            style={{ fontFamily: 'Chivo, sans-serif' }}
          >
            Une sécurité pensée
            <br />
            pour votre quotidien
          </h2>
          <p className="reveal animate-fade-up animate-delay-200 mt-5 text-base md:text-lg text-slate-500 max-w-2xl mx-auto">
            Découvrez les fonctionnalités qui font de Securipass votre allié de confiance
            pour toutes vos opérations bancaires.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                data-testid={`feature-card-${idx}`}
                className={`reveal animate-fade-up animate-delay-${(idx + 1) * 100} feature-card rounded-2xl p-8 flex flex-col ${
                  feature.accent
                    ? 'bg-[#0A0A0A] text-white'
                    : 'bg-white border border-slate-100'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${
                    feature.accent
                      ? 'bg-[#E30613]'
                      : 'bg-[#E30613]/10'
                  }`}
                >
                  <Icon
                    className={`w-6 h-6 ${feature.accent ? 'text-white' : 'text-[#E30613]'}`}
                    strokeWidth={1.5}
                  />
                </div>
                <h3
                  className={`text-xl font-bold mb-3 ${
                    feature.accent ? 'text-white' : 'text-[#0A0A0A]'
                  }`}
                  style={{ fontFamily: 'Chivo, sans-serif' }}
                >
                  {feature.title}
                </h3>
                <p
                  className={`text-sm leading-relaxed ${
                    feature.accent ? 'text-slate-300' : 'text-slate-500'
                  }`}
                >
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

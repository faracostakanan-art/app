import { useEffect, useRef } from 'react';
import { Download, Smartphone, ScanFace, CheckCircle2 } from 'lucide-react';

const steps = [
  {
    icon: Download,
    number: '01',
    title: 'Téléchargez l\'application',
    description: 'Installez l\'application SG sur votre smartphone depuis l\'App Store ou Google Play.',
  },
  {
    icon: Smartphone,
    number: '02',
    title: 'Activez Securipass',
    description: 'Rendez-vous dans les paramètres de sécurité de votre espace client et activez Securipass en suivant les instructions.',
  },
  {
    icon: ScanFace,
    number: '03',
    title: 'Configurez la biométrie',
    description: 'Associez votre empreinte digitale ou la reconnaissance faciale pour une authentification rapide.',
  },
  {
    icon: CheckCircle2,
    number: '04',
    title: 'Validez en un geste',
    description: 'Lors de chaque opération sensible, une notification vous invite à confirmer. Un simple geste et c\'est validé.',
  },
];

export const HowItWorks = () => {
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
      id="comment-ca-marche"
      ref={sectionRef}
      data-testid="how-it-works-section"
      className="relative py-20 md:py-32 bg-white overflow-hidden"
    >
      {/* Background decoration */}
      <div className="red-glow top-1/2 -right-40 opacity-20" />

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-2 gap-16 items-start">
          {/* Left - Header */}
          <div className="md:sticky md:top-32">
            <div className="reveal animate-fade-up">
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[#E30613]">
                Comment ça marche
              </span>
            </div>
            <h2
              data-testid="how-it-works-title"
              className="reveal animate-fade-up animate-delay-100 text-3xl md:text-5xl font-bold tracking-tight text-[#0A0A0A] mt-4"
              style={{ fontFamily: 'Chivo, sans-serif' }}
            >
              Activez Securipass
              <br />
              en 4 étapes simples
            </h2>
            <p className="reveal animate-fade-up animate-delay-200 mt-5 text-base md:text-lg text-slate-500 max-w-md">
              Un processus rapide et guidé pour renforcer la sécurité
              de vos opérations bancaires.
            </p>
            <div className="reveal animate-fade-up animate-delay-300 mt-8">
              <a
                href="#accueil"
                data-testid="how-it-works-cta"
                className="btn-primary"
              >
                Commencer maintenant
              </a>
            </div>
          </div>

          {/* Right - Steps */}
          <div className="space-y-0">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isLast = idx === steps.length - 1;
              return (
                <div
                  key={step.number}
                  data-testid={`step-${idx}`}
                  className={`reveal animate-fade-up animate-delay-${(idx + 1) * 100} relative flex gap-6 ${
                    !isLast ? 'pb-12' : ''
                  }`}
                >
                  {/* Connector line */}
                  {!isLast && <div className="step-line" />}

                  {/* Step number circle */}
                  <div className="relative z-10 shrink-0">
                    <div className="w-12 h-12 rounded-full bg-[#E30613] flex items-center justify-center shadow-[0_4px_15px_rgba(227,6,19,0.25)]">
                      <Icon className="w-5 h-5 text-white" strokeWidth={2} />
                    </div>
                  </div>

                  {/* Step content */}
                  <div className="pt-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-bold text-[#E30613] tracking-wider">
                        ÉTAPE {step.number}
                      </span>
                    </div>
                    <h3
                      className="text-lg font-bold text-[#0A0A0A] mb-2"
                      style={{ fontFamily: 'Chivo, sans-serif' }}
                    >
                      {step.title}
                    </h3>
                    <p className="text-sm text-slate-500 leading-relaxed max-w-sm">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

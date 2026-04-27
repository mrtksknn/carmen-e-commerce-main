import React, { useState } from "react";
import emailjs from 'emailjs-com';
import { Mail, ShieldCheck, ArrowLeft } from "lucide-react";
import { useCustomToast } from "../components/ui/toast-context";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { useLanguage } from "../context/LanguageContext";

const SubscriptionArea = () => {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: Success
  const [generatedCode, setGeneratedCode] = useState("");
  const [enteredCode, setEnteredCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const toast = useCustomToast();

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleSendCode = async (e) => {
    e.preventDefault();

    if (!email) {
      return toast({ type: "error", message: t('subscription', 'emptyEmail') });
    }

    if (!validateEmail(email)) {
      return toast({ type: "error", message: t('subscription', 'invalidEmail') });
    }

    setIsLoading(true);

    try {
      const subscriberRef = collection(db, "subscribers");
      const q = query(subscriberRef, where("email", "==", email));
      const existing = await getDocs(q);

      if (!existing.empty) {
        toast({ type: "info", message: t('subscription', 'alreadySubscribed') });
        setIsLoading(false);
        return;
      }

      // Generate a 6-digit verification code
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedCode(code);
      setStep(2);

      // Send actual email via EmailJS
      await emailjs.send(
        'service_tb170xp',
        'template_n9ypwyo',
        {
          to_email: email,
          otp_code: code,
        },
        'HPGdH6pTAslP_R5k0'
      );

      toast({ type: "success", message: t('subscription', 'codeSent') });

    } catch (error) {
      console.error("Failed to process:", error);
      toast({ type: "error", message: t('subscription', 'genericError') });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();

    if (enteredCode !== generatedCode) {
      return toast({ type: "error", message: t('subscription', 'invalidCode') });
    }

    setIsLoading(true);

    try {
      const subscriberRef = collection(db, "subscribers");

      await addDoc(subscriberRef, {
        email,
        subscribedAt: serverTimestamp(),
      });

      toast({ type: "success", message: t('subscription', 'subscriptionSuccess') });

      // Go to success UI state (Step 3)
      setStep(3);
    } catch (error) {
      console.error("Subscription failed:", error);
      toast({ type: "error", message: t('subscription', 'saveError') });
    } finally {
      setIsLoading(false);
    }
  };

  const goBack = () => {
    setStep(1);
    setEnteredCode("");
    setGeneratedCode("");
  };

  return (
    <section className="py-24 bg-[#030303] relative z-20 overflow-hidden">
      {/* Subtle top separator */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-3xl h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>

      <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
        
        {/* Animated Icon */}
        <div className="flex justify-center mb-8">
          <div className="bg-[#a83229]/5 border border-[#a83229]/20 p-4 rounded-full backdrop-blur-sm">
            {step === 1 && <Mail className="h-6 w-6 text-[#a83229]" strokeWidth={1.5} />}
            {step === 2 && <ShieldCheck className="h-6 w-6 text-[#a83229]" strokeWidth={1.5} />}
            {step === 3 && <Mail className="h-6 w-6 text-green-500" strokeWidth={1.5} />}
          </div>
        </div>

        {/* Headings */}
        <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-light text-white mb-6 tracking-tight">
          {step === 1 && t('subscription', 'step1Title')}
          {step === 2 && t('subscription', 'step2Title')}
          {step === 3 && t('subscription', 'step3Title')}
        </h2>

        <p className="text-gray-400 font-light text-sm md:text-base mb-12 max-w-xl mx-auto leading-relaxed">
          {step === 1 && t('subscription', 'step1Desc')}
          {step === 2 && t('subscription', 'step2Desc')}
          {step === 3 && t('subscription', 'step3Desc')}
        </p>

        {/* Forms */}
        {step === 1 && (
          <form
            onSubmit={handleSendCode}
            className="flex flex-col sm:flex-row items-center gap-4 max-w-lg mx-auto w-full"
          >
            <input
              type="email"
              placeholder={t('subscription', 'emailPlaceholder')}
              aria-label="Email address for newsletter"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 h-14 w-full rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-white px-6 text-sm font-light placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-[#a83229] focus:border-[#a83229] disabled:opacity-50 transition-all"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto h-14 text-white bg-[#a83229] px-8 rounded-full text-xs font-bold tracking-widest uppercase hover:bg-white hover:text-[#a83229] transition-colors duration-500 flex items-center justify-center whitespace-nowrap"
            >
              {isLoading ? t('subscription', 'subscribing') : t('subscription', 'subscribeButton')}
            </button>
          </form>
        )}

        {step === 2 && (
          <form
            onSubmit={handleVerifyCode}
            className="flex flex-col gap-6 max-w-sm mx-auto w-full"
          >
            <input
              type="text"
              placeholder={t('subscription', 'codePlaceholder')}
              aria-label="Verification code"
              inputMode="numeric"
              value={enteredCode}
              onChange={(e) => setEnteredCode(e.target.value)}
              maxLength={6}
              className="flex h-14 w-full rounded-full text-center tracking-[0.5em] text-lg bg-white/5 backdrop-blur-md border border-white/10 text-white px-6 font-mono placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#a83229] focus:border-[#a83229] disabled:opacity-50 transition-all"
              disabled={isLoading}
            />

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={goBack}
                disabled={isLoading}
                className="flex flex-1 h-12 items-center justify-center gap-2 rounded-full border border-white/20 text-white/70 hover:text-white hover:border-white transition-all text-[10px] font-bold tracking-widest uppercase order-2 sm:order-1"
              >
                <ArrowLeft size={14} /> {t('subscription', 'editEmail')}
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex flex-1 h-12 items-center justify-center rounded-full bg-[#a83229] text-white hover:bg-white hover:text-[#a83229] transition-all text-[10px] font-bold tracking-widest uppercase order-1 sm:order-2"
              >
                {isLoading ? t('subscription', 'verifying') : t('subscription', 'verifyButton')}
              </button>
            </div>
          </form>
        )}

        {step === 3 && (
          <div className="flex justify-center mt-6 animate-fade-in">
            <div className="inline-flex items-center gap-3 bg-green-500/10 border border-green-500/20 text-green-400 px-6 py-3 rounded-full text-xs tracking-widest uppercase font-bold">
              <ShieldCheck size={18} /> {t('subscription', 'successBadge')}
            </div>
          </div>
        )}

        {/* Privacy Note */}
        <p className="text-xs mt-12 text-gray-600 font-light max-w-sm mx-auto">
          {t('subscription', 'privacyNote')}
        </p>

      </div>
    </section>
  );
};

export default SubscriptionArea;

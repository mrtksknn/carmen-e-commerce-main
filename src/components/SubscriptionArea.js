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
    <section className="py-12 bg-primary/5 border-y border-primary/20 relative z-20">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-primary/20 border border-primary/40 p-4 rounded-full shadow-[0_0_20px_rgba(120,34,34,0.3)]">
            {step === 1 && <Mail className="h-8 w-8 text-primary-light" />}
            {step === 2 && <ShieldCheck className="h-8 w-8 text-primary-light" />}
            {step === 3 && <Mail className="h-8 w-8 text-green-500" />}
          </div>
        </div>

        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          {step === 1 && t('subscription', 'step1Title')}
          {step === 2 && t('subscription', 'step2Title')}
          {step === 3 && t('subscription', 'step3Title')}
        </h2>

        <p className="text-lg mb-8 max-w-2xl mx-auto text-slate-400">
          {step === 1 && t('subscription', 'step1Desc')}
          {step === 2 && t('subscription', 'step2Desc')}
          {step === 3 && t('subscription', 'step3Desc')}
        </p>

        {step === 1 && (
          <form
            onSubmit={handleSendCode}
            className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto w-full px-2"
          >
            <input
              type="email"
              placeholder={t('subscription', 'emailPlaceholder')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex h-12 w-full rounded-full bg-[#0a0a0a] border border-primary/30 text-white px-6 py-2 text-base placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary disabled:opacity-50 transition-all"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="text-white bg-primary px-8 py-3 sm:py-2 rounded-full font-semibold hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all whitespace-nowrap"
            >
              {isLoading ? t('subscription', 'subscribing') : t('subscription', 'subscribeButton')}
            </button>
          </form>
        )}

        {step === 2 && (
          <form
            onSubmit={handleVerifyCode}
            className="flex flex-col gap-4 max-w-md mx-auto w-full px-2"
          >
            <div className="relative">
              <input
                type="text"
                placeholder={t('subscription', 'codePlaceholder')}
                inputMode="numeric"
                value={enteredCode}
                onChange={(e) => setEnteredCode(e.target.value)}
                maxLength={6}
                className="flex h-14 w-full rounded-full text-center tracking-[0.2em] sm:tracking-[0.5em] text-lg sm:text-xl bg-[#0a0a0a] border border-primary/30 text-white px-4 sm:px-6 py-2 placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary disabled:opacity-50 transition-all font-mono"
                disabled={isLoading}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-2">
              <button
                type="button"
                onClick={goBack}
                disabled={isLoading}
                className="flex items-center justify-center gap-2 text-gray-400 bg-transparent border border-gray-700 px-6 py-3 sm:py-3 rounded-full font-semibold hover:text-white hover:border-gray-500 transition-all flex-1 order-2 sm:order-1"
              >
                <ArrowLeft size={18} /> {t('subscription', 'editEmail')}
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="text-white bg-primary px-6 py-3 sm:py-3 rounded-full font-semibold hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all flex-1 order-1 sm:order-2"
              >
                {isLoading ? t('subscription', 'verifying') : t('subscription', 'verifyButton')}
              </button>
            </div>
          </form>
        )}

        {step === 3 && (
          <div className="flex justify-center mt-6 animate-fade-in">
            <div className="inline-flex items-center gap-3 bg-green-500/10 border border-green-500/20 text-green-400 px-6 py-3 rounded-full font-medium">
              <ShieldCheck size={20} /> {t('subscription', 'successBadge')}
            </div>
          </div>
        )}

        <p className="text-sm mt-10 text-slate-400">
          {t('subscription', 'privacyNote')}
        </p>
      </div>
    </section>
  );
};

export default SubscriptionArea;

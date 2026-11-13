import React, { useEffect, useState } from 'react';
import { Check, Send } from 'lucide-react';
import { subscribeToSiteSettings, saveSiteSettings } from '../../services/firebaseService';
import { sendTestInquiryEmail, sendTestReplyEmail, describeEmailError } from '../../services/inquiryService';
import { useCustomToast } from '../ui/toast-context';
import { Button, Field, inputClass, useAdminT } from './AdminUI';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Where new enquiries are emailed. Stored in settings/site so it can change without a redeploy. */
const SettingsPanel = () => {
  const at = useAdminT();
  const toast = useCustomToast();
  const [notifyEmail, setNotifyEmail] = useState('');
  const [saved, setSaved] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const unsub = subscribeToSiteSettings(
      (data) => {
        setSaved(data.notifyEmail || '');
        setNotifyEmail((current) => current || data.notifyEmail || '');
        setLoading(false);
      },
      () => setLoading(false)
    );
    return () => unsub();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const value = notifyEmail.trim();
    if (!EMAIL_RE.test(value)) {
      setError(at('notifyEmailInvalid'));
      return;
    }
    setError('');
    setIsSaving(true);
    try {
      await saveSiteSettings({ notifyEmail: value });
      toast({ type: 'success', message: at('settingsSaved') });
    } catch (err) {
      console.error('Saving settings failed:', err);
      toast({ type: 'error', message: at('settingsError') });
    } finally {
      setIsSaving(false);
    }
  };

  const unchanged = notifyEmail.trim() === saved;

  const [testing, setTesting] = useState(null);
  const [testResult, setTestResult] = useState(null);

  const runTest = async (kind) => {
    setTesting(kind);
    setTestResult(null);
    try {
      await (kind === 'inquiry' ? sendTestInquiryEmail(saved) : sendTestReplyEmail(saved));
      setTestResult({ ok: true, text: at('testSent', { email: saved }) });
    } catch (err) {
      console.error('Test email failed:', err);
      setTestResult({ ok: false, text: at('testFailed', { error: describeEmailError(err) }) });
    } finally {
      setTesting(null);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-6">
      <Field label={at('notifyEmailLabel')} htmlFor="notify-email">
        <input
          id="notify-email"
          type="email"
          autoComplete="email"
          value={notifyEmail}
          onChange={(e) => { setNotifyEmail(e.target.value); setError(''); }}
          placeholder="ornek@alanadi.com"
          className={inputClass}
          disabled={loading}
          aria-describedby="notify-email-help"
        />
      </Field>
      <p id="notify-email-help" className="-mt-3 text-[13px] text-white/45 leading-relaxed">
        {at('notifyEmailHelp')}
      </p>

      {!loading && !saved && (
        <p className="text-[13px] text-amber-200/90">{at('notifyEmailMissing')}</p>
      )}
      {error && <p role="alert" className="text-sm text-red-300">{error}</p>}

      <Button type="submit" variant="accent" icon={Check} loading={isSaving} disabled={loading || unchanged}>
        {at('saveSettings')}
      </Button>

      {/* Connection test: proves each EmailJS template is wired up, without touching real enquiries */}
      <div className="pt-8 mt-2 border-t border-white/10">
        <h3 className="text-[13px] font-medium text-white/80">{at('testTitle')}</h3>
        <p className="mt-1 text-[13px] text-white/45 leading-relaxed">{at('testHelp')}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button variant="secondary" icon={Send} loading={testing === 'inquiry'} disabled={!saved || !!testing} onClick={() => runTest('inquiry')}>
            {at('testInquiry')}
          </Button>
          <Button variant="secondary" icon={Send} loading={testing === 'reply'} disabled={!saved || !!testing} onClick={() => runTest('reply')}>
            {at('testReply')}
          </Button>
        </div>
        {testResult && (
          <p role="status" className={`mt-4 text-sm leading-relaxed ${testResult.ok ? 'text-white/80' : 'text-red-300'}`}>
            {testResult.text}
          </p>
        )}
      </div>
    </form>
  );
};

export default SettingsPanel;

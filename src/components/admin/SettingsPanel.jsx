import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { sendTestInquiryEmail, describeEmailError } from '../../services/inquiryService';
import { Button, useAdminT } from './AdminUI';

/**
 * Enquiry emails go to the recipient fixed in the EmailJS enquiry template,
 * so there is nothing to configure here; the panel explains that and offers
 * a connection test.
 */
const SettingsPanel = () => {
  const at = useAdminT();
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  const runTest = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      await sendTestInquiryEmail();
      setTestResult({ ok: true, text: at('testSent') });
    } catch (err) {
      console.error('Test email failed:', err);
      setTestResult({ ok: false, text: at('testFailed', { error: describeEmailError(err) }) });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="max-w-xl space-y-6">
      <p className="text-[14px] text-white/70 leading-relaxed">{at('inquiryRecipientNote')}</p>

      {/* Connection test: proves the enquiry template is wired up, without touching real enquiries */}
      <div className="pt-8 mt-2 border-t border-white/10">
        <h3 className="text-[13px] font-medium text-white/80">{at('testTitle')}</h3>
        <p className="mt-1 text-[13px] text-white/50 leading-relaxed">{at('testHelp')}</p>
        <div className="mt-4">
          <Button variant="secondary" icon={Send} loading={testing} disabled={testing} onClick={runTest}>
            {at('testInquiry')}
          </Button>
        </div>
        {testResult && (
          <p role="status" className={`mt-4 text-sm leading-relaxed ${testResult.ok ? 'text-white/80' : 'text-red-300'}`}>
            {testResult.text}
          </p>
        )}
      </div>
    </div>
  );
};

export default SettingsPanel;

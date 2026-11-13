import React, { useState, useEffect } from "react";
import { Trash2, Send, FileBadge, CircleCheck, CircleDot, Mail, MapPin } from "lucide-react";
import { format } from "date-fns";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { subscribeToInquiries, deleteInquiry, updateInquiryStatus } from "../../services/firebaseService";
import { sendInquiryReply } from "../../services/inquiryService";
import { useLanguage } from "../../context/LanguageContext";
import { useCustomToast } from "../ui/toast-context";
import CertificateDialog from "./CertificateDialog";
import { AdminDialog, Button, Field, IconButton, StatusBadge, inputClass, useAdminT } from "./AdminUI";

const artworksOf = (inquiry) => {
  if (Array.isArray(inquiry.artwork)) return inquiry.artwork;
  if (inquiry.artwork?.name) return [inquiry.artwork];
  return [];
};

const InquiryList = ({ products = [] }) => {
  const at = useAdminT();
  const { t } = useLanguage();
  const toast = useCustomToast();
  const reduce = useReducedMotion();
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyInquiry, setReplyInquiry] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [certInquiry, setCertInquiry] = useState(null);

  useEffect(() => {
    const unsubscribe = subscribeToInquiries((data) => {
      setInquiries(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Values saved by the site's forms, shown in the dashboard's language
  const interestLabel = (value) => ({
    purchase: t('productDetails', 'interestPurchase'),
    commission: t('productDetails', 'interestCommission'),
    other: t('productDetails', 'interestOther'),
    'Purchase Inquiry': t('contact', 'subjectPurchase'),
    'Commission Request': t('contact', 'subjectCommission'),
    'Exhibition Opportunity': t('contact', 'subjectExhibition'),
    'General Question': t('contact', 'subjectGeneral'),
  }[value] || value);

  const typeLabel = (type) => (
    type === 'multi' ? at('typeMulti') : type === 'contact_form' ? at('typeContact') : at('typeSingle')
  );

  const handleDelete = async (id) => {
    if (!window.confirm(at('confirmDeleteInquiry'))) return;
    try {
      await deleteInquiry(id);
    } catch (err) {
      console.error("Delete inquiry failed:", err);
      toast({ type: "error", message: at('genericError') });
    }
  };

  const handleStatusChange = async (id, currentStatus) => {
    const newStatus = currentStatus === 'replied' ? 'pending' : 'replied';
    try {
      await updateInquiryStatus(id, newStatus);
    } catch (err) {
      console.error("Status update failed:", err);
      toast({ type: "error", message: at('genericError') });
    }
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyMessage.trim()) return;

    setIsSending(true);
    try {
      // Emails the reply to the person who wrote, then marks the enquiry as replied
      await sendInquiryReply(replyInquiry, replyMessage);

      setReplyInquiry(null);
      setReplyMessage("");
      toast({ type: "success", message: at('replySent') });
    } catch (err) {
      console.error("Reply failed:", err);
      toast({ type: "error", message: at('replyError') });
    } finally {
      setIsSending(false);
    }
  };

  // The certificate needs the full work (size, medium); enquiries only store id and name
  const certArtwork = (() => {
    if (!certInquiry) return null;
    const first = artworksOf(certInquiry)[0];
    if (!first) return null;
    return products.find(p => p.id === first.id) || first;
  })();

  if (loading) {
    return (
      <div className="py-16 flex justify-center" role="status">
        <span className="text-sm text-white/45">{at('inquiriesLoading')}</span>
      </div>
    );
  }

  if (inquiries.length === 0) {
    return <p className="py-16 text-center text-sm text-white/50">{at('inquiriesEmpty')}</p>;
  }

  return (
    <>
      <ul className="divide-y divide-white/[0.08]">
        <AnimatePresence initial={false}>
          {inquiries.map((inquiry) => {
            const isReplied = inquiry.status === 'replied';
            const works = artworksOf(inquiry);
            return (
              <motion.li
                key={inquiry.id}
                layout={!reduce}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="py-6 first:pt-0"
              >
                <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
                  {/* Who and when */}
                  <div className="lg:w-64 shrink-0">
                    <div className="flex items-center gap-3 mb-2">
                      <StatusBadge tone={isReplied ? 'replied' : 'pending'}>
                        {isReplied ? at('replied') : at('pending')}
                      </StatusBadge>
                      <span className="text-[12px] text-white/35">{typeLabel(inquiry.type)}</span>
                    </div>
                    <h3 className="font-serif text-xl text-white leading-tight">{inquiry.customer?.name || '—'}</h3>
                    <a href={`mailto:${inquiry.customer?.email}`} className="mt-1 inline-flex items-center gap-1.5 text-sm text-white/55 hover:text-white transition-colors break-all">
                      <Mail size={13} className="shrink-0" /> {inquiry.customer?.email}
                    </a>
                    {inquiry.customer?.location && inquiry.customer.location !== 'Contact Form' && (
                      <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-white/45">
                        <MapPin size={13} /> {inquiry.customer.location}
                      </p>
                    )}
                    <p className="mt-2 text-[12px] text-white/35 tabular-nums">
                      {inquiry.timeStamp ? format(inquiry.timeStamp.toDate(), 'dd.MM.yyyy HH:mm') : '—'}
                    </p>
                  </div>

                  {/* What they wrote */}
                  <div className="flex-1 min-w-0">
                    {inquiry.interest && (
                      <p className="text-[12px] text-white/45 mb-2">
                        {at('subject')}: <span className="text-white/75">{interestLabel(inquiry.interest)}</span>
                      </p>
                    )}
                    <p className={`text-[15px] leading-relaxed whitespace-pre-line ${inquiry.message ? 'text-white/85' : 'text-white/35 italic'}`}>
                      {inquiry.message || at('noMessage')}
                    </p>

                    {works.length > 0 && (
                      <ul className="mt-4 flex flex-wrap gap-2">
                        {works.map((art, idx) => {
                          const full = products.find(p => p.id === art.id);
                          return (
                            <li key={art.id || idx} className="inline-flex items-center gap-2 pl-1 pr-3 py-1 rounded-full border border-white/10 text-[13px] text-white/75">
                              {full?.img && <img src={full.img} alt="" className="w-6 h-6 rounded-full object-cover" />}
                              {art.name}
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex lg:flex-col items-center lg:items-end gap-1 lg:gap-2 shrink-0">
                    <Button variant="accent" icon={Send} onClick={() => { setReplyInquiry(inquiry); setReplyMessage(""); }} className="h-9">
                      {at('reply')}
                    </Button>
                    <div className="flex items-center gap-0.5 ml-auto lg:ml-0">
                      <IconButton label={isReplied ? at('markPending') : at('markReplied')} onClick={() => handleStatusChange(inquiry.id, inquiry.status)}>
                        {isReplied ? <CircleDot size={17} strokeWidth={1.6} /> : <CircleCheck size={17} strokeWidth={1.6} />}
                      </IconButton>
                      {works.length > 0 && (
                        <IconButton label={at('certificate')} tone="accent" onClick={() => setCertInquiry(inquiry)}>
                          <FileBadge size={17} strokeWidth={1.6} />
                        </IconButton>
                      )}
                      <IconButton label={at('delete')} tone="danger" onClick={() => handleDelete(inquiry.id)}>
                        <Trash2 size={16} strokeWidth={1.6} />
                      </IconButton>
                    </div>
                  </div>
                </div>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>

      {/* Reply */}
      <AdminDialog
        open={!!replyInquiry}
        onOpenChange={(open) => !open && setReplyInquiry(null)}
        title={replyInquiry ? at('replyTo', { name: replyInquiry.customer?.name || '' }) : ''}
        description={replyInquiry?.customer?.email}
        className="max-w-xl"
      >
        {replyInquiry?.message && (
          <blockquote className="mb-6 pl-4 border-l border-white/15 text-sm text-white/55 leading-relaxed line-clamp-4 whitespace-pre-line">
            {replyInquiry.message}
          </blockquote>
        )}
        <form onSubmit={handleSendReply} className="space-y-5">
          <Field label={at('reply')} htmlFor="reply-msg">
            <textarea
              id="reply-msg"
              rows={6}
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              placeholder={at('replyPh')}
              className={`${inputClass} resize-y`}
              required
              autoFocus
            />
          </Field>
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setReplyInquiry(null)} disabled={isSending}>{at('cancel')}</Button>
            <Button type="submit" variant="accent" icon={Send} loading={isSending}>
              {isSending ? at('sending') : at('send')}
            </Button>
          </div>
        </form>
      </AdminDialog>

      <CertificateDialog
        open={!!certInquiry}
        onOpenChange={(open) => !open && setCertInquiry(null)}
        artwork={certArtwork}
        defaultCollector={certInquiry?.customer?.name || ""}
        source={certInquiry ? { inquiryId: certInquiry.id } : {}}
      />
    </>
  );
};

export default InquiryList;

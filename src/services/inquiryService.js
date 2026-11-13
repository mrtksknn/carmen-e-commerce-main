import emailjs from '@emailjs/browser';
import { addInquiry, getSiteSettings, updateInquiryStatus } from './firebaseService';

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
const INQUIRY_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const REPLY_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_REPLY_TEMPLATE_ID || 'template_3js4x5t';
const FALLBACK_NOTIFY_EMAIL = import.meta.env.VITE_INQUIRY_NOTIFY_EMAIL || '';

/** The address new enquiries go to: the one set in the admin panel, else the .env fallback. */
const resolveNotifyEmail = async () => {
  try {
    const settings = await getSiteSettings();
    if (settings?.notifyEmail) return settings.notifyEmail;
  } catch (err) {
    // Typically Firestore rules not allowing public reads of settings/site
    console.warn('Could not read notify email from settings, using fallback.', err);
  }
  return FALLBACK_NOTIFY_EMAIL;
};

const artworkNames = (artwork) => {
  if (Array.isArray(artwork)) return artwork.map((a) => a.name).join(', ');
  return artwork?.name || '';
};

/**
 * Saves an enquiry so it appears in the admin panel, then emails it to the studio.
 * The enquiry is the source of truth: if saving works but the email fails, the
 * visitor still gets a success message (the studio will see it in the panel)
 * and the result reports `emailed: false`.
 */
export const submitInquiry = async ({ customer, interest, message, artwork = null, type, subjectLine }) => {
  await addInquiry({ customer, interest, message, artwork, type });

  try {
    const toEmail = await resolveNotifyEmail();
    const works = artworkNames(artwork);
    await emailjs.send(
      SERVICE_ID,
      INQUIRY_TEMPLATE_ID,
      {
        to_email: toEmail,
        name: customer.name,
        from_name: customer.name,
        from_email: customer.email,
        reply_to: customer.email,
        subject: subjectLine || interest || 'Yeni talep',
        interest: interest || '',
        location: customer.location || '',
        artworks: works,
        message: [
          message || '',
          works ? `\nEser(ler): ${works}` : '',
          customer.location ? `\nKonum: ${customer.location}` : '',
          interest ? `\nKonu: ${interest}` : '',
        ].join(''),
      },
      PUBLIC_KEY
    );
    return { saved: true, emailed: true };
  } catch (err) {
    console.error('Enquiry saved, but the notification email failed:', err);
    return { saved: true, emailed: false };
  }
};

/** Readable text for an EmailJS failure (it rejects with { status, text }). */
export const describeEmailError = (err) => {
  if (!err) return '';
  if (err.text) return `${err.status ? `${err.status}: ` : ''}${err.text}`;
  return err.message || String(err);
};

/** Admin test: sends a sample enquiry email through the enquiry template to `toEmail`. */
export const sendTestInquiryEmail = (toEmail) => emailjs.send(
  SERVICE_ID,
  INQUIRY_TEMPLATE_ID,
  {
    to_email: toEmail,
    name: 'Test',
    from_name: 'Test · Piece Of Oblivion',
    from_email: toEmail,
    reply_to: toEmail,
    subject: 'Test talebi',
    interest: 'Test',
    location: 'İstanbul',
    artworks: 'Örnek eser',
    message: 'Bu bir test e-postasıdır. Bunu görüyorsanız yeni talep şablonu doğru bağlanmış demektir.',
  },
  PUBLIC_KEY
);

/** Admin test: sends a sample reply through the reply template to `toEmail`. */
export const sendTestReplyEmail = (toEmail) => emailjs.send(
  SERVICE_ID,
  REPLY_TEMPLATE_ID,
  {
    to_email: toEmail,
    customer_email: toEmail,
    customer_name: 'Test',
    artwork_name: 'Örnek eser',
    original_message: 'Müşterinin örnek mesajı.',
    reply_message: 'Bu bir test yanıtıdır. Bunu görüyorsanız yanıt şablonu doğru bağlanmış demektir.',
  },
  PUBLIC_KEY
);

/** Emails the admin's reply to the person who wrote, then marks the enquiry as replied. */
export const sendInquiryReply = async (inquiry, replyMessage) => {
  await emailjs.send(
    SERVICE_ID,
    REPLY_TEMPLATE_ID,
    {
      to_email: inquiry.customer?.email,
      customer_email: inquiry.customer?.email,
      customer_name: inquiry.customer?.name,
      artwork_name: artworkNames(inquiry.artwork),
      original_message: inquiry.message || '',
      reply_message: replyMessage,
    },
    PUBLIC_KEY
  );
  await updateInquiryStatus(inquiry.id, 'replied');
};

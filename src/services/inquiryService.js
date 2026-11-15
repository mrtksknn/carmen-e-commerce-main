import emailjs from '@emailjs/browser';
import { addInquiry } from './firebaseService';

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
const INQUIRY_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;

// The enquiry email's recipient is fixed in the EmailJS template itself
// ("To Email" = the studio address), never sent from the browser, so the
// template cannot be used to email anyone else. Replies are written from
// Gmail (see gmail-templates/), so there is no reply template to abuse.

// ── Input hardening ──────────────────────────────────────────────────────
// Everything a visitor types is trimmed, stripped of control characters and
// capped before it is stored or emailed. Firestore rules (firestore.rules)
// enforce the same limits on the server side.
export const INQUIRY_LIMITS = { name: 100, email: 254, location: 120, interest: 120, message: 4000, subject: 200 };
// eslint-disable-next-line no-control-regex
const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;
const clean = (value, max) => String(value ?? '').replace(CONTROL_CHARS, '').trim().slice(0, max);
const EMAIL_RE = /^[^\s@<>()",;:]+@[^\s@<>()",;:]+\.[^\s@<>()",;:]{2,}$/;

// One enquiry per browser every 30 seconds (stops accidental double sends and
// simple scripted floods from the page).
const THROTTLE_KEY = 'poo:lastInquiryAt';
const THROTTLE_MS = 30 * 1000;
const tooSoon = () => {
  try {
    const last = Number(localStorage.getItem(THROTTLE_KEY) || 0);
    return Date.now() - last < THROTTLE_MS;
  } catch {
    return false;
  }
};
const markSent = () => {
  try { localStorage.setItem(THROTTLE_KEY, String(Date.now())); } catch { /* storage unavailable */ }
};

const cleanArtwork = (artwork) => {
  const one = (a) => ({ id: clean(a?.id, 64), name: clean(a?.name, 200) });
  if (Array.isArray(artwork)) return artwork.slice(0, 20).map(one);
  if (artwork && typeof artwork === 'object') return one(artwork);
  return null;
};

const artworkNames = (artwork) => {
  if (Array.isArray(artwork)) return artwork.map((a) => a.name).join(', ');
  return artwork?.name || '';
};

/**
 * Saves an enquiry to Firestore (kept as a record), then emails it to the studio.
 * If saving works but the email fails, the visitor still gets a success
 * message and the result reports `emailed: false`.
 */
export const submitInquiry = async ({ customer: rawCustomer, interest: rawInterest, message: rawMessage, artwork: rawArtwork = null, type: rawType, subjectLine: rawSubject, website = '' }) => {
  // Honeypot: the hidden "website" field is only ever filled in by bots.
  // Pretend success so the bot learns nothing, and store/send nothing.
  if (String(website).trim()) return { saved: false, emailed: false };

  const customer = {
    name: clean(rawCustomer?.name, INQUIRY_LIMITS.name),
    email: clean(rawCustomer?.email, INQUIRY_LIMITS.email).toLowerCase(),
    location: clean(rawCustomer?.location, INQUIRY_LIMITS.location),
  };
  const interest = clean(rawInterest, INQUIRY_LIMITS.interest);
  const message = clean(rawMessage, INQUIRY_LIMITS.message);
  const artwork = cleanArtwork(rawArtwork);
  const type = ['contact_form', 'single', 'multi'].includes(rawType) ? rawType : 'contact_form';
  const subjectLine = clean(rawSubject, INQUIRY_LIMITS.subject);

  if (!customer.name || !EMAIL_RE.test(customer.email)) {
    const err = new Error('Invalid name or email');
    err.code = 'inquiry/invalid';
    throw err;
  }
  if (tooSoon()) {
    const err = new Error('Please wait a moment before sending another message');
    err.code = 'inquiry/too-soon';
    throw err;
  }

  await addInquiry({ customer, interest, message, artwork, type });
  markSent();

  try {
    const works = artworkNames(artwork);
    await emailjs.send(
      SERVICE_ID,
      INQUIRY_TEMPLATE_ID,
      {
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

/** Admin test: sends a sample enquiry email through the enquiry template (to its fixed recipient). */
export const sendTestInquiryEmail = () => emailjs.send(
  SERVICE_ID,
  INQUIRY_TEMPLATE_ID,
  {
    name: 'Test',
    from_name: 'Test · Piece Of Oblivion',
    from_email: 'test@example.com',
    reply_to: 'test@example.com',
    subject: 'Test talebi',
    interest: 'Test',
    location: 'İstanbul',
    artworks: 'Örnek eser',
    message: 'Bu bir test e-postasıdır. Bunu görüyorsanız yeni talep şablonu doğru bağlanmış demektir.',
  },
  PUBLIC_KEY
);

import React, { forwardRef } from 'react';

// Printed on paper, so it is set like a paper document: warm stock, black ink,
// the studio's red used once. English is kept as the document language because
// the works ship worldwide.
const PAPER = '#f6f2ec';
const INK = '#16120f';
const MUTED = '#6f665d';
const RULE = '#d9d0c4';
const ACCENT = '#af362c';

const CertificateOfAuthenticity = forwardRef(({ artwork, certificateId, collectorName }, ref) => {
  if (!artwork) return null;

  const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  const id = typeof certificateId === 'string' ? certificateId : (certificateId?.id || 'PREVIEW');
  const base = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`;
  const verifyUrl = `${window.location.origin}${base}verify/${id}`;

  const details = [
    { label: 'Medium', value: artwork.material },
    { label: 'Dimensions', value: artwork.dimensions },
    { label: 'Collection', value: artwork.collections },
    { label: 'Edition', value: 'Original, one of one' },
  ].filter((d) => d.value);

  const label = { fontFamily: '"DM Sans", system-ui, sans-serif', fontSize: '8.5pt', letterSpacing: '0.22em', textTransform: 'uppercase', color: MUTED };

  return (
    <>
      <style>
        {`
          @media print {
            @page { size: A4; margin: 0; }
            body { margin: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .coa-sheet { box-shadow: none !important; }
          }
        `}
      </style>

      <div
        ref={ref}
        className="coa-sheet relative mx-auto overflow-hidden font-serif"
        style={{ width: '210mm', height: '297mm', boxSizing: 'border-box', background: PAPER, color: INK, padding: '22mm 22mm 18mm' }}
      >
        {/* Inner frame */}
        <div className="absolute pointer-events-none" style={{ inset: '9mm', border: `0.4mm solid ${RULE}` }} />

        <div className="relative h-full flex flex-col">
          {/* Masthead */}
          <header className="text-center">
            <img src={`${base}logo.svg`} alt="Piece Of Oblivion" style={{ width: '13mm', height: '13mm', margin: '0 auto 7mm', objectFit: 'contain' }} />
            <p style={label}>Piece Of Oblivion</p>
            <h1 style={{ fontSize: '30pt', fontWeight: 300, lineHeight: 1.1, margin: '5mm 0 0', letterSpacing: '-0.01em' }}>
              Certificate of Authenticity
            </h1>
            <div style={{ width: '18mm', height: '0.5mm', background: ACCENT, margin: '7mm auto 0' }} />
          </header>

          <p className="text-center" style={{ fontSize: '12.5pt', fontStyle: 'italic', color: MUTED, lineHeight: 1.6, margin: '11mm auto 0', maxWidth: '135mm' }}>
            This certifies that the work described below is an original, signed work of art created by the artist Beliz Keskin.
          </p>

          {/* The work */}
          <section className="text-center" style={{ marginTop: '14mm' }}>
            <p style={label}>Title of the work</p>
            <h2 style={{ fontSize: '28pt', fontWeight: 400, fontStyle: 'italic', lineHeight: 1.15, margin: '3mm 0 0' }}>{artwork.name}</h2>
            {collectorName && (
              <p style={{ fontSize: '12.5pt', marginTop: '6mm', color: INK }}>
                <span style={{ ...label, marginRight: '3mm' }}>Collector</span>
                {collectorName}
              </p>
            )}
          </section>

          <dl
            className="grid grid-cols-2"
            style={{ marginTop: '12mm', borderTop: `0.3mm solid ${RULE}`, borderBottom: `0.3mm solid ${RULE}`, padding: '7mm 0', rowGap: '6mm', columnGap: '10mm' }}
          >
            {details.map((d) => (
              <div key={d.label} className="text-center">
                <dt style={label}>{d.label}</dt>
                <dd style={{ fontSize: '13pt', margin: '2mm 0 0', fontVariantNumeric: 'lining-nums' }}>{d.value}</dd>
              </div>
            ))}
          </dl>

          {/* Verification */}
          <section className="flex items-center justify-between" style={{ marginTop: '11mm', gap: '10mm' }}>
            <div>
              <p style={label}>Certificate number</p>
              <p style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: '10.5pt', marginTop: '2mm', letterSpacing: '0.04em' }}>{id}</p>
              <p style={{ fontFamily: '"DM Sans", system-ui, sans-serif', fontSize: '8.5pt', color: MUTED, marginTop: '3mm', maxWidth: '95mm', lineHeight: 1.5 }}>
                Scan the code or visit the address below to confirm this record.
              </p>
              <p style={{ fontFamily: '"DM Sans", system-ui, sans-serif', fontSize: '8pt', color: MUTED, marginTop: '1.5mm', wordBreak: 'break-all' }}>{verifyUrl}</p>
            </div>
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=0&color=16120f&bgcolor=f6f2ec&data=${encodeURIComponent(verifyUrl)}`}
              alt="Verification QR code"
              style={{ width: '26mm', height: '26mm', flexShrink: 0 }}
            />
          </section>

          {/* Signature */}
          <section className="grid grid-cols-2 mt-auto" style={{ columnGap: '18mm', paddingBottom: '6mm' }}>
            <div>
              <p style={{ fontSize: '12.5pt', height: '14mm', display: 'flex', alignItems: 'flex-end', paddingBottom: '2mm', fontVariantNumeric: 'lining-nums' }}>{today}</p>
              <div style={{ height: '0.3mm', background: INK, opacity: 0.6 }} />
              <p style={{ ...label, marginTop: '2.5mm' }}>Date of issue</p>
            </div>
            <div>
              <div style={{ height: '14mm' }} />
              <div style={{ height: '0.3mm', background: INK, opacity: 0.6 }} />
              <p style={{ ...label, marginTop: '2.5mm' }}>Signature · Beliz Keskin</p>
            </div>
          </section>

          <footer className="text-center" style={{ ...label, fontSize: '7.5pt', letterSpacing: '0.3em', paddingTop: '4mm' }}>
            Piece Of Oblivion · Beliz Keskin
          </footer>
        </div>
      </div>
    </>
  );
});

CertificateOfAuthenticity.displayName = 'CertificateOfAuthenticity';

export default CertificateOfAuthenticity;

import React, { forwardRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { ShieldCheck, Award, QrCode } from 'lucide-react';

const CertificateOfAuthenticity = forwardRef(({ artwork, certificateId, collectorName }, ref) => {
  const { t } = useLanguage();
  const today = new Date().toLocaleDateString();

  if (!artwork) return null;

  return (
    <>
      <style>
        {`
          @media print {
            @page {
              size: A4;
              margin: 0;
            }
            body {
              margin: 0;
              -webkit-print-color-adjust: exact;
            }
            .certificate-container {
              box-shadow: none !important;
              border: none !important;
              width: 210mm !important;
              height: 297mm !important;
              margin: 0 !important;
              border-radius: 0 !important;
            }
          }
        `}
      </style>

      <div
        ref={ref}
        className="certificate-container relative bg-[#0c0c0c] text-white p-12 sm:p-12 shadow-2xl mx-auto border-[16px] border-[#1a1a1a] overflow-hidden font-serif print:shadow-none print:border-none"
        style={{
          width: '210mm',
          height: '297mm',
          boxSizing: 'border-box'
        }}
      >
        {/* Header - Orijinal Hali */}
        <div className="text-center mb-8 relative z-10">
          <div className="flex justify-center mb-6">
            <img src={`${import.meta.env.BASE_URL}logo.svg`} alt="Carmen Logo" className="w-12 h-12 object-contain" />
          </div>
          <h1 className="text-2xl sm:text-2xl font-bold uppercase tracking-[0.2em] text-white mb-4">
            Certificate of Authenticity
          </h1>
          <div className="w-32 h-[1px] bg-[#d4af37] mx-auto mb-4"></div>
          <p className="text-[10px] uppercase tracking-[0.4em] text-[#888]">Official Document • Carmen Arts Gallery</p>
        </div>

        {/* Body - Orijinal Hali */}
        <div className="relative z-10">
          <div className="text-center">
            <p className="text-lg italic text-gray-400 mb-8">This document certifies that the artwork described below is an authentic, original work of art created by the artist.</p>
          </div>

          {/* Orijinal İçeriğe Ek: Collector (İsteğe bağlı olarak eklenmişti, koruyorum) */}
          {collectorName && (
            <div className="text-center -mt-4 mb-4">
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#d4af37] font-bold block mb-1">Presented to Collector</span>
              <p className="text-xl text-white">{collectorName}</p>
            </div>
          )}

          {/* Artwork Info - Orijinal Hali */}
          <div className="grid grid-cols-1 gap-10 border-y border-white/10 py-12 space-y-6" style={{ marginTop: '0 !important' }}>
            <div className="text-center">
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#d4af37] font-bold block mb-3">Title of Artwork</span>
              <h2 className="text-3xl font-bold text-white">{artwork.name}</h2>
            </div>

            <div className="grid grid-cols-2 gap-8 text-center">
              <div>
                <span className="text-[10px] uppercase tracking-[0.3em] text-gray-500 block mb-2">Medium</span>
                <p className="text-sm font-bold text-white">{artwork.collections || 'Fine Art'}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-[0.3em] text-gray-500 block mb-2">Year</span>
                <p className="text-sm font-bold text-white">{new Date().getFullYear()}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-[0.3em] text-gray-500 block mb-2">Dimensions</span>
                <p className="text-sm font-bold text-white">{artwork.dimensions || 'Custom Size'}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-[0.3em] text-gray-500 block mb-2">Edition</span>
                <p className="text-sm font-bold text-white">Original 1 of 1</p>
              </div>
            </div>
          </div>

          {/* Authentication ID & QR - Orijinal yapıya saygı duyarak yerleştirildi */}
          <div className="grid grid-cols-2 items-center py-0 space-y-6 m-0" style={{ marginTop: '0 !important' }}>
            <div className="bg-white/5 border border-white/10 px-6 py-4 rounded-lg flex items-center gap-4">
              <ShieldCheck className="text-[#d4af37]" size={20} />
              <div className="text-left">
                <span className="text-[9px] uppercase tracking-widest text-gray-500 block">Authentication ID</span>
                <code className="text-xs font-mono font-bold tracking-wider text-white uppercase">
                  {typeof certificateId === 'string' ? certificateId : (certificateId?.id || artwork.id?.toString() || 'REF-8821-X')}
                </code>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className="p-2 bg-white rounded-lg mb-1 shadow-lg">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                    window.location.origin + (import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : import.meta.env.BASE_URL + '/') + 'verify/' + (certificateId || 'PREVIEW')
                  )}`}
                  alt="Verification QR Code"
                  className="w-[100px] h-[100px]"
                />
              </div>
              <span className="text-[7px] uppercase tracking-widest text-gray-500">Scan to Verify</span>
            </div>
          </div>

          {/* Signatures - Orijinal Hali */}
          <div className="grid grid-cols-2 gap-20 pt-5">
            <div className="text-center flex flex-col items-center">
              <div className="w-full h-px bg-white/10 mb-4"></div>
              <span className="text-[10px] uppercase tracking-widest text-gray-500">Date of Issue</span>
              <p className="text-xs font-bold mt-2 text-white">{today}</p>
            </div>
            <div className="text-center flex flex-col items-center">
              <div className="h-12 w-32 flex items-center justify-center opacity-70 mb-2">
                <span className="font-serif italic text-2xl text-white">Carmen</span>
              </div>
              <div className="w-full h-px bg-white/10 mb-4"></div>
              <span className="text-[10px] uppercase tracking-widest text-gray-500">Authorized Signature</span>
            </div>
          </div>
        </div>

        {/* Footer Branding - Orijinal Hali */}
        <div className="absolute bottom-12 left-0 right-0 text-center opacity-30">
          <p className="text-[9px] uppercase tracking-[0.5em] font-bold">Carmen Arts • International Fine Art Gallery</p>
        </div>

        {/* Decorative Corner Elements - Orijinal Hali */}
        <div className="absolute top-0 left-0 w-24 h-24 border-t-2 border-l-2 border-[#d4af37]/20"></div>
        <div className="absolute bottom-0 right-0 w-24 h-24 border-b-2 border-r-2 border-[#d4af37]/20"></div>
      </div>
    </>
  );
});

CertificateOfAuthenticity.displayName = 'CertificateOfAuthenticity';

export default CertificateOfAuthenticity;

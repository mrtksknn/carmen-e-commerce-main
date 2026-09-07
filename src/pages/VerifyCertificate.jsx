import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { verifyCertificate } from '../services/firebaseService';
import { ShieldCheck, Calendar, User, Tag, ArrowRight, Loader2, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';

const VerifyCertificate = () => {
  const { certId } = useParams();
  const [loading, setLoading] = useState(true);
  const [certificate, setCertificate] = useState(null);

  useEffect(() => {
    const checkCert = async () => {
      console.log("Checking Certificate ID:", certId);
      try {
        const data = await verifyCertificate(certId);
        console.log("Fetched Data:", data);
        setCertificate(data);
      } catch (error) {
        console.error("Verification error details:", error);
      } finally {
        setLoading(false);
      }
    };
    if (certId && certId !== 'PREVIEW') {
      checkCert();
    } else {
      setLoading(false);
    }
  }, [certId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="text-primary animate-spin" size={40} />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background text-white pt-32 pb-20 px-6 relative overflow-hidden">
      <SEO title="Artwork Verification | Piece Of Oblivion" />
      
      {/* Decorative Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(168,50,41,0.05)_0%,transparent_70%)] pointer-events-none"></div>

      <div className="max-w-2xl mx-auto relative z-10">
        {!certificate ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center p-12 bg-surface/50 border border-white/5 rounded-[2rem] backdrop-blur-xl"
          >
            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/20">
              <ShieldCheck className="text-red-500" size={40} />
            </div>
            <h1 className="text-3xl font-serif mb-4">Verification Failed</h1>
            <p className="text-gray-400 mb-8 font-light">This certificate ID could not be found in our official registry. Please contact the gallery for assistance.</p>
            <Link to="/" className="inline-flex items-center gap-2 text-primary hover:text-white transition-colors uppercase tracking-widest text-xs font-bold">
              Return to Gallery <ArrowRight size={14} />
            </Link>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Header Success */}
            <div className="text-center mb-12">
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-primary/20 shadow-[0_0_40px_rgba(168,50,41,0.2)]">
                <ShieldCheck className="text-primary" size={48} />
              </div>
              <h1 className="text-4xl md:text-5xl font-serif tracking-tight mb-2 italic">Authenticity Verified</h1>
              <p className="text-[#d4af37] uppercase tracking-[0.4em] text-[10px] font-bold">Official Digital Record • Piece Of Oblivion</p>
            </div>

            {/* Certificate Card */}
            <div className="bg-surface/30 border border-white/10 rounded-[2.5rem] overflow-hidden backdrop-blur-md shadow-2xl">
              <div className="bg-gradient-to-r from-primary/20 to-transparent p-8 border-b border-white/5">
                <span className="text-[10px] uppercase tracking-widest text-primary font-bold mb-2 block">Original Masterpiece</span>
                <h2 className="text-3xl md:text-4xl font-serif text-white">{certificate.artwork?.name}</h2>
              </div>

              <div className="p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <User className="text-gray-500 mt-1" size={18} />
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-gray-500 block mb-1">Collector</span>
                      <p className="text-lg text-white font-medium">{certificate.collectorName}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Calendar className="text-gray-500 mt-1" size={18} />
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-gray-500 block mb-1">Issue Date</span>
                      <p className="text-lg text-white font-medium">{certificate.createdAt ? new Date(certificate.createdAt.toDate()).toLocaleDateString() : 'N/A'}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <Tag className="text-gray-500 mt-1" size={18} />
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-gray-500 block mb-1">Edition</span>
                      <p className="text-lg text-white font-medium">Original 1 of 1</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Award className="text-gray-500 mt-1" size={18} />
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-gray-500 block mb-1">Authenticity ID</span>
                      <code className="text-sm text-primary font-mono bg-primary/5 px-2 py-1 rounded">{certId}</code>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div className="px-8 pb-12 pt-4 flex justify-center">
                <div className="px-6 py-3 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] font-bold tracking-[0.2em] uppercase flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  Valid Digital Asset
                </div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-gray-500 text-xs font-light leading-relaxed max-w-sm mx-auto italic">
                "This document serves as the permanent digital record of authenticity for the work of art mentioned above, curated by Piece Of Oblivion."
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
};

export default VerifyCertificate;

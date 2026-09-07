import React, { useState, useEffect } from "react";
import { Trash2, Calendar, User, Mail, MapPin, Tag, CheckCircle, Clock, Send, X, ShieldCheck, Printer } from "lucide-react";
import { subscribeToInquiries, deleteInquiry, updateInquiryStatus, generateCertificate } from "../../services/firebaseService";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import * as Dialog from "@radix-ui/react-dialog";
import emailjs from "@emailjs/browser";
import CertificateOfAuthenticity from "./CertificateOfAuthenticity";

const InquiryList = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyInquiry, setReplyInquiry] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  
  // Certificate states
  const [certInquiry, setCertInquiry] = useState(null);
  const [collectorName, setCollectorName] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCertId, setGeneratedCertId] = useState(null);

  useEffect(() => {
    const unsubscribe = subscribeToInquiries((data) => {
      setInquiries(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Bu talebi silmek istediğinizden emin misiniz?")) return;
    try {
      await deleteInquiry(id);
    } catch (err) {
      console.error("Delete inquiry failed:", err);
    }
  };

  const handleStatusChange = async (id, currentStatus) => {
    const newStatus = currentStatus === 'replied' ? 'pending' : 'replied';
    try {
      await updateInquiryStatus(id, newStatus);
    } catch (err) {
      console.error("Status update failed:", err);
    }
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyMessage.trim()) return;

    setIsSending(true);
    try {
      const emailParams = {
        customer_name: replyInquiry.customer?.name,
        customer_email: replyInquiry.customer?.email,
        artwork_name: replyInquiry.type === 'multi' 
          ? replyInquiry.artwork?.map(i => i.name).join(', ') 
          : replyInquiry.artwork?.name,
        reply_message: replyMessage
      };

      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        'template_igrmaep',
        emailParams,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );

      // Update status to replied after successful email
      await updateInquiryStatus(replyInquiry.id, 'replied');
      
      setReplyInquiry(null);
      setReplyMessage("");
      alert("Yanıt başarıyla gönderildi.");
    } catch (err) {
      console.error("Reply failed:", err);
      alert("Gönderim sırasında bir hata oluştu.");
    } finally {
      setIsSending(false);
    }
  };

  const handleGenerateCert = async () => {
    if (!collectorName.trim()) {
      alert("Lütfen koleksiyoner adını giriniz.");
      return;
    }

    setIsGenerating(true);
    try {
      const artwork = certInquiry.type === 'multi' 
        ? certInquiry.artwork[0] // multi ise ilkini baz alıyoruz
        : certInquiry.artwork;

      const certData = {
        artwork: {
          name: artwork.name,
          artist: "Carmen" // Varsayılan sanatçı
        },
        collectorName: collectorName,
        inquiryId: certInquiry.id,
        issueDate: new Date()
      };

      const certId = await generateCertificate(certData);
      setGeneratedCertId(certId);
      alert("Sertifika başarıyla oluşturuldu ve veritabanına kaydedildi.");
    } catch (err) {
      console.error("Certificate generation failed:", err);
      alert("Sertifika oluşturulurken bir hata oluştu.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20 text-gray-500 gap-4">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      <span className="text-xs font-bold uppercase tracking-widest">Yükleniyor...</span>
    </div>
  );

  return (
    <div className="space-y-6">
      <AnimatePresence mode="popLayout">
        {inquiries.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 text-gray-500 bg-white/5 rounded-[2rem] border border-white/5"
          >
            Henüz bir talep bulunmuyor.
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {inquiries.map((inquiry) => (
              <motion.div 
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                key={inquiry.id} 
                className={`bg-[#111111] border ${inquiry.status === 'replied' ? 'border-green-500/20' : 'border-white/5'} rounded-[2rem] overflow-hidden hover:border-primary/30 transition-all group relative`}
              >
                {/* Status Badge */}
                <div className="absolute top-6 right-6 flex items-center gap-2">
                   <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-1.5 ${
                     inquiry.status === 'replied' ? 'bg-green-500/10 text-green-500' : 'bg-amber-500/10 text-amber-500'
                   }`}>
                     {inquiry.status === 'replied' ? <CheckCircle size={10} /> : <Clock size={10} />}
                     {inquiry.status === 'replied' ? 'Cevaplandı' : 'Beklemede'}
                   </span>
                </div>

                <div className="p-8">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary border border-primary/20 shadow-xl">
                        <User size={24} />
                      </div>
                      <div>
                        <h3 className="text-xl font-serif text-white tracking-tight">{inquiry.customer?.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Mail size={12} className="text-gray-600" />
                          <p className="text-sm text-gray-500 font-light">{inquiry.customer?.email}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest ${inquiry.type === 'multi' ? 'bg-purple-500/10 text-purple-400' : 'bg-blue-500/10 text-blue-400'}`}>
                        {inquiry.type === 'multi' ? 'Multi-Inquiry' : 'Single Inquiry'}
                      </span>
                      <span className="text-[10px] text-gray-600 font-mono mt-1">
                        {inquiry.timeStamp ? format(inquiry.timeStamp.toDate(), 'dd MMM yyyy HH:mm') : 'Just now'}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <div className="flex items-center gap-3 text-gray-400 bg-white/5 p-3 rounded-xl border border-white/5">
                      <MapPin size={16} className="text-primary/60" />
                      <span className="text-xs font-medium">{inquiry.customer?.location || 'Belirtilmedi'}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-400 bg-white/5 p-3 rounded-xl border border-white/5">
                      <Tag size={16} className="text-primary/60" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">
                        İlgi: {inquiry.interest}
                      </span>
                    </div>
                  </div>

                  <div className="bg-black/60 rounded-[1.5rem] p-6 border border-white/5 mb-8 relative group/msg">
                    <p className="text-gray-300 text-sm leading-relaxed italic">
                      "{inquiry.message || 'Mesaj bırakılmadı.'}"
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-8">
                    {inquiry.type === 'multi' ? (
                      inquiry.artwork?.map((art, idx) => (
                        <span key={idx} className="bg-primary/5 px-4 py-2 rounded-xl text-[10px] font-bold text-primary border border-primary/10">
                          {art.name}
                        </span>
                      ))
                    ) : (
                      <span className="bg-primary/5 px-4 py-2 rounded-xl text-[10px] font-bold text-primary border border-primary/10">
                        {inquiry.artwork?.name}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-white/5">
                    <button 
                      onClick={() => handleDelete(inquiry.id)}
                      className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-all text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-xl hover:bg-red-500/5"
                    >
                      <Trash2 size={16} />
                      Sil
                    </button>
                    
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => handleStatusChange(inquiry.id, inquiry.status)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all border ${
                          inquiry.status === 'replied' 
                            ? 'bg-green-500/10 text-green-500 border-green-500/20' 
                            : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10'
                        }`}
                      >
                        <CheckCircle size={14} />
                        {inquiry.status === 'replied' ? 'Beklemeye Al' : 'Cevaplandı İşaretle'}
                      </button>

                      <button 
                        onClick={() => {
                          setCertInquiry(inquiry);
                          setCollectorName(inquiry.customer?.name || "");
                          setGeneratedCertId(null);
                        }}
                        className="flex items-center gap-2 bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/20 px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#d4af37]/20 transition-all"
                      >
                        <ShieldCheck size={14} />
                        Sertifika
                      </button>

                      <button 
                        onClick={() => setReplyInquiry(inquiry)}
                        className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-primary-hover hover:shadow-[0_10px_20px_rgba(168,50,41,0.3)] transition-all"
                      >
                        <Send size={14} />
                        Yanıtla
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Reply Modal */}
      <Dialog.Root open={!!replyInquiry} onOpenChange={(open) => !open && setReplyInquiry(null)}>
        {/* ... (Existing Reply Modal Content) ... */}
      </Dialog.Root>

      {/* Certificate Issuance Modal */}
      <Dialog.Root open={!!certInquiry} onOpenChange={(open) => !open && setCertInquiry(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/90 backdrop-blur-md z-[150] animate-in fade-in duration-300" />
          <Dialog.Content className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[151] outline-none ${generatedCertId ? 'w-auto max-h-[95vh] overflow-y-auto' : 'w-[90vw] max-w-md'}`}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`${generatedCertId ? '' : 'bg-[#0c0c0c] border border-white/10 rounded-[2.5rem] p-8 sm:p-12 shadow-2xl'}`}
            >
              {!generatedCertId ? (
                <>
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <Dialog.Title className="text-2xl font-serif text-white">Issue Certificate</Dialog.Title>
                      <Dialog.Description className="text-xs text-gray-500 mt-1 uppercase tracking-widest font-bold">
                        Digitally certify this acquisition
                      </Dialog.Description>
                    </div>
                    <Dialog.Close className="p-2 hover:bg-white/5 rounded-full text-gray-500 transition-colors">
                      <X size={20} />
                    </Dialog.Close>
                  </div>

                  <div className="space-y-6">
                    <div className="p-4 bg-primary/5 border border-primary/20 rounded-2xl">
                      <span className="text-[10px] text-primary font-bold uppercase tracking-widest block mb-1">Artwork</span>
                      <p className="text-white text-lg font-serif">
                        {certInquiry?.type === 'multi' ? certInquiry?.artwork[0]?.name : certInquiry?.artwork?.name}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-500">Collector Name</label>
                      <input 
                        type="text"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-primary/50 outline-none text-sm"
                        placeholder="Full Name of the Owner"
                        value={collectorName}
                        onChange={(e) => setCollectorName(e.target.value)}
                      />
                    </div>

                    <button 
                      onClick={handleGenerateCert}
                      disabled={isGenerating}
                      className="w-full bg-[#d4af37] text-black hover:bg-[#b8952d] py-4 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all disabled:opacity-50"
                    >
                      {isGenerating ? "Generating..." : "Generate & Save Certificate"}
                    </button>
                  </div>
                </>
              ) : (
                <div className="relative group">
                   <div className="fixed top-6 right-6 flex gap-4 z-[160] no-print">
                      <button 
                        onClick={handlePrint}
                        className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-2xl hover:scale-105 transition-transform"
                      >
                        <Printer size={16} />
                        Print A4
                      </button>
                      <button 
                        onClick={() => setCertInquiry(null)}
                        className="p-3 bg-red-500 text-white rounded-full shadow-2xl hover:bg-red-600 transition-colors"
                      >
                        <X size={20} />
                      </button>
                   </div>
                   
                   <div className="print-area">
                      <CertificateOfAuthenticity 
                        artwork={certInquiry.type === 'multi' ? certInquiry.artwork[0] : certInquiry.artwork}
                        collectorName={collectorName}
                        certificateId={generatedCertId}
                      />
                   </div>
                </div>
              )}
            </motion.div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};

export default InquiryList;

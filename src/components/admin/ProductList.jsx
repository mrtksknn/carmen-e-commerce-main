import React, { useState, useRef } from "react";
import { Edit2, Trash2, CheckCircle2, XCircle, FileText, Printer, X, ShieldCheck } from "lucide-react";
import { useReactToPrint } from "react-to-print";
import * as Dialog from "@radix-ui/react-dialog";
import CertificateOfAuthenticity from "./CertificateOfAuthenticity";
import { generateCertificate } from "../../services/firebaseService";
import { motion } from "framer-motion";

const ProductList = ({ products, onEdit, onDelete, onToggleStatus }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProductForCOA, setSelectedProductForCOA] = useState(null);
  const [isCOAModalOpen, setIsCOAModalOpen] = useState(false);
  const [collectorName, setCollectorName] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCertId, setGeneratedCertId] = useState(null);
  const certificateRef = useRef(null);

  const handlePrint = useReactToPrint({
    contentRef: certificateRef,
    documentTitle: `COA-${selectedProductForCOA?.name?.replace(/\s+/g, '-')}`,
  });

  const itemsPerPage = 7;
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const currentItems = products.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const openCOA = (product) => {
    setSelectedProductForCOA(product);
    setCollectorName("");
    setGeneratedCertId(null);
    setIsCOAModalOpen(true);
  };

  const handleGenerateCert = async () => {
    if (!collectorName.trim()) {
      alert("Lütfen koleksiyoner adını giriniz.");
      return;
    }

    setIsGenerating(true);
    try {
      const certData = {
        artwork: {
          name: selectedProductForCOA.name,
          artist: "Carmen"
        },
        collectorName: collectorName,
        productId: selectedProductForCOA.id,
        issueDate: new Date()
      };

      const certId = await generateCertificate(certData);
      setGeneratedCertId(certId);
    } catch (err) {
      console.error("Certificate generation failed:", err);
      alert("Sertifika oluşturulurken bir hata oluştu.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-primary/20 bg-surface overflow-hidden shadow-lg">
        <table className="w-full">
          <thead>
            <tr className="bg-primary/5">
              {["Image", "Title", "Category", "Price", "Status", "Actions"].map((header) => (
                <th
                  key={header}
                  className="text-left px-6 py-4 text-gray-400 font-medium tracking-wide text-sm"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-primary/10">
            {currentItems.length ? (
              currentItems.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-primary/5 transition-colors group"
                >
                  <td className="px-6 py-4 text-left">
                    <img
                      src={product.img}
                      alt={product.name}
                      className="w-16 h-12 object-cover rounded-md shadow-sm group-hover:shadow-primary/20 transition-all"
                    />
                  </td>
                  <td className="px-6 py-4 text-left font-medium text-white">{product.name}</td>
                  <td className="px-6 py-4 text-left text-gray-300">{product.collections ? <span>{product.collections}</span> : '--'}</td>
                  <td className="px-6 py-4 text-left text-gray-300">{product.price}</td>
                  <td className="px-6 py-4 text-left">
                    <span
                      className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-medium border ${
                        product.status 
                        ? "bg-primary/20 border-primary/30 text-white" 
                        : "bg-green-500/10 border-green-500/20 text-green-400"
                      }`}
                    >
                      {product.status ? "Sold" : "New"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-left">
                    <div className="flex items-center justify-start gap-3">
                      <button
                        className="p-1.5 rounded-md border border-transparent hover:border-yellow-500/20 hover:bg-yellow-500/10 text-gray-400 hover:text-yellow-500 transition-all shadow-sm hover:shadow"
                        title="Generate Certificate of Authenticity"
                        onClick={() => openCOA(product)}
                      >
                        <FileText size={18} />
                      </button>

                      <button
                        className="p-1.5 rounded-md border border-transparent hover:border-primary/20 hover:bg-primary/10 text-gray-400 hover:text-white transition-all shadow-sm hover:shadow"
                        title={product.status ? "Unmark Sold" : "Mark as Sold"}
                        onClick={() => onToggleStatus(product)}
                      >
                        {product.status ? <XCircle size={18} /> : <CheckCircle2 size={18} />}
                      </button>

                      <button
                        className="p-1.5 rounded-md border border-transparent hover:border-blue-500/20 hover:bg-blue-500/10 text-gray-400 hover:text-blue-400 transition-all shadow-sm hover:shadow"
                        title="Edit Product"
                        onClick={() => onEdit(product)}
                      >
                        <Edit2 size={18} />
                      </button>

                      <button
                        className="p-1.5 rounded-md border border-transparent hover:border-red-500/20 hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-all shadow-sm hover:shadow"
                        title="Delete Product"
                        onClick={() => onDelete(product.id)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="text-center py-8 text-muted-foreground"
                >
                  No products found. Add your first product to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* COA Preview Modal */}
      <Dialog.Root open={isCOAModalOpen} onOpenChange={setIsCOAModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] animate-in fade-in duration-300" />
          <Dialog.Content className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] outline-none ${generatedCertId ? 'w-auto max-h-[95vh] overflow-y-auto' : 'w-[90vw] max-w-md'}`}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`${generatedCertId ? '' : 'bg-[#0c0c0c] border border-white/10 rounded-[2.5rem] p-8 sm:p-12 shadow-2xl'}`}
            >
              {!generatedCertId ? (
                <>
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <Dialog.Title className="text-2xl font-serif text-white">Sertifika Oluştur</Dialog.Title>
                      <Dialog.Description className="text-xs text-gray-500 mt-1 uppercase tracking-widest font-bold">
                        Eser için resmi sertifika kaydı
                      </Dialog.Description>
                    </div>
                    <Dialog.Close className="p-2 hover:bg-white/5 rounded-full text-gray-500 transition-colors">
                      <X size={20} />
                    </Dialog.Close>
                  </div>

                  <div className="space-y-6">
                    <div className="p-4 bg-primary/5 border border-primary/20 rounded-2xl">
                      <span className="text-[10px] text-primary font-bold uppercase tracking-widest block mb-1">Eser Adı</span>
                      <p className="text-white text-lg font-serif">
                        {selectedProductForCOA?.name}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-500">Koleksiyoner Adı</label>
                      <input 
                        type="text"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-primary/50 outline-none text-sm"
                        placeholder="Örn: Mert Keskin"
                        value={collectorName}
                        onChange={(e) => setCollectorName(e.target.value)}
                      />
                    </div>

                    <button 
                      onClick={handleGenerateCert}
                      disabled={isGenerating}
                      className="w-full bg-[#d4af37] text-black hover:bg-[#b8952d] py-4 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all disabled:opacity-50"
                    >
                      {isGenerating ? "Oluşturuluyor..." : "Sertifikayı Oluştur ve Kaydet"}
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
                        A4 Yazdır
                      </button>
                      <button 
                        onClick={() => setIsCOAModalOpen(false)}
                        className="p-3 bg-red-500 text-white rounded-full shadow-2xl hover:bg-red-600 transition-colors"
                      >
                        <X size={20} />
                      </button>
                   </div>
                   
                   <div className="print-area">
                      <CertificateOfAuthenticity 
                        ref={certificateRef}
                        artwork={selectedProductForCOA}
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-8">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              currentPage === 1
                ? "opacity-50 cursor-not-allowed bg-surface text-gray-500 border border-primary/10"
                : "bg-surface text-gray-300 border border-primary/20 hover:bg-primary/20 hover:text-white"
            }`}
          >
            Prev
          </button>

          <div className="flex bg-surface rounded-lg border border-primary/20 p-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`w-8 h-8 rounded-md flex items-center justify-center text-sm font-medium transition-all ${
                  currentPage === page
                    ? "bg-primary text-white shadow-sm"
                    : "text-gray-400 hover:bg-primary/10 hover:text-white"
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              currentPage === totalPages
                ? "opacity-50 cursor-not-allowed bg-surface text-gray-500 border border-primary/10"
                : "bg-surface text-gray-300 border border-primary/20 hover:bg-primary/20 hover:text-white"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductList;

import React, { useEffect, useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useReactToPrint } from "react-to-print";
import { Printer, X, ShieldCheck } from "lucide-react";
import CertificateOfAuthenticity from "./CertificateOfAuthenticity";
import { generateCertificate } from "../../services/firebaseService";
import { AdminDialog, Button, Field, inputClass, useAdminT } from "./AdminUI";
import { artImage } from '../../lib/artImage';

/**
 * Issues a certificate for one work: asks for the collector's name, saves the
 * record, then shows the printable A4 document.
 */
const CertificateDialog = ({ open, onOpenChange, artwork, defaultCollector = "", source = {} }) => {
  const at = useAdminT();
  const [collectorName, setCollectorName] = useState(defaultCollector);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const [certId, setCertId] = useState(null);
  const docRef = useRef(null);

  useEffect(() => {
    if (open) {
      setCollectorName(defaultCollector);
      setCertId(null);
      setError("");
    }
  }, [open, defaultCollector]);

  const handlePrint = useReactToPrint({
    contentRef: docRef,
    documentTitle: `COA-${(artwork?.name || "artwork").replace(/\s+/g, "-")}`,
  });

  const handleGenerate = async (e) => {
    e?.preventDefault();
    if (!collectorName.trim()) {
      setError(at("certNeedCollector"));
      return;
    }
    setIsGenerating(true);
    setError("");
    try {
      const id = await generateCertificate({
        artwork: { name: artwork.name, artist: "Beliz Keskin" },
        collectorName: collectorName.trim(),
        issueDate: new Date(),
        ...source,
      });
      setCertId(id);
    } catch (err) {
      console.error("Certificate generation failed:", err);
      setError(at("certError"));
    } finally {
      setIsGenerating(false);
    }
  };

  if (!artwork) return null;

  if (!certId) {
    return (
      <AdminDialog open={open} onOpenChange={onOpenChange} title={at("certTitle")} description={at("certDesc")}>
        <form onSubmit={handleGenerate} className="space-y-6">
          <div className="flex items-center gap-4">
            {artwork.img && (
              <img {...artImage(artwork.img, { sizes: '64px', maxWidth: 480 })} alt="" className="w-14 h-16 object-cover rounded-[3px] ring-1 ring-white/10" />
            )}
            <div>
              <p className="text-[12px] text-white/50">{at("certArtwork")}</p>
              <p className="font-serif text-xl text-white">{artwork.name}</p>
            </div>
          </div>

          <Field label={at("certCollector")} htmlFor="cert-collector">
            <input
              id="cert-collector"
              type="text"
              className={inputClass}
              placeholder={at("certCollectorPh")}
              value={collectorName}
              onChange={(e) => setCollectorName(e.target.value)}
              autoFocus
            />
          </Field>

          {error && <p role="alert" className="text-sm text-red-300">{error}</p>}

          <div className="flex justify-end gap-3">
            <Dialog.Close asChild>
              <Button variant="ghost">{at("cancel")}</Button>
            </Dialog.Close>
            <Button type="submit" variant="accent" icon={ShieldCheck} loading={isGenerating}>
              {isGenerating ? at("certCreating") : at("certCreate")}
            </Button>
          </div>
        </form>
      </AdminDialog>
    );
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/90 z-[150]" />
        <Dialog.Content className="fixed inset-0 z-[151] overflow-auto outline-none">
          <Dialog.Title className="sr-only">{at("certTitle")}</Dialog.Title>
          <Dialog.Description className="sr-only">{artwork.name}</Dialog.Description>
          <div className="sticky top-0 z-10 flex justify-end gap-2 p-4 sm:p-6">
            <Button icon={Printer} onClick={handlePrint}>{at("certPrint")}</Button>
            <Dialog.Close asChild>
              <Button variant="secondary" icon={X} className="bg-black/60">{at("close")}</Button>
            </Dialog.Close>
          </div>
          <div className="px-4 pb-10 flex justify-center">
            {/* zoom (not transform) so the preview's layout box shrinks with it; the print copy is unaffected */}
            <div className="[zoom:0.42] sm:[zoom:0.65] lg:[zoom:0.85] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.9)]">
              <CertificateOfAuthenticity
                ref={docRef}
                artwork={artwork}
                collectorName={collectorName}
                certificateId={certId}
              />
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default CertificateDialog;

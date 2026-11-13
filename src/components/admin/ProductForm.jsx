import React, { useState, useEffect, useRef } from "react";
import { ImagePlus, ArrowLeft, Check } from "lucide-react";
import { addProduct, updateProduct, subscribeToCollections } from "../../services/firebaseService";
import { convertToWebp } from "../../lib/imageUtils";
import { Button, Field, inputClass, useAdminT } from "./AdminUI";

// Declared outside the form so a re-render of the form does not remount it
// (which used to reset its drag state mid-drop).
const ImageUploadSlot = ({ label, preview, onSelect, heightClass, changeLabel, dropLabel }) => {
  const fileInputRef = useRef(null);
  const [isDragActive, setIsDragActive] = useState(false);

  return (
    <div className="w-full">
      <span className="block mb-2 text-[12px] font-medium text-white/70">{label}</span>
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        onDragEnter={(e) => { e.preventDefault(); setIsDragActive(true); }}
        onDragOver={(e) => e.preventDefault()}
        onDragLeave={(e) => { e.preventDefault(); setIsDragActive(false); }}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragActive(false);
          const file = e.dataTransfer?.files?.[0];
          if (file) onSelect(file);
        }}
        className={`group relative w-full ${heightClass} rounded-[4px] border overflow-hidden transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light ${isDragActive ? 'border-primary-light bg-primary/10' : 'border-dashed border-white/20 bg-white/[0.02] hover:border-white/40'}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => onSelect(e.target.files?.[0])}
        />
        {preview ? (
          <>
            <img src={preview} alt="" className="absolute inset-0 w-full h-full object-cover" />
            <span className="absolute inset-0 bg-black/55 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 flex items-center justify-center gap-2 text-sm text-white transition-opacity duration-150">
              <ImagePlus size={16} /> {changeLabel}
            </span>
          </>
        ) : (
          <span className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-3 text-center text-white/45 group-hover:text-white/75 transition-colors">
            <ImagePlus size={22} strokeWidth={1.5} />
            <span className="text-[13px]">{dropLabel}</span>
          </span>
        )}
      </button>
    </div>
  );
};

const ProductForm = ({ product, onClose }) => {
  const at = useAdminT();
  const [collectionList, setCollectionsList] = useState([]);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    img: "",
    image: "",
    imageFile: null,
    img2: "",
    image2: "",
    imageFile2: null,
    img3: "",
    image3: "",
    imageFile3: null,
    collections: "",
    dimensions: "",
    material: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load collections
  useEffect(() => {
    const unsub = subscribeToCollections((data) => {
      const collections = new Set();
      data.forEach((item) => {
        if (typeof item.name === 'string' && item.name.trim() !== '') {
          collections.add(item.name.trim());
        }
      });
      setCollectionsList([...collections]);
    });

    return () => unsub();
  }, []);

  // Populate form if editing
  useEffect(() => {
    if (product) {
      setFormData({
        title: product.name || "",
        description: product.description || "",
        img: product.img || "",
        image: "",
        imageFile: null,
        img2: product.img2 || "",
        image2: "",
        imageFile2: null,
        img3: product.img3 || "",
        image3: "",
        imageFile3: null,
        collections: product.collections || "",
        dimensions: product.dimensions || "",
        material: product.material || ""
      });
    }
  }, [product]);

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleFileSelect = (file, index = 1) => {
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);

    const imageKey = index === 1 ? 'image' : `image${index}`;
    const fileKey = index === 1 ? 'imageFile' : `imageFile${index}`;

    setFormData((prev) => {
      if (prev[imageKey] && prev[fileKey]) URL.revokeObjectURL(prev[imageKey]);
      return { ...prev, [fileKey]: file, [imageKey]: previewUrl };
    });
  };

  const uploadImageObj = async (fileObj) => {
    if (!fileObj) return null;
    const formDataUpload = new FormData();
    formDataUpload.append("image", fileObj);

    const response = await fetch(`https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`, {
      method: "POST",
      body: formDataUpload,
    });

    const data = await response.json();
    if (data.success) {
      return data.data.url;
    }
    throw new Error(data.error?.message || "ImgBB upload failed");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title) return;

    setIsSubmitting(true);
    setError("");
    try {
      let imgUrl = formData.img;
      let imgUrl2 = formData.img2;
      let imgUrl3 = formData.img3;

      if (formData.imageFile) {
        const webpFile = await convertToWebp(formData.imageFile);
        imgUrl = await uploadImageObj(webpFile);
      }
      if (formData.imageFile2) {
        const webpFile2 = await convertToWebp(formData.imageFile2);
        imgUrl2 = await uploadImageObj(webpFile2);
      }
      if (formData.imageFile3) {
        const webpFile3 = await convertToWebp(formData.imageFile3);
        imgUrl3 = await uploadImageObj(webpFile3);
      }

      const productData = {
        name: formData.title,
        description: formData.description,
        img: imgUrl || "",
        img2: imgUrl2 || "",
        img3: imgUrl3 || "",
        collections: formData.collections,
        dimensions: formData.dimensions,
        material: formData.material
      };

      if (product?.id) {
        await updateProduct(product.id, productData);
      } else {
        await addProduct(productData);
      }

      onClose();
    } catch (err) {
      console.error("Failed to save product:", err);
      setError(at('saveError', { msg: err.message || '' }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const slot = (index, label, heightClass) => {
    const imageKey = index === 1 ? 'image' : `image${index}`;
    const imgKey = index === 1 ? 'img' : `img${index}`;
    return (
      <ImageUploadSlot
        label={label}
        preview={formData[imageKey] || formData[imgKey]}
        onSelect={(file) => handleFileSelect(file, index)}
        heightClass={heightClass}
        changeLabel={at('changeImage')}
        dropLabel={at('dropImage')}
      />
    );
  };

  const req = at('required');

  return (
    <section className="rounded-[6px] border border-white/10 bg-[#0b0b0b]">
      <header className="flex items-center gap-4 px-6 sm:px-8 pt-7 pb-6 border-b border-white/10">
        <Button variant="ghost" icon={ArrowLeft} onClick={onClose} disabled={isSubmitting} className="-ml-3 px-3">
          <span className="sr-only">{at('cancel')}</span>
        </Button>
        <h2 className="font-serif font-light text-3xl text-white">{product ? at('editWork') : at('newWork')}</h2>
      </header>

      <form onSubmit={handleSubmit} className="p-6 sm:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          <div className="lg:col-span-5 flex flex-col gap-4">
            {slot(1, `${at('mainImage')} *`, 'h-[300px] sm:h-[360px]')}
            <div className="grid grid-cols-2 gap-4">
              {slot(2, at('image2'), 'h-[150px]')}
              {slot(3, at('image3'), 'h-[150px]')}
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col gap-5">
            <Field label={at('fieldTitle')} required requiredLabel={req} htmlFor="pf-title">
              <input id="pf-title" value={formData.title} required placeholder={at('fieldTitlePh')} className={inputClass} onChange={(e) => handleChange("title", e.target.value)} />
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label={at('fieldSize')} htmlFor="pf-size">
                <input id="pf-size" value={formData.dimensions} placeholder={at('fieldSizePh')} className={inputClass} onChange={(e) => handleChange("dimensions", e.target.value)} />
              </Field>
              <Field label={at('fieldMedium')} htmlFor="pf-medium">
                <input id="pf-medium" value={formData.material} placeholder={at('fieldMediumPh')} className={inputClass} onChange={(e) => handleChange("material", e.target.value)} />
              </Field>
            </div>

            <div>
              <Field label={at('fieldCollection')} htmlFor="pf-collection">
                <select id="pf-collection" value={formData.collections} onChange={(e) => handleChange("collections", e.target.value)} className={`${inputClass} appearance-none cursor-pointer`}>
                  <option value="" className="bg-[#121212]">{at('noCollection')}</option>
                  {collectionList.filter((c) => c !== "All").map((c) => (
                    <option key={c} value={c} className="bg-[#121212]">{c}</option>
                  ))}
                </select>
              </Field>
            </div>

            <Field label={at('fieldDescription')} htmlFor="pf-desc">
              <textarea id="pf-desc" rows={5} value={formData.description} placeholder={at('fieldDescriptionPh')} className={`${inputClass} resize-y`} onChange={(e) => handleChange("description", e.target.value)} />
            </Field>
          </div>
        </div>

        {error && <p role="alert" className="mt-6 text-sm text-red-300">{error}</p>}

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-6 mt-8 border-t border-white/10">
          <Button variant="ghost" onClick={onClose} disabled={isSubmitting}>{at('cancel')}</Button>
          <Button type="submit" variant="accent" icon={Check} loading={isSubmitting}>
            {isSubmitting ? at('saving') : product ? at('save') : at('publish')}
          </Button>
        </div>
      </form>
    </section>
  );
};

export default ProductForm;

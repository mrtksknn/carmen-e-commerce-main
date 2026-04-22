import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "../ui/card";
import { db } from "../../firebase";
import { collection, onSnapshot, addDoc, updateDoc, doc, serverTimestamp } from "firebase/firestore";
import { Type, DollarSign, Maximize, Palette, Layers, AlignLeft, ImagePlus, CheckCircle2, X } from "lucide-react";

const ProductForm = ({ product, onClose }) => {
  const [collectionList, setCollectionsList] = useState([]);

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
    price: "",
    collections: "",
    dimensions: "",
    material: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load collections
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "collections"), (snapshot) => {
      const collections = new Set();

      snapshot.forEach((doc) => {
        const collectionName = doc.data().name;
        if (typeof collectionName === 'string' && collectionName.trim() !== '') {
          collections.add(collectionName.trim());
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
        price: product.price || "",
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

    if (formData[imageKey] && formData[fileKey]) {
      URL.revokeObjectURL(formData[imageKey]);
    }

    setFormData((prev) => ({
      ...prev,
      [fileKey]: file,
      [imageKey]: previewUrl
    }));
  };

  const uploadImageObj = async (fileObj) => {
    if (!fileObj) return null;
    const formDataUpload = new FormData();
    formDataUpload.append("image", fileObj);

    const response = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.REACT_APP_IMGBB_API_KEY}`, {
      method: "POST",
      body: formDataUpload,
    });

    const data = await response.json();
    if (data.success) {
      return data.data.url;
    } else {
      throw new Error(data.error?.message || "ImgBB upload failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { title, price } = formData;
    if (!title || !price) return; // Note: collections is no longer strictly required

    setIsSubmitting(true);
    try {
      let imgUrl = formData.img;
      let imgUrl2 = formData.img2;
      let imgUrl3 = formData.img3;

      if (formData.imageFile) imgUrl = await uploadImageObj(formData.imageFile);
      if (formData.imageFile2) imgUrl2 = await uploadImageObj(formData.imageFile2);
      if (formData.imageFile3) imgUrl3 = await uploadImageObj(formData.imageFile3);

      const productData = {
        name: formData.title,
        description: formData.description,
        img: imgUrl || "",
        img2: imgUrl2 || "",
        img3: imgUrl3 || "",
        price: formData.price,
        collections: formData.collections, // This may be an empty string now and that's okay
        dimensions: formData.dimensions,
        material: formData.material
      };

      if (product?.id) {
        await updateDoc(doc(db, "products", product.id), productData);
      } else {
        await addDoc(collection(db, "products"), {
          ...productData,
          timeStamp: serverTimestamp()
        });
      }

      onClose();
    } catch (err) {
      console.error("Failed to save product:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const ImageUploadSlot = ({ index, label, height }) => {
    const fileInputRef = useRef(null);
    const [isDragActive, setIsDragActive] = useState(false);

    const dragPropsLocal = {
      onDragEnter: (e) => { e.preventDefault(); setIsDragActive(true); },
      onDragOver: (e) => e.preventDefault(),
      onDragLeave: (e) => { e.preventDefault(); setIsDragActive(false); },
      onDrop: (e) => {
        e.preventDefault();
        setIsDragActive(false);
        const file = e.dataTransfer?.files?.[0];
        if (file) handleFileSelect(file, index);
      }
    };

    const imageKey = index === 1 ? 'image' : `image${index}`;
    const imgKey = index === 1 ? 'img' : `img${index}`;
    const preview = formData[imageKey] || formData[imgKey];

    return (
      <div className="relative space-y-2 w-full group">
        <span className="block text-sm font-medium text-gray-400 pl-1">{label}</span>
        <div
          {...dragPropsLocal}
          onClick={() => fileInputRef.current?.click()}
          className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-2xl ${height} bg-[#121212]/50 overflow-hidden cursor-pointer transition-all duration-300 hover:border-primary/50 hover:bg-[#1a1a1a]/80 ${isDragActive ? "border-primary bg-primary/10 shadow-[0_0_20px_rgba(120,34,34,0.3)] scale-[0.98]" : "border-gray-800"
            }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFileSelect(e.target.files?.[0], index)}
          />
          {preview ? (
            <div className="w-full h-full relative group/img">
              <img
                src={preview}
                alt="Upload preview"
                className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity duration-300">
                <span className="text-white text-sm font-medium bg-black/60 px-3 py-1.5 rounded-lg flex items-center gap-2 backdrop-blur-sm">
                  <ImagePlus size={16} /> Change Image
                </span>
              </div>
            </div>
          ) : (
            <div className="z-10 flex flex-col items-center text-gray-500 transition-colors group-hover:text-primary/80">
              <div className="p-3 bg-gray-900/50 rounded-full mb-3 shadow-inner group-hover:bg-primary/20 transition-colors">
                <ImagePlus size={24} strokeWidth={1.5} />
              </div>
              <span className="text-sm font-medium tracking-wide">Click or drag image</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <Card className="bg-[#0f0f0f]/90 border border-white/10 shadow-2xl w-full mx-auto backdrop-blur-xl relative overflow-hidden rounded-2xl">
      {/* Decorative background glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>

      <CardContent className="p-8 relative z-10">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
          <h2 className="text-3xl font-serif text-white tracking-wide flex items-center gap-3">
            {product ? "Update Product" : "Add New Product"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Upload Column */}
            <div className="flex flex-col gap-6">
              <ImageUploadSlot index={1} label="Main Image *" height="h-[280px]" />
              <div className="grid grid-cols-2 gap-4">
                <ImageUploadSlot index={2} label="Secondary Image" height="h-[140px]" />
                <ImageUploadSlot index={3} label="Tertiary Image" height="h-[140px]" />
              </div>
            </div>

            {/* Input Fields Column */}
            <div className="flex flex-col gap-5">

              <div className="space-y-1.5">
                <label htmlFor="title" className="flex items-center gap-2 text-sm font-medium text-gray-300 pl-1">
                  <Type size={16} className="text-primary/70" /> Title *
                </label>
                <div className="relative group/input">
                  <input
                    id="title"
                    value={formData.title}
                    required
                    placeholder="Enter artwork title"
                    className="w-full px-4 py-3 border border-gray-800 rounded-xl bg-[#141414] text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-sans placeholder:text-gray-600 shadow-inner"
                    onChange={(e) => handleChange("title", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="price" className="flex items-center gap-2 text-sm font-medium text-gray-300 pl-1">
                    <DollarSign size={16} className="text-primary/70" /> Price *
                  </label>
                  <input
                    id="price"
                    value={formData.price}
                    required
                    placeholder="$1,200"
                    className="w-full px-4 py-3 border border-gray-800 rounded-xl bg-[#141414] text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-sans placeholder:text-gray-600 shadow-inner"
                    onChange={(e) => handleChange("price", e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="dimensions" className="flex items-center gap-2 text-sm font-medium text-gray-300 pl-1">
                    <Maximize size={16} className="text-primary/70" /> Dimensions
                  </label>
                  <input
                    id="dimensions"
                    value={formData.dimensions}
                    placeholder={`24" x 36"`}
                    className="w-full px-4 py-3 border border-gray-800 rounded-xl bg-[#141414] text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-sans placeholder:text-gray-600 shadow-inner"
                    onChange={(e) => handleChange("dimensions", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="material" className="flex items-center gap-2 text-sm font-medium text-gray-300 pl-1">
                  <Palette size={16} className="text-primary/70" /> Medium / Material
                </label>
                <input
                  id="material"
                  value={formData.material}
                  placeholder="Oil on Canvas"
                  className="w-full px-4 py-3 border border-gray-800 rounded-xl bg-[#141414] text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-sans placeholder:text-gray-600 shadow-inner"
                  onChange={(e) => handleChange("material", e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="collections" className="flex items-center gap-2 text-sm font-medium text-gray-300 pl-1">
                  <Layers size={16} className="text-primary/70" /> Collection
                </label>
                <select
                  id="collections"
                  // Removed required flag so collection is truly optional
                  value={formData.collections}
                  onChange={(e) => handleChange("collections", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-800 rounded-xl bg-[#141414] text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-sans appearance-none shadow-inner"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%234b5563' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 1rem center',
                    backgroundSize: '1.2em'
                  }}
                >
                  <option value="" className="bg-[#121212] text-gray-400">
                    No Collection (Optional)
                  </option>
                  {collectionList
                    .filter((c) => c !== "All")
                    .map((c) => (
                      <option className="bg-[#121212] text-white py-2" key={c} value={c}>
                        {c}
                      </option>
                    ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="description" className="flex items-center gap-2 text-sm font-medium text-gray-300 pl-1">
                  <AlignLeft size={16} className="text-primary/70" /> Description
                </label>
                <textarea
                  id="description"
                  rows={4}
                  value={formData.description}
                  placeholder="Enter a detailed artwork description..."
                  className="w-full px-4 py-3 border border-gray-800 rounded-xl bg-[#141414] text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-sans placeholder:text-gray-600 shadow-inner resize-y"
                  onChange={(e) => handleChange("description", e.target.value)}
                />
              </div>

            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-white/5 mt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-8 py-3.5 rounded-xl border border-white/10 text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 transition-all font-medium order-2 sm:order-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-primary to-primary-hover text-white py-3.5 px-6 rounded-xl font-medium shadow-[0_0_20px_rgba(120,34,34,0.3)] hover:shadow-[0_0_25px_rgba(120,34,34,0.5)] transition-all hover:scale-[1.02] flex items-center justify-center gap-2 order-1 sm:order-2 disabled:opacity-70 disabled:hover:scale-100"
            >
              {isSubmitting ? (
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <CheckCircle2 size={18} />
                  {product ? "Update Product" : "Publish Product"}
                </>
              )}
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProductForm;

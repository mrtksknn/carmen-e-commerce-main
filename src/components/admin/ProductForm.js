import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "../ui/card";
import { db } from "../../firebase";
import { collection, onSnapshot, addDoc, updateDoc, doc, serverTimestamp } from "firebase/firestore";

const ProductForm = ({ product, onClose }) => {
  const inputRef = useRef(null);
  const [collectionList, setCollectionsList] = useState([]);
  const [dragActive, setDragActive] = useState(false);

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

  // Load collections
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "collections"), (snapshot) => {
      const collections = new Set();

      snapshot.forEach((doc) => {
        const collectionName = doc.data().name; // string bekleniyor
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

    const response = await fetch("https://api.imgbb.com/1/upload?key=a031dee68dfc850aab9c876c2cd88113", {
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
    const { title, price, collections } = formData;
    if (!title || !price || !collections) return;

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
        img: imgUrl,
        img2: imgUrl2,
        img3: imgUrl3,
        price: formData.price,
        collections: formData.collections,
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
      console.error("Ürün kaydedilemedi:", err);
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
      <div className="relative space-y-2 w-full">
        <span className="block text-sm font-medium text-gray-300">{label}</span>
        <div
          {...dragPropsLocal}
          onClick={() => fileInputRef.current?.click()}
          className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-xl ${height} bg-background-dark overflow-hidden cursor-pointer transition-all hover:bg-primary/5 ${
            isDragActive ? "border-primary bg-primary/10 scale-95" : "border-primary/30"
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
            <img
              src={preview}
              alt="Preview"
              className="absolute top-0 left-0 w-full h-full object-cover rounded-xl"
            />
          ) : (
            <div className="z-10 flex flex-col items-center text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="mb-2 text-primary/60">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
              </svg>
              <span className="text-xs font-medium tracking-wide">Upload</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <Card className="bg-[#0a0a0a] border-none shadow-none w-full max-w-4xl">
      <CardContent className="px-0 pb-0 pt-0">
        <div className="rounded-md shadow-sm">
          <h2 className="text-2xl font-serif text-white mb-6">
            {product ? "Update Product" : "Add Product"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Image Upload */}
              <div className="flex flex-col gap-4">
                <ImageUploadSlot index={1} label="Main Image *" height="h-[240px]" />
                <div className="grid grid-cols-2 gap-4">
                  <ImageUploadSlot index={2} label="Secondary Image" height="h-[144px]" />
                  <ImageUploadSlot index={3} label="Tertiary Image" height="h-[144px]" />
                </div>
              </div>

              {/* Input Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { id: "title", label: "Name *", placeholder: "Artwork title", required: true },
                  { id: "price", label: "Price *", placeholder: "$1,200", required: true },
                  { id: "dimensions", label: "Dimensions", placeholder: '24" x 36"' },
                  { id: "material", label: "Medium", placeholder: "Oil on Canvas", full: true }
                ].map(({ id, label, placeholder, required, full }) => (
                  <div key={id} className={`space-y-2 ${full ? "md:col-span-2" : ""}`}>
                    <label htmlFor={id} className="block text-sm font-medium text-gray-300">{label}</label>
                    <input
                      id={id}
                      value={formData[id]}
                      required={required}
                      placeholder={placeholder}
                      className="w-full px-4 py-3 border border-primary/30 rounded-lg bg-background-dark text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-gray-600"
                      onChange={(e) => handleChange(id, e.target.value)}
                    />
                  </div>
                ))}

                {/* Category */}
                <div className="space-y-2">
                  <label htmlFor="collections" className="block text-sm font-medium text-gray-300">Collections *</label>
                  <select
                    id="collections"
                    required
                    value={formData.collections}
                    onChange={(e) => handleChange("collections", e.target.value)}
                    className="w-full px-4 py-3 border border-primary/30 rounded-lg bg-background-dark text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  >
                    <option value="" disabled className="bg-[#121212]">
                      Select a collections
                    </option>
                    {collectionList
                      .filter((c) => c !== "All")
                      .map((c) => (
                        <option className="bg-[#121212] text-white" key={c} value={c}>
                          {c}
                        </option>
                      ))}
                  </select>
                </div>

                {/* Description */}
                <div className="space-y-2 md:col-span-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-300">Description</label>
                  <textarea
                    id="description"
                    rows={4}
                    value={formData.description}
                    placeholder="Enter artwork description"
                    className="w-full px-4 py-3 border border-primary/30 rounded-lg bg-background-dark text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-gray-600 resize-y"
                    onChange={(e) => handleChange("description", e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                className="flex-1 bg-primary text-white py-3 px-4 rounded-lg font-semibold hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5"
              >
                {product ? "Update Product" : "Add Product"}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 border border-primary/30 text-gray-300 hover:text-white py-3 px-4 rounded-lg hover:border-primary/60 hover:bg-primary/10 transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductForm;

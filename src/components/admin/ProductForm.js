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

  const handleFileSelect = (file) => {
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);

    if (formData.image && formData.imageFile) {
      URL.revokeObjectURL(formData.image);
    }

    setFormData((prev) => ({
      ...prev,
      imageFile: file,
      image: previewUrl
    }));
  };

  const uploadImage = async () => {
    const formDataUpload = new FormData();
    formDataUpload.append("image", formData.imageFile);

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
      if (formData.imageFile) {
        imgUrl = await uploadImage();
      }

      const productData = {
        name: formData.title,
        description: formData.description,
        img: imgUrl,
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

  const dragProps = {
    onDragEnter: (e) => {
      e.preventDefault();
      setDragActive(true);
    },
    onDragOver: (e) => {
      e.preventDefault();
    },
    onDragLeave: (e) => {
      e.preventDefault();
      setDragActive(false);
    },
    onDrop: (e) => {
      e.preventDefault();
      setDragActive(false);
      const file = e.dataTransfer?.files?.[0];
      if (file) handleFileSelect(file);
    }
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
              <div className="relative space-y-2">
                <div
                  {...dragProps}
                  onClick={() => inputRef.current?.click()}
                  className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-xl h-[400px] bg-background-dark overflow-hidden cursor-pointer transition-all hover:bg-primary/5 ${
                    dragActive ? "border-primary bg-primary/10 scale-95" : "border-primary/30"
                  }`}
                >
                  <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileSelect(e.target.files?.[0])}
                  />
                  {formData.image || formData.img ? (
                    <img
                      src={formData.image || formData.img}
                      alt="Preview"
                      className="absolute top-0 left-0 w-full h-full object-cover rounded-xl"
                    />
                  ) : (
                    <div className="z-10 flex flex-col items-center text-gray-500">
                      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="mb-3 text-primary/60">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="font-medium tracking-wide">Click or drag image to upload</span>
                      <span className="text-sm mt-1 opacity-70">JPG, PNG up to 10MB</span>
                    </div>
                  )}
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

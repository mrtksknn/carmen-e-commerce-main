import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "../ui/card";
import { db } from "../../firebase";
import { collection, onSnapshot, addDoc, updateDoc, doc, serverTimestamp } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

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
    const storage = getStorage();
    const storageRef = ref(storage, `product_images/${Date.now()}_${formData.imageFile.name}`);
    await uploadBytes(storageRef, formData.imageFile);
    return await getDownloadURL(storageRef);
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
    <Card style={{ borderColor: "rgba(229, 231, 235, 0.23)" }}>
      <CardContent className="pb-0">
        <div className="rounded-md py-5 px-0 shadow-sm">
          <h2 className="text-2xl font-semibold mb-6">
            {product ? "Update Product" : "Add Product"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Image Upload */}
              <div className="relative space-y-2">
                <div
                  {...dragProps}
                  onClick={() => inputRef.current?.click()}
                  className={`relative flex items-center justify-center border-2 border-dashed rounded-lg px-6 py-48 mt-1 bg-background overflow-hidden cursor-pointer transition-colors ${dragActive ? "border-primary bg-muted" : "border-border"
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
                      className="absolute top-0 left-0 w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <span className="z-10 text-muted-foreground text-center">
                      Drag and drop an image or click to upload
                    </span>
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
                    <label htmlFor={id}>{label}</label>
                    <input
                      id={id}
                      value={formData[id]}
                      required={required}
                      placeholder={placeholder}
                      className="bg-transparent w-full border rounded px-3 py-2 text-sm"
                      style={{ borderColor: "rgb(243 244 246 / 0.25)" }}
                      onChange={(e) => handleChange(id, e.target.value)}
                    />
                  </div>
                ))}

                {/* Category */}
                <div className="space-y-2">
                  <label htmlFor="collections">Collections *</label>
                  <select
                    id="collections"
                    required
                    value={formData.collections}
                    onChange={(e) => handleChange("collections", e.target.value)}
                    className="bg-transparent w-full border rounded px-3 py-2 text-sm"
                    style={{ borderColor: "rgb(243 244 246 / 0.25)" }}
                  >
                    <option value="" disabled>
                      Select a collections
                    </option>
                    {collectionList
                      .filter((c) => c !== "All")
                      .map((c) => (
                        <option className="text-black" key={c} value={c}>
                          {c}
                        </option>
                      ))}
                  </select>
                </div>

                {/* Description */}
                <div className="space-y-2 md:col-span-2">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    rows={4}
                    value={formData.description}
                    placeholder="Enter artwork description"
                    className="bg-transparent w-full border rounded px-3 py-2 text-sm"
                    style={{ borderColor: "rgb(243 244 246 / 0.25)" }}
                    onChange={(e) => handleChange("description", e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="flex-1 bg-white text-black py-2 px-4 rounded hover:bg-gray-800"
              >
                {product ? "Update Product" : "Add Product"}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 border border-gray-100/25 text-white-700 py-2 px-4 rounded hover:bg-red-500/25"
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

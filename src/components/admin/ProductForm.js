import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '../ui/card';

import { db } from "../../firebase";
import { collection, onSnapshot, addDoc, updateDoc, doc, serverTimestamp } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const ProductForm = ({ product, onClose }) => {
  const inputRef = useRef(null);
  const [categoryList, setCategoryList] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    imageFile: null,
    price: '',
    category: '',
    dimensions: '',
    material: '',
    img: '',
  });
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "products"),
      (snapshot) => {
        const categorySet = new Set();
        snapshot.docs.forEach((doc) => {
          const data = doc.data();
          if (data.category) categorySet.add(data.category);
        });
        setCategoryList([...Array.from(categorySet)]);
      },
      (error) => console.error("Kategori alınamadı:", error)
    );
    return () => unsub();
  }, []);

  useEffect(() => {
    if (product) {
      setFormData({
        title: product.name || '',
        description: product.description || '',
        img: product.img || '',
        price: product.price || '',
        category: product.category || '',
        dimensions: product.dimensions || '',
        material: product.material || '',
        image: '',
        imageFile: null,
      });
    }
  }, [product]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFile = (file) => {
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    if (formData.image && formData.imageFile) {
      URL.revokeObjectURL(formData.image);
    }
    setFormData((prev) => ({
      ...prev,
      image: objectUrl,
      imageFile: file,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.price || !formData.category) return;

    try {
      let imageUrl = formData.img || '';

      if (formData.imageFile) {
        const storage = getStorage();
        const storageRef = ref(storage, `product_images/${Date.now()}_${formData.imageFile.name}`);
        await uploadBytes(storageRef, formData.imageFile);
        imageUrl = await getDownloadURL(storageRef);
      }

      const productData = {
        name: formData.title,
        description: formData.description,
        img: imageUrl,
        price: formData.price,
        category: formData.category,
        dimensions: formData.dimensions,
        material: formData.material,
      };

      if (product?.id) {
        // 🛠️ Güncelleme işlemi
        const productRef = doc(db, "products", product.id);
        await updateDoc(productRef, productData);
      } else {
        // ➕ Yeni ürün ekleme
        await addDoc(collection(db, "products"), {
          ...productData,
          timeStamp: serverTimestamp(),
        });
      }

      onClose(); // Formu kapat
    } catch (error) {
      console.error("Ürün eklenirken/güncellenirken hata:", error);
    }
  };

  // Drag-n-drop
  const onDragEnter = (e) => {
    e.preventDefault(); e.stopPropagation(); setDragActive(true);
  };
  const onDragLeave = (e) => {
    e.preventDefault(); e.stopPropagation(); setDragActive(false);
  };
  const onDragOver = (e) => {
    e.preventDefault(); e.stopPropagation(); setDragActive(true);
  };
  const onDrop = (e) => {
    e.preventDefault(); e.stopPropagation(); setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };
  const onFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <Card style={{ borderColor: "rgba(229, 231, 235, 0.23)" }}>
      <CardContent className="pb-0">
        <div className="rounded-md py-5 px-0 shadow-sm">
          <h2 className="text-2xl font-semibold mb-6">
            {product ? 'Update Product' : 'Add Product'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6 border-none">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 relative">
                <div
                  className={`
                    relative flex items-center justify-center border-2 border-dashed rounded-lg px-6 py-48 mt-1
                    transition-colors bg-background overflow-hidden
                    ${dragActive ? "border-primary bg-muted" : "border-border"}
                    cursor-pointer
                  `}
                  onClick={() => inputRef.current?.click()}
                  onDragEnter={onDragEnter}
                  onDragOver={onDragOver}
                  onDragLeave={onDragLeave}
                  onDrop={onDrop}
                >
                  <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={onFileChange}
                  />
                  {formData.image || formData.img ? (
                    <img
                      src={formData.image || formData.img}
                      alt="Selected artwork"
                      className="absolute top-0 left-0 w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <span className="text-muted-foreground text-center z-10">
                      Drag and drop an image here, or click to select one
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="title">Name *</label>
                  <input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    placeholder="Enter artwork title"
                    required
                    style={{ borderColor: 'rgb(243 244 246 / 0.25)' }}
                    className="bg-transparent w-full border rounded px-3 py-2 text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="price">Price *</label>
                  <input
                    id="price"
                    value={formData.price}
                    onChange={(e) => handleChange('price', e.target.value)}
                    placeholder="$1,200"
                    required
                    style={{ borderColor: 'rgb(243 244 246 / 0.25)' }}
                    className="bg-transparent w-full border rounded px-3 py-2 text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="category">Category *</label>
                  <select
                    id="category"
                    value={formData.category}
                    style={{ borderColor: 'rgb(243 244 246 / 0.25)' }}
                    onChange={(e) => handleChange('category', e.target.value)}
                    className="bg-transparent w-full border rounded px-3 py-2 text-sm"
                  >
                    <option value="" disabled>
                      Select a category
                    </option>
                    {categoryList
                      .filter((cat) => cat !== 'All')
                      .map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="dimensions">Dimensions</label>
                  <input
                    id="dimensions"
                    value={formData.dimensions}
                    style={{ borderColor: 'rgb(243 244 246 / 0.25)' }}
                    onChange={(e) => handleChange('dimensions', e.target.value)}
                    placeholder='24" x 36"'
                    className="bg-transparent w-full border rounded px-3 py-2 text-sm"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label htmlFor="medium">Medium</label>
                  <input
                    id="medium"
                    value={formData.material}
                    style={{ borderColor: 'rgb(243 244 246 / 0.25)' }}
                    onChange={(e) => handleChange('material', e.target.value)}
                    placeholder="Oil on Canvas"
                    className="bg-transparent w-full border rounded px-3 py-2 text-sm"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    value={formData.description}
                    style={{ borderColor: 'rgb(243 244 246 / 0.25)' }}
                    onChange={(e) => handleChange('description', e.target.value)}
                    placeholder="Enter artwork description"
                    rows={4}
                    className="bg-transparent w-full border rounded px-3 py-2 text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="flex-1 bg-white text-black py-2 px-4 rounded hover:bg-gray-800"
              >
                {product ? 'Update Product' : 'Add Product'}
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

import React, { useState, useEffect, useRef } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

import { db } from "../../firebase";
import { collection, onSnapshot } from "firebase/firestore";

const ProductForm = ({ product, onClose, onSave }) => {

  const inputRef = useRef(null);
  const [categoryList, setCategoryList] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '', // Will store object URL if uploaded
    imageFile: null, // For the actual File object
    price: '',
    category: '',
    dimensions: '',
    medium: '',
    year: ''
  });
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "products"),
      (snapshot) => {
        const categorySet = new Set();

        snapshot.docs.forEach((doc) => {
          const data = doc.data();
          if (data.category) {
            categorySet.add(data.category);
          }
        });

        const categories = [...Array.from(categorySet)];
        setCategoryList(categories);
      },
      (error) => {
        console.error("Error fetching categories:", error);
      }
    );

    return () => unsub();
  }, []);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        img: product.img || '',
        price: product.price || '',
        category: product.category || '',
        dimensions: product.dimensions || '',
        material: product.material || '',
      });
    }
  }, [product]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title || !formData.price || !formData.category) {
      return;
    }

    console.log('Saving product:', formData);

    onSave(formData); // optional: pass form data if needed
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle dropped files
  const handleFile = (file) => {
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    if (formData.image && formData.imageFile) {
      URL.revokeObjectURL(formData.image);
    }
    setFormData(prev => ({
      ...prev,
      image: objectUrl,
      imageFile: file,
    }));
  };

  // Drag-n-drop handlers
  const onDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };
  const onDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };
  const onDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };
  const onDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
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
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6 border-none">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div className="space-y-2 relative">
                <div
                  id="image-upload"
                  className={`
                    relative flex items-center justify-center border-2 border-dashed rounded-lg px-6 py-48 mt-1
                    transition-colors bg-background overflow-hidden
                    ${dragActive ? "border-primary bg-muted" : "border-border"}
                    cursor-pointer
                  `}
                  tabIndex={0}
                  onClick={() => inputRef.current && inputRef.current.click()}
                  onDragEnter={onDragEnter}
                  onDragOver={onDragOver}
                  onDragLeave={onDragLeave}
                  onDrop={onDrop}
                  role="button"
                  aria-label="Upload image"
                >
                  <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={onFileChange}
                  />

                  {formData.img ? (
                    <img
                      src={formData.image}
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
                  <label htmlFor="title" className="block text-sm font-medium">
                    Name *
                  </label>
                  <input
                    id="title"
                    value={formData.name}
                    onChange={(e) => handleChange('title', e.target.value)}
                    placeholder="Enter artwork title"
                    required
                    className="bg-transparent w-full border rounded px-3 py-2 text-sm"
                    style={{ borderColor: 'rgba(229, 231, 235, 0.23)' }}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="price" className="block text-sm font-medium">
                    Price *
                  </label>
                  <input
                    id="price"
                    value={formData.price}
                    onChange={(e) => handleChange('price', e.target.value)}
                    placeholder="$1,200"
                    required
                    className="bg-transparent w-full border rounded px-3 py-2 text-sm"
                    style={{ borderColor: 'rgba(229, 231, 235, 0.23)' }}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="category" className="block text-sm font-medium">
                    Category *
                  </label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => handleChange('category', e.target.value)}
                    className="bg-transparent w-full border rounded px-3 py-2 text-sm"
                    style={{ borderColor: 'rgba(229, 231, 235, 0.23)' }}
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
                  <label htmlFor="dimensions" className="block text-sm font-medium">
                    Dimensions
                  </label>
                  <input
                    id="dimensions"
                    value={formData.dimensions}
                    onChange={(e) => handleChange('dimensions', e.target.value)}
                    placeholder='24" x 36"'
                    className="bg-transparent w-full border rounded px-3 py-2 text-sm"
                    style={{ borderColor: 'rgba(229, 231, 235, 0.23)' }}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label htmlFor="medium" className="block text-sm font-medium">
                    Medium
                  </label>
                  <input
                    id="medium"
                    value={formData.material}
                    onChange={(e) => handleChange('medium', e.target.value)}
                    placeholder="Oil on Canvas"
                    className="bg-transparent w-full border rounded px-3 py-2 text-sm"
                    style={{ borderColor: 'rgba(229, 231, 235, 0.23)' }}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label htmlFor="description" className="block text-sm font-medium">
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    placeholder="Enter artwork description"
                    rows={4}
                    className="bg-transparent w-full border rounded px-3 py-2 text-sm"
                    style={{ borderColor: 'rgba(229, 231, 235, 0.23)' }}
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

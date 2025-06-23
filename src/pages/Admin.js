import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import ProductList from "../components/admin/ProductList";
import ProductForm from "../components/admin/ProductForm";
import { Plus } from "lucide-react";

import { storage, db } from "../firebase";
import {
  getDownloadURL,
  uploadBytesResumable,
  ref as storageRef,
} from "firebase/storage";
import {
  collection,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
  deleteField,
} from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

import "../assets/styles/upload.css";

const initialState = {
  name: "",
  width: "",
  height: "",
  price: "",
  material: "",
  category: "",
  collections: "",
  description: "",
};

const Admin = () => {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Product form visibility and editing product
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // File upload and preview
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(null);

  // Product data
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState(initialState);

  // Auth: Prompt login if no current user
  useEffect(() => {
    const auth = getAuth();
    if (!auth.currentUser) {
      const email = prompt("Enter your email:");
      const password = prompt("Enter your password:");

      if (email && password) {
        signInWithEmailAndPassword(auth, email, password)
          .then(() => setIsAuthenticated(true))
          .catch((err) => {
            alert(`Login failed: ${err.message}`);
            window.location.href = "/";
          });
      } else {
        alert("Email and password are required.");
        window.location.href = "/";
      }
    } else {
      setIsAuthenticated(true);
    }
  }, []);

  // Fetch products realtime
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "products"),
      (snapshot) => {
        const productList = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .sort((a, b) => (b.timeStamp?.seconds || 0) - (a.timeStamp?.seconds || 0));
        setProducts(productList);
      },
      (error) => console.error(error)
    );
    return () => unsubscribe();
  }, []);

  // Upload file to Firebase Storage and update form data with image URL
  useEffect(() => {
    if (!file) return;

    const uploadFile = () => {
      const storageReference = storageRef(storage, file.name);
      const uploadTask = uploadBytesResumable(storageReference, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        console.error,
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
            setFormData((prev) => ({ ...prev, img: downloadUrl }));
          });
        }
      );
    };

    uploadFile();

    const previewUrl = URL.createObjectURL(file);
    setFilePreview(previewUrl);

    return () => URL.revokeObjectURL(previewUrl);
  }, [file]);

  // Handlers
  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowProductForm(true);
  };

  const handleDeleteProduct = async (id) => {
    try {
      await deleteDoc(doc(db, "products", id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleToggleStatus = async (product) => {
    try {
      const productRef = doc(db, "products", product.id);
      if (product.status) {
        await updateDoc(productRef, { status: deleteField() });
      } else {
        await updateDoc(productRef, { status: true });
      }
    } catch (err) {
      console.error("Toggle status error:", err);
    }
  };

  const handleCloseProductForm = () => {
    setShowProductForm(false);
    setEditingProduct(null);
  };

  // Prevent rendering content before auth
  if (!isAuthenticated) return null;

  return (
    <div className="flex flex-col items-center px-4">
      {/* Header */}
      <div className="text-center my-6">
        <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
        <p className="text-xl text-muted-foreground" style={{ color: "#94a3b8" }}>
          Manage your artworks and collections
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="products" className="w-full max-w-7xl">
        <TabsList className="grid w-full grid-cols-2 bg-red-500/50">
          <TabsTrigger
            className="text-white rounded-md data-[state=active]:bg-black data-[state=active]:text-white"
            value="products"
          >
            Products
          </TabsTrigger>
          <TabsTrigger
            className="text-white rounded-md data-[state=active]:bg-black data-[state=active]:text-white"
            value="collections"
          >
            Collections
          </TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-6 text-white">
          <Card style={{ borderColor: "rgba(229, 231, 235, 0.23)", width: "100%" }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-2">
              <div className="gap-2 flex flex-col">
                <CardTitle>Manage Products</CardTitle>
                <CardDescription style={{ color: "#94a3b8" }}>
                  Add, edit, and manage your artwork inventory
                </CardDescription>
              </div>
              <button
                onClick={() => setShowProductForm(true)}
                className="gap-2 flex items-center py-2 px-5 rounded-md bg-white text-black"
              >
                <Plus size={16} />
                Add Product
              </button>
            </CardHeader>

            <CardContent>
              {showProductForm ? (
                <ProductForm
                  product={editingProduct}
                  onClose={handleCloseProductForm}
                  onSave={handleCloseProductForm}
                  file={file}
                  setFile={setFile}
                  filePreview={filePreview}
                  progress={uploadProgress}
                  formData={formData}
                  setFormData={setFormData}
                />
              ) : (
                <ProductList
                  products={products}
                  onEdit={handleEditProduct}
                  onDelete={handleDeleteProduct}
                  onToggleStatus={handleToggleStatus}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="collections" className="space-y-6 text-white">
          COMING SOON
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;

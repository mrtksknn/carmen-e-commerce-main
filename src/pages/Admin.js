import React, { useState, useEffect } from "react";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from '../components/ui/card';
import {
  Tabs, TabsContent, TabsList, TabsTrigger
} from '../components/ui/tabs';
import ProductList from '../components/admin/ProductList';
import ProductForm from '../components/admin/ProductForm';
import { Plus } from 'lucide-react';

import { storage, db } from "../firebase";
import { getDownloadURL, uploadBytesResumable, ref } from "firebase/storage";
import { collection, onSnapshot, deleteDoc, doc, updateDoc, deleteField } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

import '../assets/styles/upload.css';

const initialState = {
  name: "", width: "", height: "", price: "",
  material: "", category: "", collections: "", description: ""
};

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [filePreview, setFilePreview] = useState(null);
  const [progress, setProgress] = useState(null);
  const [products, setProducts] = useState([]);
  const [file, setFile] = useState(null);
  const [data, setData] = useState(initialState);

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowProductForm(true);
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await deleteDoc(doc(db, "products", productId));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleCloseProductForm = () => {
    setShowProductForm(false);
    setEditingProduct(null);
  };

  const handleToggleStatus = async (product) => {
    try {
      const productRef = doc(db, "products", product.id);

      if (product.status) {
        // Sold durumundan çıkart: status alanını sil
        await updateDoc(productRef, {
          status: deleteField(),
        });
      } else {
        // Satılmamış ürünü "Sold" yap
        await updateDoc(productRef, {
          status: true,
        });
      }
    } catch (err) {
      console.error("Toggle status error:", err);
    }
  };

  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (!currentUser) {
      const email = prompt("Giriş için e-posta adresinizi girin:");
      const password = prompt("Şifrenizi girin:");

      if (email && password) {
        signInWithEmailAndPassword(auth, email, password)
          .then(() => {
            setIsAuthenticated(true);
          })
          .catch((error) => {
            alert("Giriş başarısız: " + error.message);
            // Başarısızsa yönlendirme veya boş sayfa
            window.location.href = "/";
          });
      } else {
        alert("E-posta ve şifre gereklidir.");
        window.location.href = "/";
      }
    } else {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "products"),
      (snapshot) => {
        let list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        list.sort((a, b) => b.timeStamp?.seconds - a.timeStamp?.seconds);
        setProducts(list);
      },
      (error) => {
        console.error(error);
      }
    );

    return () => unsub();
  }, []);

  useEffect(() => {
    const uploadFile = () => {
      const storageRef = ref(storage, file.name);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on("state_changed", (snapShot) => {
        const progress = (snapShot.bytesTransferred / snapShot.totalBytes) * 100;
        setProgress(progress);
      }, console.error,
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
            setData((prev) => ({ ...prev, img: downloadUrl }));
          });
        }
      );
    };

    if (file) {
      uploadFile();
      const objectUrl = URL.createObjectURL(file);
      setFilePreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [file]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex flex-col items-center">
      <div className="text-center my-6">
        <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
        <p className="text-xl text-muted-foreground" style={{ color: '#94a3b8' }}>
          Manage your artworks and collections
        </p>
      </div>

      <Tabs defaultValue="products" className="w-full max-w-7xl">
        <TabsList className="grid w-full grid-cols-2 bg-red-500/50">
          <TabsTrigger className="text-white rounded-md data-[state=active]:bg-black data-[state=active]:text-white" value="products">
            Products
          </TabsTrigger>
          <TabsTrigger className="text-white rounded-md data-[state=active]:bg-black data-[state=active]:text-white" value="collections">
            Collections
          </TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-6 text-white">
          <Card style={{ borderColor: "rgba(229, 231, 235, 0.23)" }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-2">
              <div className="gap-2 flex flex-col">
                <CardTitle>Manage Products</CardTitle>
                <CardDescription style={{ color: '#94a3b8' }}>
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

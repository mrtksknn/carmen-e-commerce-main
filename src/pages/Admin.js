import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import ProductList from "../components/admin/ProductList";
import ProductForm from "../components/admin/ProductForm";
import CollectionForm from "../components/admin/CollectionForm";
import { Plus } from "lucide-react";

import { db } from "../firebase";
import { collection, onSnapshot, deleteDoc, doc, updateDoc, deleteField } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

import "../assets/styles/upload.css";
import CollectionList from "../components/admin/CollectionList";

const initialState = {
  name: "",
  width: "",
  height: "",
  price: "",
  material: "",
  collections: "",
  description: "",
};

const Admin = () => {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Product form visibility and editing product
  const [showProductForm, setShowProductForm] = useState(false);
  const [showCollectionForm, setShowCollectionForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingCollection, setEditingCollection] = useState(null);

  // Product data
  const [products, setProducts] = useState([]);
  const [collections, setCollections] = useState([]);

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

  // Fetch collections realtime
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "collections"),
      (snapshot) => {
        const collectionList = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .sort((a, b) => (b.timeStamp?.seconds || 0) - (a.timeStamp?.seconds || 0));
        setCollections(collectionList);
      },
      (error) => console.error(error)
    );
    return () => unsubscribe();
  }, []);

  // Handlers for Products
  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowProductForm(true);
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
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

  // Handlers for Collections
  const handleEditCollection = (collectionData) => {
    setEditingCollection(collectionData);
    setShowCollectionForm(true);
  };

  const handleDeleteCollection = async (id) => {
    if (!window.confirm("Are you sure you want to delete this collection?")) return;
    try {
      await deleteDoc(doc(db, "collections", id));
    } catch (err) {
      console.error("Collection delete failed:", err);
    }
  };

  const handleCloseCollectionForm = () => {
    setShowCollectionForm(false);
    setEditingCollection(null);
  };

  // Prevent rendering content before auth
  if (!isAuthenticated) return null;

  return (
    <div className="flex flex-col items-center px-4 mt-8 pb-12">
      {/* Header */}
      <div className="text-center my-6">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-serif">Admin Dashboard</h1>
        <p className="text-xl text-gray-400 font-sans">
          Manage your artworks and collections
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="products" className="w-full max-w-7xl">
        <TabsList className="grid w-full grid-cols-2 bg-[#0a0a0a] rounded-xl border border-primary/20 mb-8 shadow-xl" style={{ height: "44px" }}>
          <TabsTrigger
            className="text-gray-400 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white transition-all py-3 font-medium"
            value="products"
          >
            Products
          </TabsTrigger>
          <TabsTrigger
            className="text-gray-400 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white transition-all py-3 font-medium"
            value="collections"
          >
            Collections
          </TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-6 text-white min-w-full">
          <Card className="bg-[#0a0a0a] border-primary/20 shadow-2xl w-full">
            <CardHeader className="flex flex-row flex-wrap md:flex-nowrap items-center justify-between gap-4 pb-4 pt-6">
              <div className="gap-2 flex flex-col">
                <CardTitle className="text-2xl font-serif text-white tracking-wide">Manage Products</CardTitle>
                <CardDescription className="text-gray-400 text-base">
                  Add, edit, and manage your artwork inventory
                </CardDescription>
              </div>
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setShowProductForm(true);
                }}
                className="gap-2 flex items-center py-2.5 px-6 rounded-lg bg-primary text-white hover:bg-primary-hover transition-all shadow-lg shadow-primary/20 hover:-translate-y-0.5 font-medium whitespace-nowrap"
              >
                <Plus size={18} />
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

        <TabsContent value="collections" className="space-y-6 text-white min-w-full">
          <Card className="bg-[#0a0a0a] border-primary/20 shadow-2xl w-full">
            <CardHeader className="flex flex-row flex-wrap md:flex-nowrap items-center justify-between gap-4 pb-4 pt-6">
              <div className="gap-2 flex flex-col">
                <CardTitle className="text-2xl font-serif text-white tracking-wide">Manage Collections</CardTitle>
                <CardDescription className="text-gray-400 text-base">
                  Create and organize your artwork collections
                </CardDescription>
              </div>
              <button
                onClick={() => {
                  setEditingCollection(null);
                  setShowCollectionForm(true);
                }}
                className="gap-2 flex items-center py-2.5 px-6 rounded-lg bg-primary text-white hover:bg-primary-hover transition-all shadow-lg shadow-primary/20 hover:-translate-y-0.5 font-medium whitespace-nowrap"
              >
                <Plus size={18} />
                Create Collection
              </button>
            </CardHeader>
            <CardContent>
              {showCollectionForm ? (
                <CollectionForm
                  collectionItem={editingCollection}
                  onClose={handleCloseCollectionForm}
                  onSave={handleCloseCollectionForm}
                />
              ) : (
                <div className="text-center text-muted-foreground w-full">
                  <CollectionList
                    products={collections}
                    allProducts={products}
                    onEdit={handleEditCollection}
                    onDelete={handleDeleteCollection}
                    onToggleStatus={handleToggleStatus}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;

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

  const generateSitemap = () => {
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
    
    // Projenizin Github Pages homepage adresi
    const baseUrl = "https://mrtksknn.github.io/carmen-e-commerce-main"; 
    
    // Statik Sayfalar
    const staticRoutes = ["", "/products", "/collections", "/about", "/contact"];
    staticRoutes.forEach(route => {
      xml += `  <url>\n    <loc>${baseUrl}${route}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>${route === "" ? "1.0" : "0.8"}</priority>\n  </url>\n`;
    });

    // Dinamik Eser/Ürün Sayfaları
    products.forEach(product => {
      xml += `  <url>\n    <loc>${baseUrl}/product/${product.id}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>0.6</priority>\n  </url>\n`;
    });

    xml += `</urlset>`;

    // Tarayıcı üzerinden dosyayı dinamik olarak indirtiyoruz
    const blob = new Blob([xml], { type: "application/xml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "sitemap.xml";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Prevent rendering content before auth
  if (!isAuthenticated) return null;

  return (
    <div className="flex flex-col items-center px-4 mt-8 pb-12">
      {/* Header */}
      <div className="text-center my-6 relative w-full flex flex-col items-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-serif">Admin Dashboard</h1>
        <p className="text-xl text-gray-400 font-sans mb-6">
          Manage your artworks and collections
        </p>
        
        <button 
          onClick={generateSitemap}
          className="bg-green-600/20 text-green-500 border border-green-600/50 px-6 py-2 rounded-lg text-sm font-medium hover:bg-green-600 hover:text-white transition-all shadow-[0_4px_20px_rgba(34,197,94,0.2)] md:absolute right-0 top-1/2 md:-translate-y-1/2 flex items-center gap-2"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
          Sitemap İndir
        </button>
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

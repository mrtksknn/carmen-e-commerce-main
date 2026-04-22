import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import ProductList from "../components/admin/ProductList";
import ProductForm from "../components/admin/ProductForm";
import CollectionForm from "../components/admin/CollectionForm";
import { Plus, Download, Mail, Key, LogIn, Database } from "lucide-react";

import { db } from "../firebase";
import { collection, onSnapshot, deleteDoc, doc, updateDoc, deleteField } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";

import "../assets/styles/upload.css";
import CollectionList from "../components/admin/CollectionList";

const Admin = () => {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Product form visibility and editing product
  const [showProductForm, setShowProductForm] = useState(false);
  const [showCollectionForm, setShowCollectionForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingCollection, setEditingCollection] = useState(null);

  // Product data
  const [products, setProducts] = useState([]);
  const [collections, setCollections] = useState([]);

  // Auth: Check login state
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      setIsAuthChecking(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    setIsLoggingIn(true);
    const auth = getAuth();
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      if (err.code === "auth/invalid-credential" || err.code === "auth/user-not-found" || err.code === "auth/wrong-password") {
        setLoginError("Invalid email or password.");
      } else {
        setLoginError("Failed to login. Please try again.");
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Fetch products realtime
  useEffect(() => {
    if (!isAuthenticated) return;
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
  }, [isAuthenticated]);

  // Fetch collections realtime
  useEffect(() => {
    if (!isAuthenticated) return;
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
  }, [isAuthenticated]);

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

  // Loading state
  if (isAuthChecking) {
    return (
      <div className="flex h-[80vh] items-center justify-center bg-background-dark">
        <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Pre-login state
  if (!isAuthenticated) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center px-4 relative overflow-hidden">
        {/* Decorative background blurs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="w-full max-w-md relative z-10 animate-fade-in">
          <Card className="bg-[#0f0f0f]/80 backdrop-blur-2xl border-primary/20 shadow-2xl overflow-hidden rounded-2xl relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-light via-primary to-primary-hover"></div>

            <CardHeader className="space-y-3 pt-8 pb-4 text-center">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 border border-primary/20 shadow-[0_0_20px_rgba(120,34,34,0.3)]">
                <Database className="text-primary w-8 h-8" />
              </div>
              <CardTitle className="text-3xl font-serif text-white tracking-wider">Admin Portal</CardTitle>
              <CardDescription className="text-gray-400 font-sans text-sm px-4">
                Enter your credentials to access the management dashboard
              </CardDescription>
            </CardHeader>

            <CardContent className="px-8 pb-10">
              <form onSubmit={handleLogin} className="space-y-6">
                {loginError && (
                  <div className="p-3 bg-red-900/30 border border-red-500/50 rounded-lg flex items-center gap-3 text-red-200 text-sm animate-pulse-once">
                    <span className="flex-shrink-0 bg-red-500/20 p-1 rounded-full">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12" /></svg>
                    </span>
                    {loginError}
                  </div>
                )}

                <div className="space-y-4">
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-focus-within:text-primary transition-colors">
                      <Mail size={18} />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email Address"
                      className="w-full pl-10 pr-4 py-3.5 bg-[#171717] border border-gray-800 rounded-xl focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 text-white placeholder-gray-600 transition-all font-sans text-sm shadow-inner"
                      required
                    />
                  </div>

                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-focus-within:text-primary transition-colors">
                      <Key size={18} />
                    </div>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      className="w-full pl-10 pr-4 py-3.5 bg-[#171717] border border-gray-800 rounded-xl focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 text-white placeholder-gray-600 transition-all font-sans text-sm shadow-inner"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-gradient-to-r from-primary to-primary-hover text-white rounded-xl font-medium tracking-wide hover:shadow-[0_0_20px_rgba(120,34,34,0.4)] transition-all hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100 mt-2"
                >
                  {isLoggingIn ? (
                    <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <LogIn size={18} />
                      Sign In
                    </>
                  )}
                </button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Dashboard state
  return (
    <div className="flex flex-col items-center px-4 mt-8 pb-12 w-full animate-fade-in relative z-10">

      {/* Decorative background element for the whole dashboard */}
      <div className="fixed top-0 left-0 right-0 h-96 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none z-0"></div>

      {/* Header section with rich aesthetics */}
      <div className="my-8 relative w-full flex flex-col md:flex-row items-center justify-between max-w-7xl px-4 z-10 gap-6 glass-header bg-[#0f0f0f]/50 py-6 rounded-2xl border border-white/5 backdrop-blur-lg shadow-xl">
        <div className="flex flex-col text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 font-serif tracking-wide mb-2">
            Admin Dashboard
          </h1>
          <p className="text-lg text-gray-400 font-sans flex items-center justify-center md:justify-start gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Manage your artworks and collections
          </p>
        </div>

        <button
          onClick={generateSitemap}
          className="group relative flex items-center gap-2 overflow-hidden rounded-xl bg-[#141414] px-6 py-3 font-medium text-gray-300 border border-gray-800 hover:border-green-600/50 hover:text-white transition-all shadow-lg hover:shadow-[0_0_20px_rgba(34,197,94,0.15)]"
        >
          <div className="absolute inset-0 w-0 bg-green-600/20 transition-all duration-[250ms] ease-out group-hover:w-full"></div>
          <Download size={18} className="relative z-10 group-hover:text-green-500 transition-colors" />
          <span className="relative z-10">Download Sitemap</span>
        </button>
      </div>

      {/* Tabs / Segmented Control */}
      <Tabs defaultValue="products" className="w-full max-w-7xl z-10 mt-2">
        <div className="flex justify-center md:justify-start mb-8 px-4">
          <TabsList className="inline-flex items-center p-1.5 bg-[#0a0a0a]/80 backdrop-blur-xl rounded-xl border border-white/10 shadow-lg">
            <TabsTrigger
              className="text-gray-400 rounded-lg px-8 py-2.5 font-medium transition-all duration-300 data-[state=active]:bg-primary/90 data-[state=active]:text-white data-[state=active]:shadow-lg"
              value="products"
            >
              Products
            </TabsTrigger>
            <TabsTrigger
              className="text-gray-400 rounded-lg px-8 py-2.5 font-medium transition-all duration-300 data-[state=active]:bg-primary/90 data-[state=active]:text-white data-[state=active]:shadow-lg"
              value="collections"
            >
              Collections
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="products" className="space-y-6 text-white min-w-full px-4 mt-0 focus-visible:outline-none">
          <Card className="bg-[#0f0f0f]/70 backdrop-blur-md border-white/10 shadow-2xl w-full rounded-2xl overflow-hidden transition-all hover:border-white/20 duration-500">
            <CardHeader className="flex flex-col md:flex-row items-center justify-between gap-4 pb-6 pt-8 px-8 bg-gradient-to-b from-[#1a1a1a]/40 to-transparent border-b border-white/5">
              <div className="gap-2 flex flex-col text-center md:text-left">
                <CardTitle className="text-3xl font-serif text-white tracking-wide">Product Inventory</CardTitle>
                <CardDescription className="text-gray-400 text-base">
                  Add, edit, and organize your showcase artworks.
                </CardDescription>
              </div>
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setShowProductForm(true);
                }}
                className="gap-2 flex items-center py-3 px-6 rounded-xl bg-primary text-white hover:bg-primary-hover transition-all shadow-[0_0_15px_rgba(120,34,34,0.3)] hover:shadow-[0_0_25px_rgba(120,34,34,0.5)] hover:-translate-y-0.5 font-medium mt-2 md:mt-0"
              >
                <Plus size={18} />
                Add New Product
              </button>
            </CardHeader>

            <CardContent className="p-8">
              {showProductForm ? (
                <div className="animate-fade-in bg-[#0a0a0a] border-white/5">
                  <ProductForm
                    product={editingProduct}
                    onClose={handleCloseProductForm}
                    onSave={handleCloseProductForm}
                  />
                </div>
              ) : (
                <div className="animate-fade-in">
                  <ProductList
                    products={products}
                    onEdit={handleEditProduct}
                    onDelete={handleDeleteProduct}
                    onToggleStatus={handleToggleStatus}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="collections" className="space-y-6 text-white min-w-full px-4 mt-0 focus-visible:outline-none">
          <Card className="bg-[#0f0f0f]/70 backdrop-blur-md border-white/10 shadow-2xl w-full rounded-2xl overflow-hidden transition-all hover:border-white/20 duration-500">
            <CardHeader className="flex flex-col md:flex-row items-center justify-between gap-4 pb-6 pt-8 px-8 bg-gradient-to-b from-[#1a1a1a]/40 to-transparent border-b border-white/5">
              <div className="gap-2 flex flex-col text-center md:text-left">
                <CardTitle className="text-3xl font-serif text-white tracking-wide">Collection Management</CardTitle>
                <CardDescription className="text-gray-400 text-base">
                  Group your artworks into beautiful distinct collections.
                </CardDescription>
              </div>
              <button
                onClick={() => {
                  setEditingCollection(null);
                  setShowCollectionForm(true);
                }}
                className="gap-2 flex items-center py-3 px-6 rounded-xl bg-primary text-white hover:bg-primary-hover transition-all shadow-[0_0_15px_rgba(120,34,34,0.3)] hover:shadow-[0_0_25px_rgba(120,34,34,0.5)] hover:-translate-y-0.5 font-medium mt-2 md:mt-0"
              >
                <Plus size={18} />
                Create Collection
              </button>
            </CardHeader>

            <CardContent className="p-8">
              {showCollectionForm ? (
                <div className="animate-fade-in bg-[#0a0a0a] rounded-2xl p-6 border border-white/5">
                  <CollectionForm
                    collectionItem={editingCollection}
                    onClose={handleCloseCollectionForm}
                    onSave={handleCloseCollectionForm}
                  />
                </div>
              ) : (
                <div className="text-center text-muted-foreground w-full animate-fade-in">
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

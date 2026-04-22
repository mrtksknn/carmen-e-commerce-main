import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import ProductList from "./ProductList";
import ProductForm from "./ProductForm";
import CollectionForm from "./CollectionForm";
import CollectionList from "./CollectionList";
import { Plus, Download } from "lucide-react";
import { APP_CONFIG } from "../../lib/constants";
import { deleteProduct, updateProduct, deleteCollection } from "../../services/firebaseService";
import { deleteField, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";

const AdminDashboard = ({ products, collections }) => {
  const [showProductForm, setShowProductForm] = useState(false);
  const [showCollectionForm, setShowCollectionForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingCollection, setEditingCollection] = useState(null);

  // Handlers for Products
  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowProductForm(true);
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await deleteProduct(id);
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
      await deleteCollection(id);
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

    const baseUrl = APP_CONFIG.SITEMAP_BASE_URL;

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

  return (
    <div className="flex flex-col items-center px-4 mt-8 pb-12 w-full animate-fade-in relative z-10">
      <div className="fixed top-0 left-0 right-0 h-96 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none z-0"></div>

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

export default AdminDashboard;

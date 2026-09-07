import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import ProductList from "./ProductList";
import ProductForm from "./ProductForm";
import CollectionForm from "./CollectionForm";
import CollectionList from "./CollectionList";
import InquiryList from "./InquiryList";
import AdminStats from "./AdminStats";
import { Plus, Download, MessageSquare, LayoutGrid, Layers } from "lucide-react";
import { APP_CONFIG } from "../../lib/constants";
import { deleteProduct, updateProduct, deleteCollection, subscribeToInquiries } from "../../services/firebaseService";

const AdminDashboard = ({ products, collections }) => {
  const [showProductForm, setShowProductForm] = useState(false);
  const [showCollectionForm, setShowCollectionForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingCollection, setEditingCollection] = useState(null);
  const [inquiries, setInquiries] = useState([]);

  useEffect(() => {
    const unsubscribe = subscribeToInquiries((data) => setInquiries(data));
    return () => unsubscribe();
  }, []);

  // ... (previous handlers remain same) ...
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
      const newStatus = !product.status;
      await updateProduct(product.id, { status: newStatus || null });
    } catch (err) {
      console.error("Toggle status error:", err);
    }
  };

  const handleCloseProductForm = () => {
    setShowProductForm(false);
    setEditingProduct(null);
  };

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
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
    const baseUrl = APP_CONFIG.SITEMAP_BASE_URL;
    ["", "/products", "/collections", "/about", "/contact"].forEach(route => {
      xml += `  <url>\n    <loc>${baseUrl}${route}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>${route === "" ? "1.0" : "0.8"}</priority>\n  </url>\n`;
    });
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

      {/* Hero / Header Section */}
      <div className="my-8 relative w-full flex flex-col md:flex-row items-center justify-between max-w-7xl px-4 z-10 gap-6 glass-header bg-[#0f0f0f]/50 py-8 rounded-3xl border border-white/5 backdrop-blur-lg shadow-xl">
        <div className="flex flex-col text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 font-serif tracking-wide mb-2">
            Executive Dashboard
          </h1>
          <p className="text-lg text-gray-400 font-sans flex items-center justify-center md:justify-start gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Intelligence & Management Hub
          </p>
        </div>

        <button
          onClick={generateSitemap}
          className="group relative flex items-center gap-2 overflow-hidden rounded-xl bg-[#141414] px-6 py-3 font-medium text-gray-300 border border-gray-800 hover:border-green-600/50 hover:text-white transition-all shadow-lg hover:shadow-[0_0_20px_rgba(34,197,94,0.15)]"
        >
          <div className="absolute inset-0 w-0 bg-green-600/20 transition-all duration-[250ms] ease-out group-hover:w-full"></div>
          <Download size={18} className="relative z-10 group-hover:text-green-500 transition-colors" />
          <span className="relative z-10">Sitemap</span>
        </button>
      </div>

      <div className="w-full max-w-7xl px-4 z-10">
        {/* Analytics Section */}
        <AdminStats products={products} inquiries={inquiries} />

        <Tabs defaultValue="products" className="w-full">
          <div className="flex justify-center md:justify-start mb-8">
            <TabsList className="inline-flex items-center p-1.5 bg-surface/80 backdrop-blur-xl rounded-2xl border border-white/10 shadow-lg">
              <TabsTrigger
                className="text-gray-400 rounded-xl px-8 py-3 font-medium transition-all duration-300 data-[state=active]:bg-primary/90 data-[state=active]:text-white data-[state=active]:shadow-lg flex items-center gap-2"
                value="products"
              >
                <LayoutGrid size={16} />
                Products
              </TabsTrigger>
              <TabsTrigger
                className="text-gray-400 rounded-xl px-8 py-3 font-medium transition-all duration-300 data-[state=active]:bg-primary/90 data-[state=active]:text-white data-[state=active]:shadow-lg flex items-center gap-2"
                value="collections"
              >
                <Layers size={16} />
                Collections
              </TabsTrigger>
              <TabsTrigger
                className="text-gray-400 rounded-xl px-8 py-3 font-medium transition-all duration-300 data-[state=active]:bg-primary/90 data-[state=active]:text-white data-[state=active]:shadow-lg flex items-center gap-2"
                value="inquiries"
              >
                <div className="relative">
                  <MessageSquare size={16} />
                  {inquiries.length > 0 && (
                    <span className="absolute -top-2 -right-2 w-2 h-2 bg-white rounded-full"></span>
                  )}
                </div>
                Inquiries
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="products" className="animate-in fade-in slide-in-from-bottom-4 duration-500 focus-visible:outline-none">
            <Card className="bg-[#0f0f0f]/70 backdrop-blur-md border-white/10 shadow-2xl rounded-3xl overflow-hidden transition-all hover:border-white/20">
              <CardHeader className="flex flex-col md:flex-row items-center justify-between gap-4 pb-6 pt-8 px-8 border-b border-white/5 bg-white/[0.02]">
                <div className="gap-2 flex flex-col text-center md:text-left">
                  <CardTitle className="text-3xl font-serif text-white tracking-wide">Product Inventory</CardTitle>
                  <CardDescription className="text-gray-400 text-base">
                    Manage and curate your gallery masterworks.
                  </CardDescription>
                </div>
                <button
                  onClick={() => {
                    setEditingProduct(null);
                    setShowProductForm(true);
                  }}
                  className="gap-2 flex items-center py-3 px-8 rounded-xl bg-primary text-white hover:bg-primary-hover transition-all shadow-xl hover:-translate-y-0.5 font-bold uppercase tracking-widest text-[10px]"
                >
                  <Plus size={18} />
                  Add New
                </button>
              </CardHeader>

              <CardContent className="p-8">
                {showProductForm ? (
                  <ProductForm product={editingProduct} onClose={handleCloseProductForm} onSave={handleCloseProductForm} />
                ) : (
                  <ProductList products={products} onEdit={handleEditProduct} onDelete={handleDeleteProduct} onToggleStatus={handleToggleStatus} />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="collections" className="animate-in fade-in slide-in-from-bottom-4 duration-500 focus-visible:outline-none">
            <Card className="bg-[#0f0f0f]/70 backdrop-blur-md border-white/10 shadow-2xl rounded-3xl overflow-hidden transition-all hover:border-white/20">
              <CardHeader className="flex flex-col md:flex-row items-center justify-between gap-4 pb-6 pt-8 px-8 border-b border-white/5 bg-white/[0.02]">
                <div className="gap-2 flex flex-col text-center md:text-left">
                  <CardTitle className="text-3xl font-serif text-white tracking-wide">Collections</CardTitle>
                  <CardDescription className="text-gray-400 text-base">
                    Organize artworks into curated series.
                  </CardDescription>
                </div>
                <button
                  onClick={() => {
                    setEditingCollection(null);
                    setShowCollectionForm(true);
                  }}
                  className="gap-2 flex items-center py-3 px-8 rounded-xl bg-primary text-white hover:bg-primary-hover transition-all shadow-xl hover:-translate-y-0.5 font-bold uppercase tracking-widest text-[10px]"
                >
                  <Plus size={18} />
                  Create
                </button>
              </CardHeader>
              <CardContent className="p-8">
                {showCollectionForm ? (
                  <CollectionForm collectionItem={editingCollection} onClose={handleCloseCollectionForm} onSave={handleCloseCollectionForm} />
                ) : (
                  <CollectionList products={collections} allProducts={products} onEdit={handleEditCollection} onDelete={handleDeleteCollection} onToggleStatus={handleToggleStatus} />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inquiries" className="animate-in fade-in slide-in-from-bottom-4 duration-500 focus-visible:outline-none">
            <Card className="bg-[#0f0f0f]/70 backdrop-blur-md border-white/10 shadow-2xl rounded-3xl overflow-hidden transition-all hover:border-white/20">
              <CardHeader className="pb-6 pt-8 px-8 border-b border-white/5 bg-white/[0.02]">
                <CardTitle className="text-3xl font-serif text-white tracking-wide">Client Inquiries</CardTitle>
                <CardDescription className="text-gray-400 text-base">
                  Direct communication leads from your collectors.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <InquiryList />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;

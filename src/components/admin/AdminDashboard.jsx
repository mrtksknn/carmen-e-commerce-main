import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import * as Tabs from "@radix-ui/react-tabs";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Plus, Download, LogOut, ArrowUpRight } from "lucide-react";
import ProductList from "./ProductList";
import ProductForm from "./ProductForm";
import CollectionForm from "./CollectionForm";
import CollectionList from "./CollectionList";
import InquiryList from "./InquiryList";
import AdminStats from "./AdminStats";
import SettingsPanel from "./SettingsPanel";
import Logo from "../ui/Logo";
import { Button, Panel, useAdminT } from "./AdminUI";
import { APP_CONFIG } from "../../lib/constants";
import { deleteProduct, updateProduct, deleteCollection, subscribeToInquiries } from "../../services/firebaseService";

const AdminDashboard = ({ products, collections, onLogout }) => {
  const at = useAdminT();
  const reduce = useReducedMotion();
  const [tab, setTab] = useState("products");
  const [showProductForm, setShowProductForm] = useState(false);
  const [showCollectionForm, setShowCollectionForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingCollection, setEditingCollection] = useState(null);
  const [inquiries, setInquiries] = useState([]);

  useEffect(() => {
    const unsubscribe = subscribeToInquiries((data) => setInquiries(data));
    return () => unsubscribe();
  }, []);

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowProductForm(true);
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm(at('confirmDeleteWork'))) return;
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
    if (!window.confirm(at('confirmDeleteCollection'))) return;
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

  const pendingCount = inquiries.filter(i => i.status !== 'replied').length;
  const tabs = [
    { value: "products", label: at('tabWorks'), count: products.length },
    { value: "collections", label: at('tabCollections'), count: collections.length },
    { value: "inquiries", label: at('tabInquiries'), count: pendingCount, alert: pendingCount > 0 },
    { value: "settings", label: at('tabSettings') },
  ];

  const panelMotion = {
    initial: { opacity: 0, y: reduce ? 0 : 6 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0 },
    transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1] },
  };

  return (
    <div className="min-h-[100svh] bg-background text-white">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-background/95">
        <div className="max-w-7xl mx-auto h-16 px-4 sm:px-6 flex items-center gap-4">
          <Link to="/" aria-label={at('viewSite')} className="shrink-0">
            <Logo className="text-white/90 scale-90 origin-left" />
          </Link>
          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            <Link
              to="/"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 h-9 px-3 rounded-full text-[13px] text-white/60 hover:text-white hover:bg-white/[0.06] transition-colors"
            >
              {at('viewSite')}
              <ArrowUpRight size={14} />
            </Link>
            <Button variant="ghost" icon={LogOut} onClick={onLogout} className="h-9 px-3">
              <span className="hidden sm:inline">{at('logout')}</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h1 className="font-serif font-light text-5xl text-white">{at('dashTitle')}</h1>
            <p className="mt-2 text-sm text-white/50">{at('dashSubtitle')}</p>
          </div>
          <Button variant="secondary" icon={Download} onClick={generateSitemap}>
            {at('sitemap')}
          </Button>
        </div>

        <AdminStats products={products} inquiries={inquiries} />

        <Tabs.Root value={tab} onValueChange={setTab}>
          <Tabs.List className="flex gap-8 border-b border-white/10 mb-8 overflow-x-auto">
            {tabs.map((tb) => (
              <Tabs.Trigger
                key={tb.value}
                value={tb.value}
                className="relative pb-4 text-[15px] text-white/50 hover:text-white/80 data-[state=active]:text-white transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:text-white"
              >
                {tb.label}
                {tb.count !== undefined && (
                  <span className={`ml-2 text-[12px] tabular-nums ${tb.alert ? 'text-amber-200/90' : 'text-white/35'}`}>{tb.count}</span>
                )}
                {tab === tb.value && (
                  <motion.span
                    layoutId="admin-tab-rule"
                    className="absolute left-0 right-0 -bottom-px h-px bg-primary-light"
                    transition={{ duration: reduce ? 0 : 0.3, ease: [0.16, 1, 0.3, 1] }}
                  />
                )}
              </Tabs.Trigger>
            ))}
          </Tabs.List>

          <AnimatePresence mode="wait">
            {tab === "products" && (
              <Tabs.Content value="products" forceMount asChild>
                <motion.div key="products" {...panelMotion}>
                  {showProductForm ? (
                    <ProductForm product={editingProduct} onClose={handleCloseProductForm} onSave={handleCloseProductForm} />
                  ) : (
                    <Panel
                      title={at('worksTitle')}
                      description={at('worksDesc')}
                      action={
                        <Button icon={Plus} onClick={() => { setEditingProduct(null); setShowProductForm(true); }}>
                          {at('addWork')}
                        </Button>
                      }
                    >
                      <ProductList products={products} onEdit={handleEditProduct} onDelete={handleDeleteProduct} onToggleStatus={handleToggleStatus} />
                    </Panel>
                  )}
                </motion.div>
              </Tabs.Content>
            )}

            {tab === "collections" && (
              <Tabs.Content value="collections" forceMount asChild>
                <motion.div key="collections" {...panelMotion}>
                  <Panel
                    title={showCollectionForm ? (editingCollection ? at('editCollection') : at('newCollection')) : at('collectionsTitle')}
                    description={showCollectionForm ? null : at('collectionsDesc')}
                    action={!showCollectionForm && (
                      <Button icon={Plus} onClick={() => { setEditingCollection(null); setShowCollectionForm(true); }}>
                        {at('addCollection')}
                      </Button>
                    )}
                  >
                    {showCollectionForm ? (
                      <CollectionForm collectionItem={editingCollection} onClose={handleCloseCollectionForm} onSave={handleCloseCollectionForm} />
                    ) : (
                      <CollectionList products={collections} allProducts={products} onEdit={handleEditCollection} onDelete={handleDeleteCollection} />
                    )}
                  </Panel>
                </motion.div>
              </Tabs.Content>
            )}

            {tab === "inquiries" && (
              <Tabs.Content value="inquiries" forceMount asChild>
                <motion.div key="inquiries" {...panelMotion}>
                  <Panel title={at('inquiriesTitle')} description={at('inquiriesDesc')}>
                    <InquiryList products={products} />
                  </Panel>
                </motion.div>
              </Tabs.Content>
            )}

            {tab === "settings" && (
              <Tabs.Content value="settings" forceMount asChild>
                <motion.div key="settings" {...panelMotion}>
                  <Panel title={at('settingsTitle')} description={at('settingsDesc')}>
                    <SettingsPanel />
                  </Panel>
                </motion.div>
              </Tabs.Content>
            )}
          </AnimatePresence>
        </Tabs.Root>
      </main>
    </div>
  );
};

export default AdminDashboard;

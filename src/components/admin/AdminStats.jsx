import React from "react";
import { Package, ShoppingCart, MessageSquare, TrendingUp } from "lucide-react";

const AdminStats = ({ products, inquiries = [] }) => {
  const totalArtworks = products.length;
  const soldArtworks = products.filter(p => p.status === true).length;
  const activeArtworks = totalArtworks - soldArtworks;
  const totalInquiries = inquiries.length;

  const stats = [
    {
      label: "Total Artworks",
      value: totalArtworks,
      icon: Package,
      color: "blue",
      desc: `${activeArtworks} active on gallery`
    },
    {
      label: "Sold Masterworks",
      value: soldArtworks,
      icon: ShoppingCart,
      color: "green",
      desc: "Success rate: " + (totalArtworks > 0 ? Math.round((soldArtworks / totalArtworks) * 100) : 0) + "%"
    },
    {
      label: "Client Inquiries",
      value: totalInquiries,
      icon: MessageSquare,
      color: "primary",
      desc: "All-time concierge leads"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
      {stats.map((stat, idx) => (
        <div 
          key={idx} 
          className="bg-[#0f0f0f]/50 backdrop-blur-xl border border-white/5 rounded-3xl p-6 hover:border-white/10 transition-all group"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className={`p-3 rounded-2xl bg-${stat.color === 'primary' ? 'primary' : stat.color + '-500'}/10 text-${stat.color === 'primary' ? 'primary' : stat.color + '-500'}`}>
              <stat.icon size={20} />
            </div>
            <h4 className="text-gray-400 text-[11px] font-bold uppercase tracking-[0.2em]">{stat.label}</h4>
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-serif text-white">{stat.value}</span>
          </div>
          <p className="text-[10px] text-gray-600 mt-2 font-medium">{stat.desc}</p>
        </div>
      ))}
    </div>
  );
};

export default AdminStats;

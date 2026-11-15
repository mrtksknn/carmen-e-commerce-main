import React from "react";
import { useAdminT } from "./AdminUI";

const AdminStats = ({ products }) => {
  const at = useAdminT();
  const total = products.length;
  const sold = products.filter(p => p.status === true).length;
  const available = total - sold;
  const rate = total > 0 ? Math.round((sold / total) * 100) : 0;

  const stats = [
    { label: at('statWorks'), value: total, note: at('statWorksNote', { n: available }) },
    { label: at('statSold'), value: sold, note: at('statSoldNote', { n: rate }) },
  ];

  return (
    <dl className="grid grid-cols-1 sm:grid-cols-2 border-y border-white/10 divide-y sm:divide-y-0 sm:divide-x divide-white/10 mb-10">
      {stats.map((s) => (
        <div key={s.label} className="py-6 sm:px-8 first:sm:pl-0">
          <dt className="text-[12px] font-medium text-white/55">{s.label}</dt>
          <dd className="mt-2 font-serif font-light text-5xl text-white lining-nums tabular-nums">{s.value}</dd>
          <dd className={`mt-1 text-[13px] ${s.alert ? 'text-amber-200/90' : 'text-white/45'}`}>{s.note}</dd>
        </div>
      ))}
    </dl>
  );
};

export default AdminStats;

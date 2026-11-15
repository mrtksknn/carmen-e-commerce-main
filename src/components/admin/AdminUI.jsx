import React, { forwardRef } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { motion, useReducedMotion } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

// Shared building blocks for the studio dashboard. The dashboard is a working
// tool: quiet surfaces, one accent, fast feedback; the gallery's drama stays
// on the public pages.

export const useAdminT = () => {
  const { t } = useLanguage();
  return (key, vars) => {
    let s = t('admin', key) || '';
    if (vars) Object.entries(vars).forEach(([k, v]) => { s = s.replace(`{${k}}`, v); });
    return s;
  };
};

export const inputClass =
  'w-full px-4 py-3 rounded-[4px] bg-white/[0.03] border border-white/15 text-white text-sm placeholder:text-white/30 transition-colors duration-150 hover:border-white/25 focus:outline-none focus:border-primary-light focus:bg-white/[0.05] disabled:opacity-50';

const buttonVariants = {
  primary: 'bg-white text-black hover:bg-primary hover:text-white',
  accent: 'bg-primary text-white hover:bg-primary-hover',
  secondary: 'border border-white/20 text-white/85 hover:border-white/50 hover:text-white',
  ghost: 'text-white/60 hover:text-white hover:bg-white/[0.06]',
  danger: 'text-white/60 hover:text-red-300 hover:bg-red-500/10',
};

export const Button = forwardRef(({ variant = 'primary', icon: Icon, loading, children, className = '', ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    {...props}
    disabled={props.disabled || loading}
    className={`inline-flex items-center justify-center gap-2 h-10 px-5 rounded-full text-[13px] font-medium tracking-wide transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light focus-visible:ring-offset-2 focus-visible:ring-offset-background ${buttonVariants[variant]} ${className}`}
  >
    {loading ? (
      <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
    ) : Icon ? (
      <Icon size={16} strokeWidth={1.75} />
    ) : null}
    {children}
  </button>
));
Button.displayName = 'Button';

const iconTones = {
  neutral: 'hover:text-white hover:bg-white/[0.08]',
  accent: 'hover:text-primary-light hover:bg-primary/10',
  danger: 'hover:text-red-300 hover:bg-red-500/10',
};

export const IconButton = ({ label, tone = 'neutral', children, className = '', ...props }) => (
  <button
    type="button"
    aria-label={label}
    title={label}
    {...props}
    className={`w-9 h-9 [@media(pointer:coarse)]:w-11 [@media(pointer:coarse)]:h-11 inline-flex items-center justify-center rounded-full text-white/55 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light ${iconTones[tone]} ${className}`}
  >
    {children}
  </button>
);

export const Field = ({ label, required, requiredLabel, htmlFor, children, className = '' }) => (
  <div className={className}>
    <label htmlFor={htmlFor} className="flex items-baseline gap-2 mb-2 text-[12px] font-medium text-white/70">
      {label}
      {required && <span className="text-[11px] font-normal text-white/35">({requiredLabel})</span>}
    </label>
    {children}
  </div>
);

export const Panel = ({ title, description, action, children }) => (
  <section className="rounded-[6px] border border-white/10 bg-[#0b0b0b]">
    <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 px-6 sm:px-8 pt-7 pb-6 border-b border-white/10">
      <div>
        <h2 className="font-serif font-light text-3xl text-white leading-tight">{title}</h2>
        {description && <p className="mt-1.5 text-sm text-white/50">{description}</p>}
      </div>
      {action}
    </header>
    <div className="p-4 sm:p-8">{children}</div>
  </section>
);

const badgeTones = {
  available: 'text-white/80 before:bg-white/60',
  sold: 'text-primary-light before:bg-primary-light',
  pending: 'text-amber-200/90 before:bg-amber-300',
  replied: 'text-white/60 before:bg-white/40',
};

export const StatusBadge = ({ tone, children }) => (
  <span className={`inline-flex items-center gap-2 text-[12px] font-medium before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full ${badgeTones[tone]}`}>
    {children}
  </span>
);

export const Pagination = ({ page, total, onChange }) => {
  const at = useAdminT();
  if (total <= 1) return null;
  return (
    <nav className="flex items-center justify-between gap-4 pt-6" aria-label="Pagination">
      <Button variant="ghost" icon={ChevronLeft} onClick={() => onChange(page - 1)} disabled={page === 1}>
        {at('prev')}
      </Button>
      <span className="text-sm text-white/50 tabular-nums">{at('pageOf', { p: page, n: total })}</span>
      <Button variant="ghost" onClick={() => onChange(page + 1)} disabled={page === total}>
        {at('next')}
        <ChevronRight size={16} strokeWidth={1.75} />
      </Button>
    </nav>
  );
};

/** Standard dashboard dialog: a quiet panel that rises a few pixels into place. */
export const AdminDialog = ({ open, onOpenChange, title, description, children, className = 'max-w-md' }) => {
  const reduce = useReducedMotion();
  const at = useAdminT();
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/80 z-[150]" />
        <Dialog.Content className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100vw-2rem)] max-h-[calc(100svh-2rem)] overflow-y-auto z-[151] outline-none ${className}`}>
          <motion.div
            initial={{ opacity: 0, y: reduce ? 0 : 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-[6px] border border-white/10 bg-[#0e0e0e] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.9)]"
          >
            <div className="flex items-start justify-between gap-6 px-6 sm:px-8 pt-7 pb-5 border-b border-white/10">
              <div>
                <Dialog.Title className="font-serif font-light text-2xl text-white">{title}</Dialog.Title>
                {description ? (
                  <Dialog.Description className="mt-1 text-sm text-white/50">{description}</Dialog.Description>
                ) : (
                  <Dialog.Description className="sr-only">{title}</Dialog.Description>
                )}
              </div>
              <Dialog.Close asChild>
                <IconButton label={at('close')}><X size={16} /></IconButton>
              </Dialog.Close>
            </div>
            <div className="px-6 sm:px-8 py-6">{children}</div>
          </motion.div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

import React, { forwardRef } from 'react';
import { Link as RouterLink, Navigate as RouterNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

const localized = (to, lp) => (typeof to === 'string' && to.startsWith('/') ? lp(to) : to);

/**
 * react-router's Link, but site paths are written in Turkish (root) form and
 * sent to the current language: on an English page "/products" opens
 * "/en/products" and "/eser/x" opens "/en/artwork/x".
 */
export const Link = forwardRef(({ to, ...props }, ref) => {
  const { lp } = useLanguage();
  return <RouterLink ref={ref} to={localized(to, lp)} {...props} />;
});
Link.displayName = 'LocaleLink';

/** react-router's Navigate with the same language handling. */
export const Navigate = ({ to, ...props }) => {
  const { lp } = useLanguage();
  return <RouterNavigate to={localized(to, lp)} {...props} />;
};

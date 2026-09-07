import React, { createContext, useContext, useState, useEffect } from 'react';

const InquiryContext = createContext();

export const InquiryProvider = ({ children }) => {
  const [inquiryList, setInquiryList] = useState([]);

  // Load from localStorage on mount
  useEffect(() => {
    const savedList = localStorage.getItem('carmen_inquiry_list');
    if (savedList) {
      try {
        setInquiryList(JSON.parse(savedList));
      } catch (e) {
        console.error('Failed to parse inquiry list', e);
      }
    }
  }, []);

  // Save to localStorage whenever list changes
  useEffect(() => {
    localStorage.setItem('carmen_inquiry_list', JSON.stringify(inquiryList));
  }, [inquiryList]);

  const addToInquiry = (artwork) => {
    setInquiryList((prev) => {
      const exists = prev.find(item => item.id === artwork.id);
      if (exists) return prev;
      return [...prev, artwork];
    });
  };

  const removeFromInquiry = (artworkId) => {
    setInquiryList((prev) => prev.filter(item => item.id !== artworkId));
  };

  const clearInquiry = () => {
    setInquiryList([]);
  };

  const isInInquiry = (artworkId) => {
    return inquiryList.some(item => item.id === artworkId);
  };

  return (
    <InquiryContext.Provider value={{ 
      inquiryList, 
      addToInquiry, 
      removeFromInquiry, 
      clearInquiry, 
      isInInquiry 
    }}>
      {children}
    </InquiryContext.Provider>
  );
};

export const useInquiry = () => {
  const context = useContext(InquiryContext);
  if (!context) {
    throw new Error('useInquiry must be used within an InquiryProvider');
  }
  return context;
};

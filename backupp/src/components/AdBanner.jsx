import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const AdBanner = ({ slotId, format = 'auto', className = '', label = true }) => {
  const { t, language } = useLanguage();
  
  // In a real production environment with Google AdSense approved, 
  // you would uncomment the <ins> tag and remove the placeholder div.
  
  return (
    <div className={`w-full my-8 flex flex-col items-center justify-center ${className}`}>
      {label && (
        <span className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">
          {language === 'ar' ? 'إعلان' : 'Advertisement'}
        </span>
      )}
      
      <div className="w-full max-w-[728px] h-[90px] bg-gray-100 border border-gray-200 border-dashed rounded-lg flex items-center justify-center overflow-hidden relative group">
        {/* Placeholder for AdSense */}
        <div className="text-center p-4">
          <p className="text-gray-400 text-sm font-medium">Google AdSense Space</p>
          <p className="text-gray-300 text-xs mt-1">Responsive Banner</p>
        </div>

        {/* Actual AdSense Code Structure (Commented out until Slot ID is provided) */}
        {/* 
        <ins className="adsbygoogle"
             style={{ display: 'block' }}
             data-ad-client="ca-pub-5400522311718555"
             data-ad-slot={slotId || "1234567890"}
             data-ad-format={format}
             data-full-width-responsive="true"></ins>
        <script>
             (adsbygoogle = window.adsbygoogle || []).push({});
        </script> 
        */}
        
        {/* Hover Effect for Demo */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
      </div>
    </div>
  );
};

export default AdBanner;
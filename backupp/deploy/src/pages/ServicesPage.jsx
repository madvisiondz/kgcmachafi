import React from 'react';
import Services from '@/components/Services';
import MedicalSupplies from '@/components/MedicalSupplies';
import HealthExhibitions from '@/components/HealthExhibitions';

const ServicesPage = () => {
  return (
    <div className="space-y-16">
      <Services />
      <MedicalSupplies />
      <HealthExhibitions />
    </div>
  );
};

export default ServicesPage;
